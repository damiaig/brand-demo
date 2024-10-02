// Declare DOM elements
let iconCart = document.querySelector(".icon-cart")
let closeCart = document.querySelector(".close")
let body = document.querySelector("body")
let listCart = document.querySelector(".listCart")
let iconCartSpan = document.querySelector(".icon-cart span")
let listProductHTML = document.querySelector(".listProduct")
let checkoutContainer = document.querySelector(".checkout")
let checkoutList = document.querySelector(".checkout-list")
let totalPriceElement = document.querySelector(".total-price")
let closeCheckoutButton = document.querySelector(".close-checkout")
let overlay = document.querySelector(".overlay")

// Cart and product data
let carts = []
let listProducts = []

// Event listeners for toggling the cart view
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart")
})
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart")
})

// Function to display products on the page and add front/back image toggle functionality
const addDataToHTML = () => {
  listProductHTML.innerHTML = ""
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div")
      newProduct.dataset.id = product.id
      newProduct.classList.add("item")

      // Initial HTML for the product
      newProduct.innerHTML = `
                <img class="product-img" src="${product.image}" alt="Product Image">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`

      listProductHTML.appendChild(newProduct)

      // Add interval to toggle images
      let productImg = newProduct.querySelector(".product-img")
      let showFront = true

      // Check if the back image exists before setting the interval
      if (product.back) {
        setInterval(() => {
          if (showFront) {
            productImg.src = product.back // Switch to back image
          } else {
            productImg.src = product.image // Switch to front image
          }
          showFront = !showFront
        }, 3000) // Change image every 3 seconds
      } else {
        console.warn(`Back image not found for product ${product.name}`)
      }
    })
  }
}

// Event listener for Add to Cart button
listProductHTML.addEventListener("click", (event) => {
  let clickedElement = event.target
  if (clickedElement.classList.contains("addCart")) {
    let productId = clickedElement.parentElement.dataset.id
    addToCart(productId)
  }
})

// Function to add an item to the cart
const addToCart = (productId) => {
  let productInCart = carts.find((item) => item.product_id === productId)

  if (productInCart) {
    productInCart.quantity += 1
  } else {
    carts.push({
      product_id: productId,
      quantity: 1,
    })
  }

  addCartToHTML()
  addCartToMemory()
}

const toggleCheckoutButton = (totalQuantity) => {
  let checkoutButton = document.querySelector(".checkOut")
  if (totalQuantity > 0) {
    checkoutButton.disabled = false
    checkoutButton.style.backgroundColor = "#eabc0e" // Normal button color
  } else {
    checkoutButton.disabled = true
    checkoutButton.style.backgroundColor = "#b18e0b" // Disabled color
  }
}

// Function to update the cart list in HTML
const addCartToHTML = () => {
  listCart.innerHTML = ""
  let totalQuantity = 0

  if (carts.length > 0) {
    carts.forEach((item) => {
      totalQuantity += item.quantity

      let product = listProducts.find((value) => value.id == item.product_id)

      if (product) {
        let newItem = document.createElement("div")
        newItem.classList.add("item")
        newItem.dataset.id = item.product_id
        newItem.innerHTML = `
                    <div class="image">
                        <img src="${product.image}">
                    </div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                    <div class="quantity">
                        <span class="minus">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus">+</span>
                    </div>`
        listCart.appendChild(newItem)
      }
    })
  }

  iconCartSpan.innerText = totalQuantity
  addQuantityEventListeners()
  toggleCheckoutButton(totalQuantity)
}

// Function to add event listeners to the plus and minus buttons
const addQuantityEventListeners = () => {
  document.querySelectorAll(".minus").forEach((button) => {
    button.addEventListener("click", () => {
      let productId = button.parentElement.parentElement.dataset.id
      updateQuantity(productId, "minus")
    })
  })

  document.querySelectorAll(".plus").forEach((button) => {
    button.addEventListener("click", () => {
      let productId = button.parentElement.parentElement.dataset.id
      updateQuantity(productId, "plus")
    })
  })
}

// Function to update the quantity of items in the cart
const updateQuantity = (productId, action) => {
  let productInCart = carts.find((item) => item.product_id == productId) // Make sure this matches

  if (productInCart) {
    if (action === "minus") {
      productInCart.quantity = Math.max(0, productInCart.quantity - 1)
    } else if (action === "plus") {
      productInCart.quantity += 1
    }

    if (productInCart.quantity === 0) {
      carts = carts.filter((item) => item.product_id !== productId)
    }

    addCartToHTML()
    addCartToMemory()
  }
}

// Function to save cart data to localStorage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts))
}

