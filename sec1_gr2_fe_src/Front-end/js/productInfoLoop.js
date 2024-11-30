const API_URL = "http://localhost:3030/product"

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');x
}

document.addEventListener("DOMContentLoaded", async function () {
    const productId = getProductIdFromUrl();

    if (!productId) {
        document.querySelector("main").innerHTML = "<h2>Product not found.</h2>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${productId}`);
        const result = await response.json();

        if (result.error || !result.data) {
            throw new Error("Product not found");
        }

        const product = result.data;

        document.querySelector(".product-details h4").textContent = product.brand;
        document.querySelector(".product-details h1").textContent = product.Name;
        document.querySelector(".product-details .color").textContent = product.color || "No color specified";
        document.querySelector(".product-details .price").textContent = `${product.price} THB`;

        const thumbnailContainer = document.querySelector(".thumbnail");
        thumbnailContainer.innerHTML = `
            <img src="/uploads${product.Th1_Image}" alt="Thumbnail 1">
            <img src="/uploads${product.Th2_Image}" alt="Thumbnail 2">
            <img src="/uploads${product.Th3_Image}" alt="Thumbnail 3">
        `;


        document.querySelector(".mainImage").src = `/uploads${product.Det_Image}`;

    } catch (error) {
        console.error("Error fetching product:", error.message);
        document.querySelector("main").innerHTML = "<h2>Product not found.</h2>";
    }
});
