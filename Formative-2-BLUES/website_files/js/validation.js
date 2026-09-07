/* =========================================================
   SOFTWARE EXPLORER - STUDENT DETAILS FORM VALIDATION
   Handles the landing page form: real-time regex validation,
   inline error messages, and saving the student's details
   before they move on to the quiz.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('student-form');
    if (!form) return; // Safety check: only run on the home page.

    /* ---------------------------------------------------
       Regex patterns used for each field.
       - name: letters, spaces, hyphens and apostrophes only
         (no digits or special characters).
       - studentId: a formatted ID such as 2026/BSE/001.
       - email: a standard email OR the institutional
         "student.id@bse.ac.mu" style address.
       - phone: digits, optional leading +, 7-15 digits total.
       --------------------------------------------------- */
    const patterns = {
        name: /^[A-Za-z][A-Za-z\s'-]{1,49}$/,
        studentId: /^\d{4}\/[A-Za-z]{2,6}\/\d{2,4}$/,
        email: /^([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Za-z]+\.[A-Za-z0-9]+@bse\.ac\.mu)$/,
        phone: /^\+?\d{7,15}$/
    };

    const fields = {
        name: document.getElementById('name'),
        studentId: document.getElementById('student-id'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        year: document.getElementById('year')
    };

    /* Generic helper: show/hide the inline error message and
       toggle the .is-valid / .is-invalid classes on an input. */
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

    /* Each validator returns true/false and writes the
       appropriate inline error message. */
    function validateName() {
        const el = document.getElementById('name-error');
        const value = fields.name.value.trim();
        const ok = patterns.name.test(value);
        setFieldState(fields.name, el, ok, 'Please enter a valid name (letters only, 2-50 characters).');
        return ok;
    }

    function validateStudentId() {
        const el = document.getElementById('student-id-error');
        const value = fields.studentId.value.trim();
        const ok = patterns.studentId.test(value);
        setFieldState(fields.studentId, el, ok, 'Use the format 2026/BSE/001.');
        return ok;
    }

    function validateEmail() {
        const el = document.getElementById('email-error');
        const value = fields.email.value.trim();
        const ok = patterns.email.test(value);
        setFieldState(fields.email, el, ok, 'Enter a valid email or your student.id@bse.ac.mu address.');
        return ok;
    }

    function validatePhone() {
        const el = document.getElementById('phone-error');
        const value = fields.phone.value.trim();
        const ok = patterns.phone.test(value);
        setFieldState(fields.phone, el, ok, 'Enter a valid phone number (7-15 digits).');
        return ok;
    }

    function validateYear() {
        const el = document.getElementById('year-error');
        const ok = fields.year.value !== '';
        setFieldState(fields.year, el, ok, 'Please select your year of study.');
        return ok;
    }

    /* Real-time validation: check on every keystroke ("input")
       and again when the field loses focus ("blur") so the
       student gets immediate feedback either way. */
    fields.name.addEventListener('input', validateName);
    fields.name.addEventListener('blur', validateName);

    fields.studentId.addEventListener('input', validateStudentId);
    fields.studentId.addEventListener('blur', validateStudentId);

    fields.email.addEventListener('input', validateEmail);
    fields.email.addEventListener('blur', validateEmail);

    fields.phone.addEventListener('input', validatePhone);
    fields.phone.addEventListener('blur', validatePhone);

    fields.year.addEventListener('change', validateYear);

    /* On submit, run every validator. If all fields pass,
       store the student's details so the Results page can
       personalise the greeting, then move to the quiz. */
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const validName = validateName();
        const validId = validateStudentId();
        const validEmail = validateEmail();
        const validPhone = validatePhone();
        const validYear = validateYear();

        if (validName && validId && validEmail && validPhone && validYear) {
            const studentDetails = {
                name: fields.name.value.trim(),
                studentId: fields.studentId.value.trim(),
                email: fields.email.value.trim(),
                phone: fields.phone.value.trim(),
                year: fields.year.value
            };
            localStorage.setItem('softwareExplorerStudent', JSON.stringify(studentDetails));
            window.location.href = 'assessment.html';
        }
    });

});
