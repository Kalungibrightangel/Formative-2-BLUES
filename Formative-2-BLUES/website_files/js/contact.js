/* =========================================================
   SOFTWARE EXPLORER - CONTACT & FEEDBACK FORM VALIDATION
   Real-time regex validation with inline error messages,
   matching the same pattern used on the landing page form.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('contact-form');
    if (!form) return; // Safety check: only run on the contact page.

    /* Name: letters only (no digits/special characters).
       Email: standard email format. */
    const patterns = {
        name: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,
        email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    };

    const fields = {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    function setFieldState(input, errorEl, isValid, message) {
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errorEl.textContent = '';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            errorEl.textContent = message;
        }
    }

    function validateName() {
        const el = document.getElementById('contact-name-error');
        const ok = patterns.name.test(fields.name.value.trim());
        setFieldState(fields.name, el, ok, 'Please enter a valid name (letters only).');
        return ok;
    }

    function validateEmail() {
        const el = document.getElementById('contact-email-error');
        const ok = patterns.email.test(fields.email.value.trim());
        setFieldState(fields.email, el, ok, 'Please enter a valid email address.');
        return ok;
    }

    function validateSubject() {
        const el = document.getElementById('subject-error');
        const ok = fields.subject.value.trim().length >= 3;
        setFieldState(fields.subject, el, ok, 'Subject must be at least 3 characters.');
        return ok;
    }

    function validateMessage() {
        const el = document.getElementById('message-error');
        const ok = fields.message.value.trim().length >= 10;
        setFieldState(fields.message, el, ok, 'Message must be at least 10 characters.');
        return ok;
    }

    // Validate on input and blur for immediate, real-time feedback.
    fields.name.addEventListener('input', validateName);
    fields.name.addEventListener('blur', validateName);

    fields.email.addEventListener('input', validateEmail);
    fields.email.addEventListener('blur', validateEmail);

    fields.subject.addEventListener('input', validateSubject);
    fields.subject.addEventListener('blur', validateSubject);

    fields.message.addEventListener('input', validateMessage);
    fields.message.addEventListener('blur', validateMessage);

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const validName = validateName();
        const validEmail = validateEmail();
        const validSubject = validateSubject();
        const validMessage = validateMessage();

        const successEl = document.getElementById('contact-success');

        if (validName && validEmail && validSubject && validMessage) {
            if (successEl) {
                successEl.textContent = 'Thank you! Your feedback has been recorded.';
                successEl.classList.add('visible');
            }
            form.reset();
            Object.values(fields).forEach(function (field) {
                field.classList.remove('is-valid');
            });
        } else if (successEl) {
            successEl.classList.remove('visible');
        }
    });

});
