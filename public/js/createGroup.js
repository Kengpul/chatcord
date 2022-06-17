const socket = io();
const createGroupForm = document.querySelector('.createGroupForm');
const groupContainer = document.querySelector('.group-container');
const createGroup = document.querySelector('#createGroupModal');
const modal = new bootstrap.Modal(createGroup);

createGroupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const description = e.target.elements.description.value;
    socket.emit('createGroup', name, description);
    e.target.elements.name.value = '';
    e.target.elements.description.value = '';
    modal.hide();
    // TODO: fix scroll to the bottom after creating a new group
    window.scrollTo(0, document.body.scrollHeight);
})

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