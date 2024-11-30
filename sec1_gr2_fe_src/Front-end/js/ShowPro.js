const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupModalEvents();
    SearchForm();
});

function fetchProducts(filters = {}) {
    axios.get(`${API_URL}/products`)
    .then(response => {
        const data = response.data.data;
        const filteredData = applyFilters(data, filters);
        renderProductTable(filteredData);
    })
    .catch(error => console.error('Error fetching products:', error));
}

function applyFilters(data, filters) {
    return data.filter(product => {
        let isMatch = true;

        if (filters.searchText) {
            const lowerSearchText = filters.searchText.toLowerCase();
            isMatch = isMatch && (
                product.Name.toLowerCase().includes(lowerSearchText) ||
                product.brand.toLowerCase().includes(lowerSearchText) ||
                product.color.toLowerCase().includes(lowerSearchText)
            );
        }

        if (filters.category) {
            isMatch = isMatch && product.category === filters.category;
        }

        if (filters.price) {
            isMatch = isMatch && product.price <= filters.price;
        }

        return isMatch;
    });
}

function renderProductTable(data) {
    const productTable = document.querySelector('#productTable');
    productTable.innerHTML = '';

    data.forEach((product) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.product_id}</td>
            <td>${product.brand}</td>
            <td>${product.Name}</td>
            <td>${product.price}</td>
            <td>${product.color}</td>
            <td>${product.category}</td>
            <td>${product.stock_quantity}</td>
            <td><img src="/uploads${product.Main_Image}" alt="Main Image" style="max-width: 100px;"></td>
            <td><img src="/uploads${product.Det_Image}" alt="Detail Image" style="max-width: 100px;"></td>
            <td><img src="/uploads${product.Th1_Image}" alt="Thumbnail 1" style="max-width: 100px;"></td>
            <td><img src="/uploads${product.Th2_Image}" alt="Thumbnail 2" style="max-width: 100px;"></td>
            <td><img src="/uploads${product.Th3_Image}" alt="Thumbnail 3" style="max-width: 100px;"></td>
            <td>${product.created_at}</td>
            <td>${product.updated_at}</td>
            <td class="container-btn">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        productTable.appendChild(row);
        const editButton = row.querySelector('.edit-btn');
        const deleteButton = row.querySelector('.delete-btn');

        editButton.addEventListener('click', () => editProduct(product.product_id));
        deleteButton.addEventListener('click', () => deleteProduct(product.product_id));
    });
}

function SearchForm() {
    const searchBtn = document.querySelector('.btn-search');
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();

        const searchText = document.querySelector('.input-search').value;
        const category = document.querySelector('.select').value;
        const price = document.querySelector('.input-price').value;

        const filters = {
            searchText: searchText || '',
            category: category || '',
            price: price ? parseFloat(price) : null
        };

        fetchProducts(filters);
    });
}


function editProduct(productId) {
    axios.get(`${API_URL}/product/${productId}`)
        .then(response => {
            const product = response.data.data;

            document.getElementById('product_id').value = product.product_id;
            document.getElementById('brand').value = product.brand;
            document.getElementById('name').value = product.Name;
            document.getElementById('price').value = product.price;
            document.getElementById('color').value = product.color;
            document.getElementById('category').value = product.category;
            document.getElementById('stock_quantity').value = product.stock_quantity;

            document.getElementById('previewMainImage').src = `/uploads${product.Main_Image}` || '';
            document.getElementById('previewDetailImage').src = `/uploads${product.Det_Image}` || '';
            document.getElementById('previewThumbnail1').src = `/uploads${product.Th1_Image}` || '';
            document.getElementById('previewThumbnail2').src = `/uploads${product.Th2_Image}` || '';
            document.getElementById('previewThumbnail3').src = `/uploads${product.Th3_Image}` || '';

            openEditModal();
        })
        .catch(error => console.error('Error fetching product data:', error));
}

function saveChanges() {
    const modal = document.getElementById('editModal');
    const updatedProduct = {
        product_id: document.getElementById('product_id').value || '',
        brand: document.getElementById('brand').value || '',
        Name: document.getElementById('name').value || 'Unnamed',
        price: document.getElementById('price').value || 0,
        color: document.getElementById('color').value || '',
        category: document.getElementById('category').value || '',
        stock_quantity: document.getElementById('stock_quantity').value || 0,
    };
    
    const formData = new FormData();
    Object.keys(updatedProduct).forEach(key => {
        formData.append(key, updatedProduct[key]);
    });
    
    const mainImage = document.getElementById('main_image').files[0];
    if (mainImage) formData.append('Main_img', mainImage);


    axios.put(`${API_URL}/product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then(response => {
            swal.fire({
                title: 'Updated!',
                text: 'Product details updated successfully.',
                icon: 'success',
            }).then(() => {
                modal.style.display = 'none';
                fetchProducts();
                
            })
        })
        .catch(error => {
            swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update product details.',
                icon: 'error',
            });
        });
}

function openEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function setupModalEvents() {
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
}

function deleteProduct(productId) {
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
            axios.delete(`${API_URL}/product/${productId}`)
                .then(() => {
                    swal.fire({
                        title: "Deleted!",
                        text: "The product record has been deleted.",
                        icon: "success"
                    }).then(() => {
                        const row = document.querySelector(`tr[data-id="${productId}"]`);
                        if (row) row.remove();
                        fetchProducts();
                    });
                })
                .catch(error => {
                    console.error("Error deleting product:", error);
                    swal.fire({
                        title: "Error!",
                        text: "There was an issue deleting the product record.",
                        icon: "error"
                    });
                });
        }
    });
}
