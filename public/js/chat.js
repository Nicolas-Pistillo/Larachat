const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const CHAT_WITH = get('.chatWith');
const TYPING = get('.typing');
const CHAT_STATUS = get('.chatStatus');
const LOBBY_ID = get('#id_chat').value;

let authUser;
let lobbyUsers;

let typingTimer = false;

window.onload = function() {
    axios.get('/auth/user')
        .then(res => {
            authUser = res.data.authUser;
        });

    axios.get(`/chat/${LOBBY_ID}/getUsers`)
        .then(res => {
            let results = res.data.users.filter(user => user.id != authUser.id);

            if (results.length > 0) {
                CHAT_WITH.innerHTML = results[0].name
            }
        })
        .then(() => {
            axios.get(`/chat/${LOBBY_ID}/getMessages`)
            .then(res => {
                appendMessages(res.data.messages);
            })
        })
}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;

    if (!msgText) return;

    /**TODO EL CODIGO DEL ENVIO**/

    axios.post('/message/sent',{
        message: msgText,
        lobby_id: LOBBY_ID // Pendiente a ser dinamico
    }).then(data => {

        let res = data.data;

        appendMessage(
            res.user.name,
            PERSON_IMG,
            'right',
            res.content,
            formatDate(new Date(res.created_at))
        );
    })
    .catch(err => console.log(err));

    msgerInput.value = "";

});

function appendMessages(messages) {
    let side = 'left';

    messages.forEach(message=> {
        side = (message.user.id === authUser.id) ? 'right' : 'left';

        appendMessage(
            message.user.name,
            PERSON_IMG,
            side,
            message.content,
            formatDate(new Date(message.created_at))
        );
    })
}

function appendMessage(name, img, side, text, date) {
  //   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
            <div class="msg-img" style="background-image: url(${img})"></div>

            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${date}</div>
                </div>

                <div class="msg-text">${text}</div>
            </div>

        </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    scrollToBottom();
}

function scrollToBottom() {
    msgerChat.scrollTop = msgerChat.scrollHeight;
}

function sendTypingEvent() {

    typingTimer = true;

    Echo.join(`chat.${LOBBY_ID}`)
    .whisper('typing',msgerInput.value.length) // Registra evento typing dentro del canal 
}

// LARAVEL ECHO

Echo.join(`chat.${LOBBY_ID}`)
.listen('MessageSent', message => {
    message = message.message;
    appendMessage(
        message.user.name,
        PERSON_IMG,
        'left',
        message.content,
        formatDate(new Date(message.user.created_at))
    );
})
.here(users => { // Retorna las instancias de los usuarios activos en el canal
    let result = users.filter(user => user.id !== authUser.id);
    if (result.length > 0) {
        CHAT_STATUS.className = 'chatStatus online';
    }
})
.joining(user => { // Retorna el usuario que entra al canal
    if (user.id !== authUser.id) {
        CHAT_STATUS.className = 'chatStatus online';
    }
})
.leaving(user => { // Retorna el usuario que abandona el canal
    if (user.id !== authUser.id) {
        CHAT_STATUS.className = 'chatStatus offline';
    }
})
.listenForWhisper('typing',e => { // Escuchar el evento del whisper anteriormente realizado
    if (e >= 4) {
        TYPING.style.display = 'block';
    } 

    if (typingTimer) {
        clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
        TYPING.style.display = 'none';
        typingTimer = false;
    }, 3000);
})

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const d = date.getDay();
    const mo = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${d}/${mo}/${y} ${h.slice(-2)}:${m.slice(-2)}`;
}
