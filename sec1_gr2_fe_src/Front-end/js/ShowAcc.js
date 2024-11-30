const API_URL = 'http://localhost:3030';
document.addEventListener('DOMContentLoaded', () => {
    fetchAdmins();
    setupModalEvents();
    SearchForm();
});

function fetchAdmins(filters = {}) {
    axios.get(`${API_URL}/admins`)
        .then(response => {
            const data = response.data.data;
            const filteredData = applyFilters(data, filters);
            renderAdminTable(filteredData);
        })
        .catch(error => console.error('Error fetching admins:', error));
}

function applyFilters(data, filters) {
    return data.filter(admin => {
        let isMatch = true;

        if (filters.searchText) {
            const lowerSearchText = filters.searchText.toLowerCase();
            isMatch = isMatch && (
                admin.admin_id.toString().includes(lowerSearchText) ||
                admin.first_name.toLowerCase().includes(lowerSearchText) ||
                admin.last_name.toLowerCase().includes(lowerSearchText) ||
                admin.address.toLowerCase().includes(lowerSearchText) ||
                admin.email.toLowerCase().includes(lowerSearchText) ||
                admin.username.toLowerCase().includes(lowerSearchText)
                
            );
        }

        return isMatch;
    });
}

function renderAdminTable(data) {
    const adminTable = document.querySelector('#adminTable');
    adminTable.innerHTML = '';

    data.forEach((admin) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${admin.admin_id}</td>
            <td>${admin.first_name}</td>
            <td>${admin.last_name}</td>
            <td>${admin.address}</td>
            <td>${admin.email}</td>
            <td>${admin.username}</td>
            <td>${admin.password_hash}</td>
            <td>${admin.created_at}</td>
            <td class="container-btn">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        adminTable.appendChild(row);
        const editButton = row.querySelector('.edit-btn');
        const deleteButton = row.querySelector('.delete-btn');

        editButton.addEventListener('click', () => editAdmin(admin.admin_id));
        deleteButton.addEventListener('click', () => deleteAdmin(admin.admin_id));
    });
}

function SearchForm() {
    const searchForm = document.querySelector('.btn-search');
    searchForm.addEventListener('click', (event) => {
        event.preventDefault();

        const searchText = document.querySelector('.input-search').value;

        const filters = {
            searchText: searchText || ''
        };

        fetchAdmins(filters);
    });
}

function editAdmin(adminId) {
    axios.get(`${API_URL}/admin/${adminId}`)
        .then(response => {
            const admin = response.data.data;

            document.getElementById('admin_id').value = admin.admin_id;
            document.getElementById('first_name').value = admin.first_name;
            document.getElementById('last_name').value = admin.last_name;
            document.getElementById('address').value = admin.address;
            document.getElementById('email').value = admin.email;
            document.getElementById('username').value = admin.username;
            document.getElementById('passwd').value = admin.password_hash;
            openEditModal();
        })
        .catch(error => console.error('Error fetching admin data:', error));
}

function saveChanges() {
    const updatedAdmin = {
        admin_id: document.getElementById('admin_id').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password_hash: document.getElementById('passwd').value
    };

    axios.put(`${API_URL}/admin`, updatedAdmin)
        .then(() => {
            swal.fire({
                title: "Updated!",
                text: "Admin details updated successfully.",
                icon: "success"
            }).then(() => {
                closeModal();
                fetchAdmins();
            });
        })
        .catch(error => {
            console.error('Error updating admin:', error);
            swal.fire({
                title: "Error!",
                text: "Failed to update admin details.",
                icon: "error"
            });
        });
}

function openEditModal() {
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

function setupModalEvents() {
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
}

function deleteAdmin(adminId) {
    swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${API_URL}/admin/${adminId}`)
                .then(() => {
                    swal.fire({
                        title: "Deleted!",
                        text: "The admin record has been deleted.",
                        icon: "success"
                    }).then(() => {
                        fetchAdmins();
                    });
                })
                .catch(error => {
                    console.error("Error deleting admin:", error);
                    swal.fire({
                        title: "Error!",
                        text: "There was an issue deleting the admin record.",
                        icon: "error"
                    });
                });
        }
    });
}
