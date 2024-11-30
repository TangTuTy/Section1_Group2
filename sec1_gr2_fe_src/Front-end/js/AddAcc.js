
const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
document.getElementById('getBtn').addEventListener('click', getAccount);
document.getElementById('createBtn').addEventListener('click', createAccount);
});

function showSuccessMessage(message) {
    swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
    });
}

function alertNoID(message) {
    swal.fire({
        icon: "error",
        title: "Oops ...",
        text: message,
    });
}

function getAccount() {
    const adminId = document.getElementById('admin_id').value;
    if (!adminId) {
        alertNoID("Please provide admin ID to fetch data.")
        return;
    }

    axios.get(`${API_URL}/admin/${adminId}`)
        .then(response => {
            const data = response.data;
            swal.fire(`Fetched Account Data: ${JSON.stringify(data, null, 2)}`);
        })
        .catch(error => {
            console.error('Error fetching account:', error);
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error fetching account: ${error.message}`,
            });
        });
}

function createAccount() {
    const accountData = getFormData();
    axios.post(`${API_URL}/admin`, accountData)
        .then(() => showSuccessMessage("Account created successfully!"))
        .catch(error => Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Error creating account: ${error.message}`,
        }));
}

function getFormData() {
    return {
        admin_id: document.getElementById('admin_id').value,
        first_name: document.getElementById('fname').value,
        last_name: document.getElementById('lname').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password_hash: document.getElementById('passwd').value
    };
}
