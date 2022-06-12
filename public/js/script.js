const socket = io();
const form = document.querySelector('.messageForm');
const input = document.querySelector('.messageInput');
const wrapper = document.querySelector('.chat-wrapper');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    let message = input.value;
    socket.emit('message', message);
    input.value = '';
    wrapper.scrollTop = wrapper.scrollHeight;
})

socket.on('displayMessage', message => {
    displayMessage(message);
})

const displayMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('mb-3');
    div.innerText = message;
    wrapper.append(div);
}