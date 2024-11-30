const API_URL = 'http://localhost:3030/products';

document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.querySelector(".btn-search");
    const typeSelect = document.querySelector(".select");
    const budgetInput = document.querySelector(".input-price");
    const searchInput = document.querySelector(".input-search");

    searchButton.addEventListener("click", async function () {
        const type = typeSelect.value || ""; 
        const budget = parseFloat(budgetInput.value) || 1000000000000000;
        const searchQuery = searchInput.value;
        try {
            const response = await fetch(API_URL);
            const result = await response.json();

            if (result.error || !result.data) {
                throw new Error("Failed to fetch products");
            }

            let products = result.data;

            products = products.filter(product => {
                const matchesType = type ? product.category.toLowerCase() === type.toLowerCase() : true;
                const matchesBudget = product.price <= budget;
                const matchesSearch = searchQuery
                    ? product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.Name.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;

                return matchesType && matchesBudget && matchesSearch;
            });

            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error.message);
            document.querySelector(".product_container").innerHTML =
                "<p>Failed to load products. Please try again later.</p>";
        }
    });
});

function renderProducts(products) {
    const productContainer = document.querySelector(".product_container");
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = "<p>No products found for the selected criteria.</p>";
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
}
