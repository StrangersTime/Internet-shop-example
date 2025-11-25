export const cart = JSON.parse(localStorage.getItem("cart")) || [];

export function addProductToCart(cartId, quantity) {
  console.log(cartId, quantity);

  const itemCart = cart.find((item) => item.productId === cartId);
  if (itemCart) {
    itemCart.quantity += Number(quantity);
  } else {
    cart.push({
      productId: cartId,
      quantity,
    });
  }
  updateQuantity();
  console.log(itemCart, cart);
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateQuantity() {
  const cartBadge = document.querySelector(".js-total-items");

  cartBadge.textContent = cart.reduce(
    (productQuantity, item) => productQuantity + item.quantity,
    0
  );
}

export function updateProductQuantity(change, productId) {
  const itemCart = cart.find((item) => item.productId === productId);
  if (!itemCart) {
    console.warn(`Товар с productId=${productId} не найден в корзине`);
    return;
  }

  itemCart.quantity += change;

  if (itemCart.quantity <= 0) {
    const index = cart.findIndex((item) => item.productId === productId);
    cart.splice(index, 1);
  }

  saveToLocalStorage();
}
