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
        });
}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;

    if (!msgText) return;

    /**TODO EL CODIGO DEL ENVIO**/

    axios.post('/message/sent',{
        message: msgText,
        lobby_id: 5 // Pendiente a ser dinamico
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
    msgerChat.scrollTop += 500;
}

// LARAVEL ECHO

Echo.join(`chat.${LOBBY_ID}`)
.listen('MessageSent', data => {
    data = data.message;
    appendMessage(
        data.user.name,
        PERSON_IMG,
        'left',
        data.content,
        formatDate(new Date(data.user.created_at))
    );
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
