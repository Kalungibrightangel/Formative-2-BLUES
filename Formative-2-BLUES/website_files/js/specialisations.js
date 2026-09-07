/* =========================================================
   SOFTWARE EXPLORER - SPECIALISATIONS PAGE
   Handles the "Explore" buttons that sit on top of each
   specialisation's visual image and reveal a details panel
   with career paths and course information.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const exploreButtons = document.querySelectorAll('.spec-explore-btn');

    exploreButtons.forEach(function (button) {

        button.addEventListener('click', function () {

            // The button's data-target attribute points to the
            // id of the details panel it should reveal.
            const targetId = button.getAttribute('data-target');
            const panel = document.getElementById(targetId);
            if (!panel) return;

            const isOpen = panel.classList.contains('open');

            // Close any other open panels first, so only one
            // specialisation is expanded at a time.
            document.querySelectorAll('.spec-details.open').forEach(function (openPanel) {
                if (openPanel !== panel) {
                    openPanel.classList.remove('open');
                    const otherBtn = document.querySelector('[data-target="' + openPanel.id + '"]');
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherBtn.textContent = 'Explore';
                    }
                }
            });

            // Toggle the clicked panel open/closed.
            panel.classList.toggle('open', !isOpen);
            button.setAttribute('aria-expanded', String(!isOpen));
            button.textContent = isOpen ? 'Explore' : 'Close';

            // Smoothly bring the newly opened panel into view.
            if (!isOpen) {
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

});
