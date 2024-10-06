// Declare DOM elements
let iconCart = document.querySelector(".icon-cart");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
let listCart = document.querySelector(".listCart");
let iconCartSpan = document.querySelector(".icon-cart span");
let listProductHTML = document.querySelector(".listProduct");
let checkoutContainer = document.querySelector(".checkout");
let checkoutList = document.querySelector(".checkout-list");
let totalPriceElement = document.querySelector(".total-price");
let closeCheckoutButton = document.querySelector(".close-checkout");
let overlay = document.querySelector(".overlay");

// Cart and product data
let carts = [];
let listProducts = [];

// Event listeners for toggling the cart view
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});


const translations = {
  en: {
    title: "PRODUCT LIST",
    "shopping-cart": "Shopping Cart",
    close: "CLOSE",
    checkout: "Check Out",
    "pay-with-paystack": "Pay with Paystack",
    "add-to-cart": "Add To Cart"
  },
  fr: {
    title: "LISTE DE PRODUITS",
    "shopping-cart": "Panier",
    close: "FERMER",
    checkout: "Passer à la caisse",
    "pay-with-paystack": "Payer avec Paystack",
    "add-to-cart": "Ajouter au Panier"
  },
  es: {
    title: "LISTA DE PRODUCTOS",
    "shopping-cart": "Carrito de Compras",
    close: "CERRAR",
    checkout: "Pagar",
    "pay-with-paystack": "Pagar con Paystack",
    "add-to-cart": "Añadir al Carrito"
  }
};

// Function to apply translations for static content
function applyTranslation(lang) {
  document.querySelectorAll('[data-text]').forEach(el => {
    const key = el.getAttribute('data-text');
    el.textContent = translations[lang][key];
  });
}

// Modal functionality
const modal = document.getElementById("languageModal");
modal.style.display = "block"; // Show modal on page load

// Event listener for language selection
document.querySelectorAll('.modal-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const selectedLang = e.target.getAttribute('data-lang');
    applyTranslation(selectedLang); // Apply static content translation
    updateLanguage(selectedLang);   // Update product list and button text
    modal.style.display = "none";   // Close modal after selection
  });
});


const addDataToHTML = (lang = "en") => {
  const listProductHTML = document.querySelector('.listProduct');
  listProductHTML.innerHTML = ""; // Clear the product list

  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");

      // Get translation for "Add to Cart" button based on the selected language
      const addToCartText = translations[lang]["add-to-cart"];

      // Initial HTML for the product
      newProduct.innerHTML = `
        <img class="product-img" src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <div class="price">₦${product.price}</div>
        <button class="addCart">${addToCartText}</button>`; // Use the translated text

      listProductHTML.appendChild(newProduct);

      // Add interval to toggle images if a back image exists
      if (product.back) {
        let productImg = newProduct.querySelector(".product-img");
        let showFront = true;

        setInterval(() => {
          productImg.src = showFront ? product.back : product.image; // Switch images
          showFront = !showFront;
        }, 3000); // Change image every 3 seconds
      }
    });
  }
};

// Function to re-render the products with the selected language
function updateLanguage(lang) {
  addDataToHTML(lang); // Re-render product list with translated "Add to Cart" button
}
// Event listener for Add to Cart button
listProductHTML.addEventListener("click", (event) => {
  let clickedElement = event.target;
  if (clickedElement.classList.contains("addCart")) {
    let productId = clickedElement.parentElement.dataset.id;
    addToCart(productId);
  }
});

// Function to add an item to the cart
const addToCart = (productId) => {
  let productInCart = carts.find((item) => item.product_id === productId);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    carts.push({
      product_id: productId,
      quantity: 1,
    });
  }

  addCartToHTML();
  addCartToMemory();
};

// Function to toggle the checkout button based on total quantity
const toggleCheckoutButton = (totalQuantity) => {
  let checkoutButton = document.querySelector(".checkOut");
  checkoutButton.disabled = totalQuantity === 0;
  checkoutButton.style.backgroundColor = totalQuantity > 0 ? "#eabc0e" : "#b18e0b"; // Button color based on quantity
};

// Function to update the cart list in HTML
const addCartToHTML = () => {
  listCart.innerHTML = "";
  let totalQuantity = 0;

  if (carts.length > 0) {
    carts.forEach((item) => {
      totalQuantity += item.quantity;

      let product = listProducts.find((value) => value.id == item.product_id);
      if (product) {
        let newItem = document.createElement("div");
        newItem.classList.add("item");
        newItem.dataset.id = item.product_id;
        newItem.innerHTML = `
                    <div class="image">
                        <img src="${product.image}">
                    </div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">₦${(product.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>`;
        listCart.appendChild(newItem);
      }
    });
  }

  iconCartSpan.innerText = totalQuantity;
  addQuantityEventListeners();
  toggleCheckoutButton(totalQuantity);
};

// Function to add event listeners to the plus and minus buttons
const addQuantityEventListeners = () => {
  document.querySelectorAll(".minus").forEach((button) => {
    button.addEventListener("click", () => {
      let productId = button.parentElement.parentElement.dataset.id;
      updateQuantity(productId, "minus");
    });
  });

  document.querySelectorAll(".plus").forEach((button) => {
    button.addEventListener("click", () => {
      let productId = button.parentElement.parentElement.dataset.id;
      updateQuantity(productId, "plus");
    });
  });
};