// Function to initialize the app and fetch products
const initApp = () => {
			const data = [
    
	

    {
        "id": 1,
        "name": "North Side Drop 1 Black",
        "price": 45,
        "image": "img1-front.png",
       "back":"img1-back.png"
    },
    {
      "id": 2,
      "name": "North Side Drop 1\u2002\u2002\u2002Grey",
      "price": 45,
      "image": "img2-front.png",
      "back": "img2-back.png"
    }
    ,
    {
        "id": 3,
        "name": "North Side Drop 1 Brown",
        "price": 45,
        "image": "img3-front.png",
        "back":"img3-back.png"
    },
    {
        "id": 4,
        "name": "North Side Drop 2\nBlack",
        "price": 60,
        "image": "img4-front.png",
        "back":"img4-back.png"
    },
    {
        "id": 5,
        "name": "North Side Drop 2 Brown",
        "price": 60,
        "image": "img5-front.png",
        "back":"img5-back.png"
    },
    {
        "id": 6,
        "name": "North Side Drop 2\u2002\u2002\u2002Grey",
        "price": 60,
        "image": "img6-front.png",
        "back":"img6-back.png"
    },
    {
        "id": 7,
        "name": "North Side Drop 2\u2002\u2002\u2002Pink",
        "price": 60,
        "image": "img7-front.png",
        "back":"img7-back.png"
    },
    {
        "id": 8,
        "name": "North Side Drop 3 Black",
        "price": 50,
        "image": "img8-front.png",
        "back":"img8-back.png"
    },
    {
        "id": 9,
        "name": "North Side Drop 3\u2002\u2002\u2002Grey",
        "price": 50,
        "image": "img9-front.png",
        "back":"img9-back.png"
    },
    {
        "id": 10,
        "name": "North Side Drop 3\u2002\u2002\u2002Pink",
        "price": 50,
        "image": "img10-front.png",
        "back":"img10-back.png"
    }


]    
      listProducts = data
      addDataToHTML()
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"))
        addCartToHTML()
      }
}

initApp()

// Calculate Total
const calculateTotal = () => {
  const total = carts.reduce((total, item) => {
    let product = listProducts.find((p) => p.id == item.product_id) // Make sure the ID comparison is correct
    if (product) {
      console.log(
        `Product found: ${product.name} - Price: ${product.price} - Quantity: ${item.quantity}`,
      )
      return total + product.price * item.quantity
    }
    return total // Return total if no product found
  }, 0)

  const totalAmount = total.toFixed(2)
  console.log("Total Amount to PayPal:", totalAmount)
  return totalAmount // Return the total amount
}

// Show Checkout Function

const showCheckout = () => {
  checkoutContainer.style.display = "block"
  overlay.style.display = "block"
  document.body.classList.add("modal-open")
  window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top of modal
  checkoutList.innerHTML = ""

  let totalPrice = calculateTotal() // Get the updated total price
  carts.forEach((item) => {
    let product = listProducts.find((value) => value.id == item.product_id)
    if (product) {
      let itemElement = document.createElement("div")
      itemElement.innerHTML = `
                <div class="item">
                    <div class="image"><img src="${product.image}" alt=""></div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">$${(product.price * item.quantity).toFixed(2)}</div>
                </div>`
      checkoutList.appendChild(itemElement)
    }
  })

  totalPriceElement.innerText = `Total Price: $${totalPrice}`

  // Clear the PayPal button container and set up the button
  document.querySelector(".paypal-button-container").innerHTML = ""
  setupPayPalButton() // Set up PayPal button
}

// Set up PayPal button with total amount
const setupPayPalButton = () => {
  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: calculateTotal(), // Use the latest total
              },
            },
          ],
        })
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("Transaction completed by " + details.payer.name.given_name)
          closeCheckout() // Close checkout modal after payment
          carts = [] // Clear cart
          addCartToHTML() // Update cart display
          addCartToMemory() // Update local storage
        })
      },
      onError: function (err) {
        console.error("PayPal error:", err)
        alert(
          "An error occurred during the transaction. Please try again. Error: " +
            err.message,
        )
      },
    })
    .render(".paypal-button-container") // Render the PayPal button
}

// Add event listeners for checkout buttons
document.querySelector(".checkOut").addEventListener("click", () => {
  showCheckout()
})
closeCheckoutButton.addEventListener("click", () => {
  closeCheckout()
})

// Function to close the checkout and overlay
const closeCheckout = () => {
  checkoutContainer.style.display = "none"
  overlay.style.display = "none"
  document.body.classList.remove("modal-open")
}

// Event listeners for checkout buttons
document.querySelector(".checkOut").addEventListener("click", () => {
  showCheckout()
})
closeCheckoutButton.addEventListener("click", () => {
  closeCheckout()
})

function handlePayment(product) {
  console.log("Product:", product)

  if (!product || !product.price) {
    console.error("Product or product price is undefined")
    return // Early return to avoid further errors
  }

  console.log("Processing payment for price:", product.price)

  processPayment(product.price)
    .then((response) => {
      console.log("Payment successful:", response)
    })
    .catch((error) => {
      console.error("Payment failed:", error)
    })
}

function processPayment(product) {
  console.log("Product object:", product)

  // Ensure product and product.price are defined
  if (!product || typeof product.price === "undefined") {
    console.error(
      "Cannot access price. Product is undefined or price is missing.",
    )
    return // Early return to avoid further errors
  }

  console.log("Processing payment for price:", product.price)

  // Your payment processing logic here
  try {
    // Assuming you have a function to handle payment
    initiatePayment(product.price)
      .then((response) => {
        console.log("Payment successful:", response)
      })
      .catch((err) => {
        console.error("Payment error:", err)
      })
  } catch (error) {
    console.error("Error during payment processing:", error)
  }
}

document.querySelector(".mail").addEventListener("click", function() {
  window.location.href = "mailto:damilolaaig@gmail.com";
});
