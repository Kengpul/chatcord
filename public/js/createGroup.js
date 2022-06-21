const socket = io();
const createGroupForm = document.querySelector('.createGroupForm');
const groupContainer = document.querySelector('.group-container');
const createGroup = document.querySelector('#createGroupModal');
const modal = new bootstrap.Modal(createGroup);

(() => {
    'use strict'

    const forms = document.querySelectorAll('.validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
            event.preventDefault();
            const name = event.target.elements.name.value;
            const description = event.target.elements.description.value;
            if (name && description) {
                socket.emit('createGroup', name, description);
                event.target.elements.name.value = '';
                event.target.elements.description.value = '';
                modal.hide()
            }

        }, false)

    })
})()


socket.on('newGroup', (name, description) => {
    newGroup(name, description)
})

const newGroup = (name, description) => {
    const div = document.createElement('div');
    div.classList.add('col');
    const newBlock =
        `<div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}
                        </p>
                        <a href="/${name}" class="btn btn-primary w-100">Join</a>
                    </div>
                </div>`
    div.innerHTML = newBlock;
    groupContainer.append(div)
}