// Function to update the quantity of items in the cart
const updateQuantity = (productId, action) => {
  let productInCart = carts.find((item) => item.product_id == productId);

  if (productInCart) {
    if (action === "minus") {
      productInCart.quantity = Math.max(0, productInCart.quantity - 1);
    } else if (action === "plus") {
      productInCart.quantity += 1;
    }

    if (productInCart.quantity === 0) {
      carts = carts.filter((item) => item.product_id !== productId);
    }

    addCartToHTML();
    addCartToMemory();
  }
};

// Function to save cart data to localStorage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

// Function to initialize the app and fetch products
const initApp = () => {
  const data = [
    {
      "id": 1,
      "name": "North Side Drop 1 Black",
      "price": 45000,
      "image": "img1-front.png",
      "back": "img1-back.png"
    },
    {
      "id": 2,
      "name": "North Side Drop 1\u2002\u2002\u2002Grey",
      "price": 45000,
      "image": "img2-front.png",
      "back": "img2-back.png"
    },
    {
      "id": 3,
      "name": "North Side Drop 1 Brown",
      "price": 45000,
      "image": "img3-front.png",
      "back": "img3-back.png"
    },
    {
      "id": 4,
      "name": "North Side Drop 2 Black",
      "price": 60000,
      "image": "img4-front.png",
      "back": "img4-back.png"
    },
    {
      "id": 5,
      "name": "North Side Drop 2 Brown",
      "price": 60000,
      "image": "img5-front.png",
      "back": "img5-back.png"
    },
    {
      "id": 6,
      "name": "North Side Drop 2\u2002\u2002\u2002Grey",
      "price": 60000,
      "image": "img6-front.png",
      "back": "img6-back.png"
    },
    {
      "id": 7,
      "name": "North Side Drop 2\u2002\u2002\u2002Pink",
      "price": 60000,
      "image": "img7-front.png",
      "back": "img7-back.png"
    },
    {
      "id": 8,
      "name": "North Side Drop 3 Black",
      "price": 50000,
      "image": "img8-front.png",
      "back": "img8-back.png"
    },
    {
      "id": 9,

      "name": "North Side Drop 3\u2002\u2002\u2002Grey",

      "price": 50000,
      "image": "img9-front.png",
      "back": "img9-back.png"
    },
    {
      "id": 10,
      "name": "North Side Drop 3\u2002\u2002\u2002Pink",
      "price": 50000,
      "image": "img10-front.png",
      "back": "img10-back.png"
    }
  ];
  
  listProducts = data;
  addDataToHTML();
  
  if (localStorage.getItem("cart")) {
    carts = JSON.parse(localStorage.getItem("cart"));
    addCartToHTML();
  }
};

initApp();

// Show Checkout Function
// Show Checkout Function
function showCheckout() {
  // Show the checkout container and overlay
  checkoutContainer.style.display = "block";
  overlay.style.display = "block";
  document.body.classList.add("modal-open");
  window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top of modal

  // Clear previous checkout items
  checkoutList.innerHTML = "";

  // Calculate total price
  let totalPrice = calculateTotal();

  // Display each item in the checkout
  carts.forEach((item) => {
    let product = listProducts.find((p) => p.id == item.product_id);
    if (product) {
      let itemElement = document.createElement("div");
      itemElement.className = "checkout-item";
      itemElement.innerHTML = `
      <div class="item">
      <div class="image"><img src="${product.image}" alt=""></div>
      <div class="name">${product.name}</div>
      <div class="totalprice" >₦${(product.price * item.quantity).toFixed(2)}</div>
  </div>`;
      checkoutList.appendChild(itemElement);
    }
  });

  // Append the total at the end
  let totalElement = document.createElement("div");
  totalElement.className = "total";
  totalElement.innerHTML = `Total: ₦${totalPrice.toFixed(2)}`;
  
  // Adding inline styles
  totalElement.style.color = "white";
  totalElement.style.fontSize = "15px";
  totalElement.style.fontWeight = "600";
  
  // Append the styled element to the checkout list
  checkoutList.appendChild(totalElement);
}



// Function to calculate total price
function calculateTotal() {
  const total = carts.reduce((total, item) => {
      let product = listProducts.find((p) => p.id == item.product_id);
      return total + (product.price * item.quantity);
  }, 0);
  console.log("Total Amount:", total); // Check the calculated total
  return total;
}


// Event listener for checkout button
document.querySelector(".checkOut").addEventListener("click", showCheckout);

// Event listener to close checkout modal
closeCheckoutButton.addEventListener("click", () => {
  checkoutContainer.style.display = "none";
  overlay.style.display = "none";
  document.body.classList.remove("modal-open");
});

function payWithPaystack() {
  const amount = calculateTotal() * 100; // Amount in kobo
  if (amount <= 0) {
      alert("Please add items to your cart before checking out.");
      return;
  }

  const handler = PaystackPop.setup({
      key: "pk_test_cb3826dfb6732cf27093aa151b352fb821871dc7", // Ensure this is your actual public key
      email: "customer@gmail.com", // Ideally, use the customer's actual email
      amount: amount,
      currency: "NGN",
      callback: function(response) {
          alert("Payment successful! Transaction reference: " + response.reference);
          // Clear cart and local storage after successful payment
          carts = [];
          localStorage.removeItem("cart");
          iconCartSpan.innerText = '0';
          addCartToHTML();
          
          // Close the checkout modal and hide the overlay
          document.body.classList.remove('showCheckout');
          overlay.style.display = 'none';
      },
      onClose: function() {
          alert("Transaction was not completed, window closed.");
      }
  });

  handler.openIframe();
}

// Event listener for payment
document.querySelector(".paystack").addEventListener("click", payWithPaystack);

document.querySelector(".mail").addEventListener("click", function() {
  window.location.href = "mailto:damilolaaig@gmail.com";
});
