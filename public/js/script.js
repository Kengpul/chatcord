const socket = io();
const form = document.querySelector('.messageForm');
const input = document.querySelector('.messageInput');
const wrapper = document.querySelector('.chat-wrapper');
const room = window.location.href.slice(window.location.href.lastIndexOf('/')).slice(1);

window.addEventListener('load', () => {
    wrapper.scrollTop = wrapper.scrollHeight;
    socket.emit('joinChat', room);
})

form.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = input.value;
    if (!message) return;
    const room = input.name;
    const username = input.attributes.user.value;
    socket.emit('message', message, room, username);
    input.value = '';
})

socket.on('displayMessage', async (chat) => {
    const lastChildAuthor = wrapper.children[wrapper.children.length - 1].outerText.split('\n')[0];
    if (lastChildAuthor === chat.author) {
        console.log('text only')
        displayTextOnly(chat);
    } else {
        console.log('full')
        displayFullMessage(chat);
    }
})

const displayFullMessage = (chat) => {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="my-3">
        <div class="d-flex align-items-center">
            <div class="profile-picture">
                <img src="https://preview.redd.it/dp9hxyn79cz61.png?auto=webp&s=1b953b04d300e94b6efa254f0bf4eefa297242a3"
                    class="img-fluid" width="35" alt="">
            </div>
            <div class="chat-content">
                <div class="chat-info d-flex ms-3">
                    <h6 class="fs-6 me-2">${chat.author}</h6>
                    <small class="text-white-50">${chat.time}</small>
                </div>
            </div>
        </div>
        <div class="chat-message ms-5">
            <p>
                ${chat.message}
            </p>
        </div>
    </div> 
    `
    wrapper.append(div);
    wrapper.scrollTop = wrapper.scrollHeight;
}

const displayTextOnly = (chat) => {
    const container = document.querySelectorAll('.chat-message');
    const lastContainer = container[container.length - 1];
    const p = document.createElement('p');
    p.innerText = chat.message;
    lastContainer.append(p);
    wrapper.scrollTop = wrapper.scrollHeight;
}