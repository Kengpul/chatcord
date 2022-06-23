const successText = document.querySelector('.success-body');
const errorText = document.querySelector('.error-body');

const triggerToast = (status) => {
    const toastBlock = document.querySelector(`#${status}`);
    const toast = new bootstrap.Toast(toastBlock);
    toast.show();
}

if (successText.innerText.trim()) {
    triggerToast('success');
} else if (errorText.innerText.trim()) {
    triggerToast('error');
}