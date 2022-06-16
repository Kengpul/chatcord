const socket = io();
const form = document.querySelector('.messageForm');
const input = document.querySelector('.messageInput');
const wrapper = document.querySelector('.chat-wrapper');

const room = window.location.href.slice(window.location.href.lastIndexOf('/')).slice(1);

window.addEventListener('load', () => {
    socket.emit('joinChat', room);
})

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let message = input.value;
    const room = input.name;
    socket.emit('message', message, room);
    input.value = '';
})

socket.on('displayMessage', message => {
    displayMessage(message);
})

const displayMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('mb-3');
    div.innerText = message;
    wrapper.append(div);
    wrapper.scrollTop = wrapper.scrollHeight;
}