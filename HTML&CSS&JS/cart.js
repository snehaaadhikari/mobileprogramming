let cartCount = 0;
const cartCountSpan = document.getElementById("cart-count");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cartCount++;
    cartCountSpan.textContent = cartCount;
  });
});
