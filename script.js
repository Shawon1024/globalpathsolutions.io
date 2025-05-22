document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('maintenanceModal');
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    const closeButton = document.querySelector('.close-button');

    function showModal(event) {
        event.preventDefault();
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

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
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            hideModal();
        }
    });
});
