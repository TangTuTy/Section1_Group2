const passwordField = document.getElementById("password");
const togglePasswordIcon = document.querySelector(".password-toggle-icon i");

togglePasswordIcon.addEventListener("click", function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePasswordIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordField.type = "password";
        togglePasswordIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
});
