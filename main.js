const products = [
  {
    id: 1,
    name: "cleanser",
    price: 50,
    image: "assets/images/products/cleanser.jpg",
  },
  {
    id: 2,
    name: "serum",
    price: 70,
    image: "assets/images/products/serum.jpg",
  },
  {
    id: 3,
    name: "moisturizer",
    price: 60,
    image: "assets/images/products/moisturizer.jpg",
  },
];

// عرض المنتجات في الصفحة
function displayProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6";
    card.innerHTML = `
      <div class="card p-3">
        <img src="${product.image}" class="card-img-top product-img" data-id="${product.id}" alt="${product.name}" />
        <div class="card-body text-center">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.price} ₪</p>
          <button class="btn btn-pink btn-outline-dark add-to-cart" data-id="${product.id}">
            إضافة للسلة
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function getCart() {
  return JSON.parse(localStorage.getItem("rbeautyCart") || "{}");
}

function saveCart(cart) {
  localStorage.setItem("rbeautyCart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}

function displayCart() {
  const cart = getCart();
  const container = document.getElementById("cart-container");
  if (!container) return;

  if (Object.keys(cart).length === 0) {
    container.innerHTML = "<p>سلة التسوق فارغة</p>";
    return;
  }

  let html = `
  <table>
    <thead>
      <tr>
        <th>صورة</th>
        <th>اسم المنتج</th>
        <th>السعر</th>
        <th>الكمية</th>
        <th>الإجمالي</th>
        <th>حذف</th>
      </tr>
    </thead>
    <tbody>
  `;

  let totalPrice = 0;

  for (let key in cart) {
    const item = cart[key];
    const subtotal = item.qty * item.price;
    totalPrice += subtotal;

    html += `
      <tr data-id="${key}">
        <td><img src="${item.image}" alt="${item.name}" /></td>
        <td>${item.name}</td>
        <td>${item.price} ₪</td>
        <td>
          <input type="number" min="1" value="${item.qty}" class="qty-input" style="width: 60px" />
        </td>
        <td>${subtotal} ₪</td>
        <td><button class="btn btn-danger btn-sm remove-item">×</button></td>
      </tr>
    `;
  }

  html += `
    </tbody>
  </table>
  <div class="mt-3 text-end fw-bold">الإجمالي: ${totalPrice} ₪</div>
  `;

  container.innerHTML = html;

  container.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest("tr").dataset.id;
      removeFromCart(id);
    });
  });

  container.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.closest("tr").dataset.id;
      const newQty = parseInt(e.target.value);
      if (newQty > 0) {
        updateQuantity(id, newQty);
      } else {
        e.target.value = 1;
      }
    });
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const cart = getCart();

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    };
  }

  saveCart(cart);
  updateCartCount();
  alert("تمت إضافة المنتج إلى السلة");
}

function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  updateCartCount();
  displayCart();
}

function updateQuantity(id, qty) {
  const cart = getCart();
  if (cart[id]) {
    cart[id].qty = qty;
    saveCart(cart);
    updateCartCount();
    displayCart();
  }
}

function clearCart() {
  localStorage.removeItem("rbeautyCart");
  updateCartCount();
  displayCart();
}

document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  updateCartCount();
  displayCart();

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }

    if (e.target.classList.contains("product-img")) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }
  });

  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("هل أنت متأكد من تفريغ العربة؟")) {
        clearCart();
      }
    });
  }
});