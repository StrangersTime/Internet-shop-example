import { cart, addProductToCart, updateQuantity } from "./cart.js";

export class ProductCard {
  constructor(productItem) {
    this.id = productItem.id;
    this.name = productItem.name;
    this.description = productItem.description;
    this.price = productItem.price;
    this.image = productItem.image;
  }

  createCard() {
    const card = document.createElement("div");
    card.className = "product-card";

    const productImage = document.createElement("img");
    productImage.alt = this.name;
    productImage.src = this.image;
    productImage.className = "product-image";

    const productName = document.createElement("h3");
    productName.className = "product-name";
    productName.textContent = this.name;

    const productDescription = document.createElement("p");
    productDescription.className = "product-description";
    productDescription.textContent = this.description;

    const productPrice = document.createElement("h5");
    productPrice.className = "product-price";
    productPrice.textContent = this.price + " ₽";

    const addQuantityDiv = document.createElement("div");
    addQuantityDiv.className = "add-quantity-div";

    const quantitySelector = document.createElement("select");
    quantitySelector.className = "quantity-select";
    quantitySelector.title = "quantity";

    for (let i = 1; i <= 10; i++) {
      const quantityOption = document.createElement("option");
      quantityOption.textContent = i;
      quantitySelector.append(quantityOption);
    }

    const addButton = document.createElement("button");
    addButton.className = "add-to-cart-btn";
    addButton.textContent = "В корзину";
    addButton.addEventListener("click", () => {
      const selectedQuantity = Number(quantitySelector.value);
      addProductToCart(this.id, selectedQuantity);
    });

    addQuantityDiv.append(addButton, quantitySelector);

    card.append(
      productImage,
      productName,
      productDescription,
      productPrice,
      addQuantityDiv
    );

    return card;
  }
}

fetch("../data/product.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Не удалось загрузить данные");
    }
    return response.json();
  })
  .then((productData) => {
    let filteredData = productData;

    const searchInput = document.querySelector(".js-search-input");
    const searchButton = document.querySelector(".js-search-button");

    searchInput.addEventListener("input", () => filterData(productData));

    searchButton.addEventListener("click", () => filterData(productData));

    function filterData(productData) {
      filteredData = productData;
      if (searchInput.value) {
        const searchValue = searchInput.value.trim().toLowerCase();
        filteredData = productData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue) ||
            item.description.toLowerCase().includes(searchValue)
        );
        if (filteredData.length !== 0) {
          const productList = document.querySelector(".js-product-list");

          if (productList.classList.contains("no-product"))
            productList.classList.remove("no-product");
          renderProductList(filteredData);
        } else {
          const productList = document.querySelector(".js-product-list");
          productList.innerHTML = "";
          productList.classList.add("no-product");

          const noProductFound = document.createElement("div");
          noProductFound.className = "no-product-found";

          const noProductFoundTitle = document.createElement("p");
          noProductFoundTitle.className = "no-product-title";
          const noProductFoundText = document.createElement("p");
          noProductFoundText.className = "no-product-text";

          noProductFoundTitle.textContent = "Товар не найден!";
          noProductFoundText.textContent = "Но у нас ещё множество других!";

          noProductFound.append(noProductFoundTitle, noProductFoundText);
          productList.append(noProductFound);
        }
      } else renderProductList(productData);
    }

    renderProductList(filteredData);
    updateQuantity();
  })
  .catch((error) => {
    console.error("Что-то пошло не так: " + error.message);
    alert("Не удалось загрузить данные");
  });

function renderProductList(filteredData) {
  const productList = document.querySelector(".js-product-list");
  productList.innerHTML = "";
  const productCards = filteredData.map((productItem) => {
    return new ProductCard(productItem);
  });

  productCards.forEach((productCard) => {
    const cardElement = productCard.createCard();
    productList.append(cardElement);
  });
}
