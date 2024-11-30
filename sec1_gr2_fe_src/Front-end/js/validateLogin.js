document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const recaptcha = grecaptcha.getResponse();

    if (!username || !password) {
        swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please complete all fields",
        });
        return;
    }

    if (!recaptcha) {
        swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please complete the reCAPTCHA.",
        });
        return;
    }

    try {
        const response = await fetch("http://localhost:3030/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, recaptcha }),
            credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
            swal.fire({
                title: "Success!",
                text: "Login successful!",
                icon: "success",
            });
            setTimeout(() => {
                window.location.href = "/admin/home";
            }, 1000);
        } else {
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.error || "Login failed.",
            });
        }
    } catch (err) {
        console.error("Error during login:", err);
        swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred. Please try again.",
        });
    }
});
