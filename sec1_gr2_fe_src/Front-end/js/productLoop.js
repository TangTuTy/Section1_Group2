const API_URL = 'http://localhost:3030/products';

function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

document.addEventListener("DOMContentLoaded", async function () {
    const category = getCategoryFromUrl();

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.error || !result.data) {
            throw new Error("Failed to fetch products");
        }

        let products = result.data;

        if (category) {
            products = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
        }
    
        const productContainer = document.querySelector(".product_container");
        const head = document.querySelector(".head");
        productContainer.innerHTML = "";
        head.innerHTML = category || "Our Products";

        if (products.length === 0) {
            productContainer.innerHTML = "<p>No products found for this category.</p>";
            return;
        }

        products.forEach(product => {
            const productHTML = `
                <div class="product">
                    <a href="/product?id=${product.product_id}">
                        <img src="/uploads${product.Main_Image}" alt="${product.Name}">
                    </a>
                    <div class="PInfo">
                        <p class="brand">${product.brand}</p>
                        <p>${product.Name}</p>
                        <span class="price">${product.price.toLocaleString()} THB</span>
                    </div>
                </div>`;
            productContainer.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        document.querySelector(".product_container").innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
});
