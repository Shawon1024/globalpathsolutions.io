document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('maintenanceModal');
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    const closeButton = document.querySelector('.close-button');

    function showModal(event) {
        if (event) {
            event.preventDefault();
        }

        modal.style.display = 'flex';

        requestAnimationFrame(() => {
            modal.classList.add('modal-open');
        });
    }

    function hideModal() {
        modal.classList.remove('modal-open');

        const onTransitionEnd = () => {
            modal.style.display = 'none';
            modal.removeEventListener('transitionend', onTransitionEnd);
        };
        modal.addEventListener('transitionend', onTransitionEnd);
    }

    modal.style.display = 'none';

    if (privacyLink) {
        privacyLink.addEventListener('click', showModal);
    }
    if (termsLink) {
        termsLink.addEventListener('click', showModal);
    }

    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('modal-open')) {
            hideModal();
        }
    });
});
