const WHATSAPP_NUMBER = "919834016105";
const CART_STORAGE_KEY = "arshiyan-cart";

const products = [
  {
    id: "form-tote",
    name: "The Form Tote",
    detail: "The everyday carry-all",
    category: "Bags",
    price: 2490,
    color: "SAND",
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    alt: "Structured tan tote bag"
  },
  {
    id: "daytrip-crossbody",
    name: "Daytrip Crossbody",
    detail: "Hands-free, all day",
    category: "Bags",
    price: 1890,
    color: "COGNAC",
    badge: "JUST IN",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    alt: "Compact leather crossbody bag"
  },
  {
    id: "little-things-pouch",
    name: "Little Things Pouch",
    detail: "A place for the small stuff",
    category: "Accessories",
    price: 790,
    color: "TERRACOTTA",
    badge: "",
    image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    alt: "Minimal zip pouch"
  },
  {
    id: "everywhere-wallet",
    name: "The Everywhere Wallet",
    detail: "Cards, cash, done",
    category: "Accessories",
    price: 990,
    color: "OLIVE",
    badge: "",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    alt: "Slim everyday wallet"
  },
  {
    id: "weekend-duffel",
    name: "Weekender Duffel",
    detail: "A very good plus-one",
    category: "Bags",
    price: 3290,
    color: "INK",
    badge: "MADE TO MOVE",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    alt: "Travel duffel bag"
  },
  {
    id: "on-the-go-bottle",
    name: "On-the-Go Bottle",
    detail: "Your little daily reminder",
    category: "On the go",
    price: 690,
    color: "SAGE",
    badge: "",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    alt: "Reusable water bottle"
  },
  {
    id: "everyday-cap",
    name: "The Everyday Cap",
    detail: "Bad hair day, handled",
    category: "On the go",
    price: 890,
    color: "STONE",
    badge: "",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    alt: "Neutral everyday cap"
  },
  {
    id: "soft-structure-sling",
    name: "Soft Structure Sling",
    detail: "Just enough, always",
    category: "Bags",
    price: 1490,
    color: "CHOCOLATE",
    badge: "",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    alt: "Small structured sling bag"
  }
];

const productGrid = document.querySelector("#product-grid");
const cartCount = document.querySelector("#cart-count");
const drawerCount = document.querySelector("#drawer-count");
const cartItems = document.querySelector("#cart-items");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartEmpty = document.querySelector("#cart-empty");
const cartFooter = document.querySelector("#cart-footer");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const searchOverlay = document.querySelector("#search-overlay");
const searchInput = document.querySelector("#search-input");
const searchStatus = document.querySelector("#search-status");
const emptyState = document.querySelector("#empty-state");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const sortSelect = document.querySelector("#sort-products");
let selectedCategory = "All";
let searchTerm = "";
let cart = loadCart();

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter((item) =>
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.error("Could not load the saved shopping bag.", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save the shopping bag.", error);
  }
}

function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function renderProducts() {
  let visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const searchableText = `${product.name} ${product.detail} ${product.category} ${product.color}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchTerm.toLowerCase());
  });

  if (sortSelect.value === "price-low") visibleProducts.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "price-high") visibleProducts.sort((a, b) => b.price - a.price);

  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card" style="--card-index:${index}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="quick-add" data-add="${product.id}" aria-label="Add ${product.name} to bag">ADD TO BAG <span aria-hidden="true">+</span></button>
      </div>
      <div class="product-info">
        <div><p class="product-category">${product.category} <span>· ${product.color}</span></p><h3>${product.name}</h3><p class="product-detail">${product.detail}</p></div>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visibleProducts.length > 0;
  searchStatus.textContent = searchTerm ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"} found` : "";
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  drawerCount.textContent = `(${totalQuantity})`;
  cartEmpty.hidden = totalQuantity > 0;
  cartFooter.hidden = totalQuantity === 0;
  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return "";
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="">
        <div class="cart-item-info">
          <div class="cart-item-heading"><div><h3>${product.name}</h3><p>${product.color}</p></div><strong>${formatPrice(product.price * item.quantity)}</strong></div>
          <div class="cart-item-actions">
            <div class="quantity-control" aria-label="Quantity for ${product.name}">
              <button data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
              <span>${item.quantity}</span>
              <button data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button>
            </div>
            <button class="remove-item" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
  cartSubtotal.textContent = formatPrice(subtotal);
}

function updateFilter(category) {
  selectedCategory = category;
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.category === category));
  renderProducts();
}

function setCartOpen(open) {
  cartDrawer.classList.toggle("is-open", open);
  drawerBackdrop.classList.toggle("is-visible", open);
  cartDrawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("overlay-open", open);
  if (open) document.querySelector("#cart-close").focus();
}

function setSearchOpen(open) {
  searchOverlay.classList.toggle("is-open", open);
  searchOverlay.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("overlay-open", open);
  if (open) searchInput.focus();
}

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });
  saveCart();
  renderCart();
  setCartOpen(true);
}

function checkoutOnWhatsApp() {
  if (cart.length === 0) return;
  const lines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `${product.name} x ${item.quantity} — ${formatPrice(product.price * item.quantity)}`;
  });
  const total = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);
  const message = `Hi ARSHIYAN! I'd like to place an order:\n\n${lines.join("\n")}\n\nSubtotal: ${formatPrice(total)}\n\nPlease let me know about delivery and payment.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove);
  } else if (quantityButton) {
    const item = cart.find((entry) => entry.id === quantityButton.dataset.quantity);
    if (item) {
      item.quantity += Number(quantityButton.dataset.change);
      if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id);
    }
  }
  saveCart();
  renderCart();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => updateFilter(button.dataset.category));
});

document.querySelectorAll("[data-nav-category]").forEach((link) => {
  link.addEventListener("click", () => updateFilter(link.dataset.navCategory));
});

sortSelect.addEventListener("change", renderProducts);
document.querySelector("#cart-open").addEventListener("click", () => setCartOpen(true));
document.querySelector("#cart-close").addEventListener("click", () => setCartOpen(false));
drawerBackdrop.addEventListener("click", () => setCartOpen(false));
document.querySelector("#checkout-button").addEventListener("click", checkoutOnWhatsApp);
document.querySelector("#search-toggle").addEventListener("click", () => setSearchOpen(true));
document.querySelector("#search-close").addEventListener("click", () => setSearchOpen(false));
searchOverlay.addEventListener("click", (event) => {
  if (event.target === searchOverlay) setSearchOpen(false);
});
searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim();
  updateFilter("All");
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    setSearchOpen(false);
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
  }
});
document.querySelector("#search-close").addEventListener("click", () => {
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#clear-search").addEventListener("click", () => {
  searchTerm = "";
  searchInput.value = "";
  updateFilter("All");
});
document.querySelector("#continue-shopping").addEventListener("click", () => setCartOpen(false));
document.querySelector("#continue-shopping-footer").addEventListener("click", () => setCartOpen(false));
document.querySelector("#menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const isOpen = button.classList.toggle("is-open");
  document.querySelector("#main-nav").classList.toggle("is-open", isOpen);
  button.setAttribute("aria-expanded", String(isOpen));
});
document.querySelector("#main-nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    document.querySelector("#main-nav").classList.remove("is-open");
    document.querySelector("#menu-toggle").classList.remove("is-open");
    document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setCartOpen(false);
    setSearchOpen(false);
  }
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderProducts();
renderCart();