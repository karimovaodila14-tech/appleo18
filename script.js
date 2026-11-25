
/* =========================
   APPLE STORE CLONE
========================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// HERO SLIDER
const slides = [
  {
    label: "NEW GENERATION",
    title: "iPhone 17 Pro",
    text: "Pro darajadagi qudrat. Har bir detalda mukammallik.",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=85",
    product: "iPhone 17 Pro"
  },
  {
    label: "POWER & PERFORMANCE",
    title: "MacBook Pro",
    text: "Yangi imkoniyatlar. Cheksiz ijod.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85",
    product: "MacBook Pro 14"
  },
  {
    label: "YOUR EVERYDAY MAGIC",
    title: "AirPods Pro",
    text: "Har bir ovoz. Har bir lahza.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=85",
    product: "AirPods Pro"
  }
];

let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  const slide = slides[currentSlide];

  $("#heroLabel").textContent = slide.label;
  $("#heroTitle").textContent = slide.title;
  $("#heroText").textContent = slide.text;
  $("#heroImage").src = slide.image;
  $("#heroBuy").dataset.product = slide.product;

  $("#slideNumber").textContent =
    `0${currentSlide + 1} / 0${slides.length}`;
}

$("#nextSlide").addEventListener("click", () => {
  showSlide(currentSlide + 1);
});

$("#prevSlide").addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

// AUTO CAROUSEL
setInterval(() => {
  showSlide(currentSlide + 1);
}, 6000);


// NAVBAR MENU
$("#menuBtn").addEventListener("click", () => {
  $(".nav-links").classList.toggle("open");
});

$$(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    $(".nav-links").classList.remove("open");
  });
});


// SEARCH
$("#searchBtn").addEventListener("click", () => {
  $("#searchPanel").classList.toggle("show");
  $("#searchInput").focus();
});

$("#closeSearch").addEventListener("click", () => {
  $("#searchPanel").classList.remove("show");
  $("#searchInput").value = "";
  filterProducts("");
});

$("#searchInput").addEventListener("input", (e) => {
  filterProducts(e.target.value);
});

function filterProducts(search) {
  const value = search.toLowerCase().trim();

  $$(".product-card").forEach(card => {
    const text = card.textContent.toLowerCase();
    card.classList.toggle("hidden", !text.includes(value));
  });
}


// PRODUCT FILTER
$$(".filter").forEach(button => {
  button.addEventListener("click", () => {
    $$(".filter").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.filter;

    $$(".product-card").forEach(card => {
      const show =
        category === "all" ||
        card.dataset.category === category;

      card.classList.toggle("hidden", !show);
    });
  });
});


// REGISTER MODAL
const registerModal = $("#registerModal");

function openRegister(product = "") {
  $("#selectedProduct").value = product;
  $("#modalDescription").textContent = product
    ? `${product} uchun buyurtma so‘rovi. Ma’lumotlaringizni kiriting.`
    : "Ro‘yxatdan o‘tish uchun ma’lumotlaringizni kiriting.";

  registerModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeRegister() {
  registerModal.classList.remove("show");
  document.body.style.overflow = "";
}

$("#closeModal").addEventListener("click", closeRegister);

registerModal.addEventListener("click", (e) => {
  if (e.target === registerModal) closeRegister();
});


// BUY BUTTONS
$$(".buy-btn").forEach(button => {
  button.addEventListener("click", () => {
    openRegister(button.dataset.product);
  });
});

$("#heroBuy").addEventListener("click", () => {
  openRegister($("#heroBuy").dataset.product);
});


// REGISTER FORM
$("#registerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#fullName").value.trim();
  const phone = $("#phone").value.trim();
  const email = $("#email").value.trim();
  const product = $("#selectedProduct").value;

  if (!name || !phone || !email) {
    showToast("Barcha maydonlarni to‘ldiring!");
    return;
  }

  showToast(
    `Rahmat, ${name}! ${product ? product + " uchun " : ""}so‘rovingiz qabul qilindi.`
  );

  $("#registerForm").reset();
  closeRegister();
});


// CONTACT
const contactModal = $("#contactModal");

$("#contactBtn").addEventListener("click", () => {
  contactModal.classList.add("show");
  document.body.style.overflow = "hidden";
});

$("#closeContact").addEventListener("click", () => {
  contactModal.classList.remove("show");
  document.body.style.overflow = "";
});

contactModal.addEventListener("click", (e) => {
  if (e.target === contactModal) {
    contactModal.classList.remove("show");
    document.body.style.overflow = "";
  }
});

$("#contactRegister").addEventListener("click", () => {
  contactModal.classList.remove("show");
  openRegister();
});


// CART
let cart = [];

function addToCart(product) {
  cart.push(product);
  $("#cartCount").textContent = cart.length;
  showToast(`${product} savatchaga qo‘shildi!`);
}

$("#cartBtn").addEventListener("click", () => {
  renderCart();
  $("#cartModal").classList.add("show");
  document.body.style.overflow = "hidden";
});

$("#closeCart").addEventListener("click", () => {
  $("#cartModal").classList.remove("show");
  document.body.style.overflow = "";
});

// Cart uses Buy button's context menu:
// buy button -> registration; cart can also be populated from hero.
function renderCart() {
  const container = $("#cartItems");

  if (cart.length === 0) {
    container.innerHTML = `
      <p style="text-align:center;color:#86868b;padding:20px">
        Savatcha hozircha bo‘sh.
      </p>
    `;
    return;
  }

  container.innerHTML = cart.map((product, index) => `
    <div class="cart-item">
      <span>${product}</span>
      <button onclick="removeFromCart(${index})">O‘chirish</button>
    </div>
  `).join("");
}

function removeFromCart(index) {
  cart.splice(index, 1);
  $("#cartCount").textContent = cart.length;
  renderCart();
}

$("#checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Savatchangiz bo‘sh!");
    return;
  }

  const products = cart.join(", ");

  $("#cartModal").classList.remove("show");
  openRegister(products);
});

window.removeFromCart = removeFromCart;


// TOAST MESSAGE
let toastTimeout;

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


// HERO PRODUCT CART SUPPORT
// Double-click hero buy button adds product to cart.
$("#heroBuy").addEventListener("dblclick", () => {
  addToCart($("#heroBuy").dataset.product);
});


// ESCAPE CLOSE
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeRegister();
    contactModal.classList.remove("show");
    $("#cartModal").classList.remove("show");
    $("#searchPanel").classList.remove("show");
    $(".nav-links").classList.remove("open");
    document.body.style.overflow = "";
  }
});


// INIT
showSlide(0);

