document.addEventListener("DOMContentLoaded", function() {
    const decreaseButton = document.getElementById("decrease");
    const increaseButton = document.getElementById("increase");
    const quantityInput = document.getElementById("quantity");

    decreaseButton.addEventListener("click", function() {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    increaseButton.addEventListener("click", function() {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
});
