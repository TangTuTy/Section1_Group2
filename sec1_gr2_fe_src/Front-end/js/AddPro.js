const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('getBtn').addEventListener('click', getProduct);
    document.getElementById('createBtn').addEventListener('click', createProduct);
    document.getElementById('updateBtn').addEventListener('click', updateProduct);
    document.getElementById('deleteBtn').addEventListener('click', deleteProduct);
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


function getProduct() {
    const productId = document.getElementById('PID').value;
    if (!productId) {
        alertNoID("Please provide Product ID to fetch data.");
        return;
    }

    axios.get(`${API_URL}/product/${productId}`)
        .then(response => {
            const data = response.data.data;
            swal.fire(`Fetched Product Data: ${JSON.stringify(data, null, 2)}`);

            document.getElementById('Brand').value = data.brand;
            document.getElementById('NamePro').value = data.Name;
            document.getElementById('Price').value = data.price;
            document.getElementById('Color').value = data.color;
            document.getElementById('Cate').value = data.category;
            document.getElementById('Quan').value = data.stock_quantity;
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error fetching product: ${error.message}`,
            });
        });
}

function createProduct() {
    const formData = getFormDataWithFiles();

    axios.post(`${API_URL}/product`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(() => showSuccessMessage('Product created successfully!'))
        .catch(error => {
            console.error('Error creating product:', error);
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error creating product: ${error.message}`,
            })
        });
}

function getFormDataWithFiles() {
    const formData = new FormData();

    formData.append('product_id', document.getElementById('PID').value);
    formData.append('brand', document.getElementById('Brand').value);
    formData.append('name', document.getElementById('NamePro').value);
    formData.append('price', document.getElementById('Price').value);
    formData.append('color', document.getElementById('Color').value);
    formData.append('category', document.getElementById('Cate').value);
    formData.append('stock_quantity', document.getElementById('Quan').value);

    const mainImage = document.getElementById('Main_img').files[0];
    const detailImage = document.getElementById('Det_img').files[0];
    const thumb1 = document.getElementById('thumb1').files[0];
    const thumb2 = document.getElementById('thumb2').files[0];
    const thumb3 = document.getElementById('thumb3').files[0];

    if (mainImage) formData.append('Main_img', mainImage);
    if (detailImage) formData.append('Det_img', detailImage);
    if (thumb1) formData.append('thumb1', thumb1);
    if (thumb2) formData.append('thumb2', thumb2);
    if (thumb3) formData.append('thumb3', thumb3);

    return formData;
}
