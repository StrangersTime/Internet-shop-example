import { cart, updateProductQuantity, updateQuantity } from "./cart.js";

export class CartItem {
  constructor(cartItemData) {
    this.id = cartItemData.id;
    this.name = cartItemData.name;
    this.price = cartItemData.price;
    this.image = cartItemData.image;
    this.quantity = cartItemData.quantity;
  }

  createCard() {
    const card = document.createElement("div");
    card.className = "cart-item";

    const img = document.createElement("img");
    img.src = this.image;
    img.alt = this.name;
    img.className = "cart-item-image";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("h3");
    name.className = "cart-item-name";
    name.textContent = this.name;

    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = `${this.price} ₽`;

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minusBtn = document.createElement("button");
    minusBtn.className = "quantity-btn";
    minusBtn.textContent = "−";
    minusBtn.addEventListener("click", () => {
      updateProductQuantity(-1, this.id);
      renderCartPage();
    });

    const quantityDisplay = document.createElement("span");
    quantityDisplay.className = "quantity-display";
    quantityDisplay.textContent = this.quantity;

    const plusBtn = document.createElement("button");
    plusBtn.className = "quantity-btn";
    plusBtn.textContent = "+";
    plusBtn.addEventListener("click", () => {
      updateProductQuantity(1, this.id);
      renderCartPage();
    });

    controls.append(minusBtn, quantityDisplay, plusBtn);

    info.append(name, price);
    card.append(img, info, controls);
    return card;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".js-checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    if (cart.length !== 0) {
      alert("Заказ оформлен!");
      checkoutBtn.disabled = cart.length === 0;
    }
  });
});

function makeCheckOutButtonWorking() {
  const checkOutBtn = document.querySelector(".js-checkout-btn");
  if (checkOutBtn) {
    checkOutBtn.disabled = cart.length === 0;
  }
}

function renderCartPage() {
  fetch("../data/product.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные");
      }
      return response.json();
    })
    .then((productData) => {
      const cartContainer = document.querySelector(".js-cart-container");
      cartContainer.textContent = "";
      const fullCart = getCartWithProducts(cart, productData);
      if (fullCart.length !== 0) {
        const preparedForRenderCards = fullCart.map((cartItem) =>
          new CartItem(cartItem).createCard()
        );
        preparedForRenderCards.forEach((renderCard) =>
          cartContainer.append(renderCard)
        );
      } else {
        const emptyCartDiv = document.createElement("div");
        emptyCartDiv.className = "empty-car-div";

        const emptyCartText = document.createElement("p");
        emptyCartText.className = "empty-cart-text";
        const emptyCartTextWithLink = document.createElement("p");
        emptyCartTextWithLink.className = "empty-cart-text-with-link";

        emptyCartText.textContent = "На данный момент корзина пустует...";
        emptyCartTextWithLink.innerHTML = `Но вы всегда можете выбрать интересующие вас товары в нашем <a class="empty-car-link" href="main-page.html">каталоге</a>!`;

        emptyCartDiv.append(emptyCartText, emptyCartTextWithLink);
        cartContainer.append(emptyCartDiv);
      }
      updateQuantity();
      updateTotalPrice(fullCart);
      makeCheckOutButtonWorking();
    })
    .catch((error) => {
      console.error("Что-то пошло не так: " + error.message);
      alert("Произошла ошибка");
    });
}

function getCartWithProducts(cart, productData) {
  const productMap = new Map();
  productData.forEach((product) => {
    productMap.set(product.id, product);
  });

  const cartWithDetails = cart
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        console.warn(`Товар с id=${item.productId} не найден в каталоге`);
        return null;
      }
      return {
        ...product,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  return cartWithDetails;
}

function updateTotalPrice(fullCart) {
  const totalPrice = document.querySelector(".js-total-price");

  totalPrice.textContent =
    fullCart.reduce(
      (totalCost, item) => totalCost + item.price * item.quantity,
      0
    ) + "₽";
}

renderCartPage();
