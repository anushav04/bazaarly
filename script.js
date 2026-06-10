
let cart = [];

// Product database with detailed info for each product
const productDatabase = {
    // Dairy products
    "Amul Taaza Toned Milk": {
        brand: "Amul", category: "Dairy", fatProfile: "Toned",
        units: [{ size: "500 ml", price: 30 }, { size: "1 ltr", price: 55 }]
    },
    "Amul Gold Full Cream Milk": {
        brand: "Amul", category: "Dairy", fatProfile: "Full Cream",
        units: [{ size: "500 ml", price: 37 }, { size: "1 ltr", price: 68 }]
    },
    "Amul Taaza Homogenised Toned Milk": {
        brand: "Amul", category: "Dairy", fatProfile: "Toned",
        units: [{ size: "500 ml", price: 40 }, { size: "1 ltr", price: 77 }]
    },
    "Heritage Special Long Life Milk (90 Days Shelf Life)": {
         brand: "Heritage", category: "Dairy", fatProfile: "Full Cream",
        units: [{ size: "500 ml", price: 18 }, { size: "1 ltr", price: 31 }]
    },
    // Vegetables
    "Coriander Bunch (Kottimeera)": {
         brand: "Fresh", category: "Vegetables", fatProfile: "Fresh",
        units: [{ size: "100 g", price: 5 }, { size: "200 g", price: 9 }]
    },
    "Lemon (Nimakaya)": {
         brand: "Fresh", category: "Fruits", fatProfile: "Fresh",
        units: [{ size: "200 g", price: 20 }, { size: "500 g", price: 45 }]
    },
    "Onion (Ulligadda)": {
         brand: "Fresh", category: "Vegetables", fatProfile: "Fresh",
        units: [{ size: "500 g", price: 45 }, { size: "1 kg", price: 85 }]
    },
    "English Cucumber (Keera Dosakaya)": {
         brand: "Fresh", category: "Vegetables", fatProfile: "Fresh",
        units: [{ size: "250 g", price: 30 }, { size: "500 g", price: 56 }]
    },
    "green chillies": {
         brand: "Fresh", category: "Vegetables", fatProfile: "Fresh",
        units: [{ size: "100 g", price: 29 }, { size: "250 g", price: 65 }]
    },
   
    "default": {
         brand: "Fresh", category: "Grocery", fatProfile: "Standard",
        units: [{ size: "Default", price: 0 }]
    }
};

function getProductDetails(productName, productPrice, productWeight) {
    let details = productDatabase[productName] || productDatabase["default"];
    
    let hasUnit = details.units.some(u => u.size === productWeight);
    if (!hasUnit && productPrice > 0) {
        details.units.push({ size: productWeight, price: productPrice });
    }
    return details;
}

let currentSelectedProduct = null;
let currentSelectedUnit = null;

// Open product detail modal
function openProductDetail(productItem) {
    const productImg = productItem.querySelector(".product-img img").src;
    const productName = productItem.querySelector(".product-content h3").innerText;
    const productWeight = productItem.querySelector(".product-content p").innerText;
    const productPriceText = productItem.querySelector(".price b").innerText;
    const productPrice = parseInt(productPriceText.replace('₹', ''));
    const originalPrice = productPrice + Math.floor(productPrice * 0.2);
    
    const details = getProductDetails(productName, productPrice, productWeight);
    
    currentSelectedProduct = {
        name: productName,
        image: productImg,
        weight: productWeight,
        basePrice: productPrice,
        units: details.units
    };
    
    // Set modal content
    document.getElementById('detailEmoji').innerHTML = `<img src="${productImg}" alt="${productName}" style="width:100%;max-width:220px;height:220px;object-fit:contain;border-radius:12px;">`;
    document.getElementById('detailTitle').innerText = productName;
    document.getElementById('detailBrand').innerText = details.brand;
    document.getElementById('detailCategory').innerText = details.category;
    document.getElementById('detailShortTitle').innerText = productName;
    document.getElementById('detailRightTitle').innerText = productName;
    document.getElementById('detailFatProfile').innerText = details.fatProfile;
    
    // Populate unit options
    const unitContainer = document.getElementById('unitOptions');
    unitContainer.innerHTML = '';
    
    details.units.forEach((unit, idx) => {
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit-option';
        if (unit.size === productWeight) {
            unitDiv.classList.add('selected');
            currentSelectedUnit = unit;
            document.getElementById('detailPrice').innerText = `₹${unit.price}`;
            document.getElementById('detailOldPrice').innerText = `₹${Math.round(unit.price * 1.2)}`;
        }
        unitDiv.innerHTML = `
            <span class="unit-name">${unit.size}</span>
            <span class="unit-price">₹${unit.price}</span>
        `;
        unitDiv.onclick = () => {
            document.querySelectorAll('.unit-option').forEach(opt => opt.classList.remove('selected'));
            unitDiv.classList.add('selected');
            currentSelectedUnit = unit;
            document.getElementById('detailPrice').innerText = `₹${unit.price}`;
            document.getElementById('detailOldPrice').innerText = `₹${Math.round(unit.price * 1.2)}`;
        };
        unitContainer.appendChild(unitDiv);
    });
    
    document.getElementById('productDetailModal').style.display = 'flex';
}

// Close modal
function closeProductDetail() {
    document.getElementById('productDetailModal').style.display = 'none';
}

// Add to cart from detail modal
function addFromDetailToCart() {
    if (!currentSelectedProduct || !currentSelectedUnit) return;
    
    const existingItem = cart.find(item => 
        item.name === currentSelectedProduct.name && 
        item.weight === currentSelectedUnit.size
    );
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: Date.now(),
            quantity: 1,
            name: currentSelectedProduct.name,
            price: currentSelectedUnit.price,
            weight: currentSelectedUnit.size,
            image: currentSelectedProduct.image
        });
    }
    
    updateCartCount();
    updateCartSidebar();
    closeProductDetail();
    
    // Show quick toast
    showToast(`Added ${currentSelectedProduct.name} to cart`);
}

function showToast(message) {
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #0c831f;
            color: white;
            padding: 10px 20px;
            border-radius: 40px;
            font-size: 13px;
            z-index: 2001;
            white-space: nowrap;
        `;
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

function updateCartCount() {
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) {
        cartCountElem.textContent = total > 0 ? `(${total})` : "(0)";
    }
    localStorage.setItem("blinkitCart", JSON.stringify(cart));
}

function updateCartSidebar() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartFooter = document.getElementById('cartFooter');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping" style="font-size: 50px; color: #ccc; margin-bottom: 15px;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 12px;">Add items to get started</p>
            </div>
        `;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    let itemsHTML = '';
    let itemsTotal = 0;
    
    cart.forEach((item, index) => {
        itemsTotal += item.price * item.quantity;
        itemsHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-weight">${item.weight}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="cart-minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-plus" data-index="${index}">+</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    if (cartFooter) cartFooter.style.display = 'block';
    
    const deliveryCharge = itemsTotal >= 500 ? 0 : 12;
    const handlingCharge = 2;
    const grandTotal = itemsTotal + deliveryCharge + handlingCharge;
    
    const itemsTotalElem = document.getElementById('itemsTotal');
    const deliveryChargeElem = document.getElementById('deliveryCharge');
    const handlingChargeElem = document.getElementById('handlingCharge');
    const grandTotalElem = document.getElementById('grandTotal');
    
    if (itemsTotalElem) itemsTotalElem.innerHTML = `₹${itemsTotal}`;
    if (deliveryChargeElem) deliveryChargeElem.innerHTML = deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`;
    if (handlingChargeElem) handlingChargeElem.innerHTML = `₹${handlingCharge}`;
    if (grandTotalElem) grandTotalElem.innerHTML = `₹${grandTotal}`;
    
    document.querySelectorAll('.cart-minus').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            if (cart[idx].quantity > 1) {
                cart[idx].quantity--;
            } else {
                cart.splice(idx, 1);
            }
            updateCartCount();
            updateCartSidebar();
        };
    });
    
    document.querySelectorAll('.cart-plus').forEach(btn => {
        btn.onclick = () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantity++;
            updateCartCount();
            updateCartSidebar();
        };
    });
}


document.querySelectorAll(".product-item").forEach(product => {
    const btn = product.querySelector(".add-btn");
    const productImg = product.querySelector(".product-img img").src;
    const productName = product.querySelector(".product-content h3").innerText;
    const productWeight = product.querySelector(".product-content p").innerText;
    const productPriceText = product.querySelector(".price b").innerText;
    const productPrice = parseInt(productPriceText.replace('₹', ''));
    
 
    product.style.cursor = 'pointer';
    product.addEventListener("click", (e) => {
       
        if (e.target.classList.contains('add-btn') || 
            e.target.closest('.qty-box') ||
            e.target.classList.contains('minus') ||
            e.target.classList.contains('plus')) {
            return;
        }
        openProductDetail(product);
    });
    
    if (btn && !btn.dataset.bound) {
        btn.dataset.bound = "true";
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            let qty = 1;
            btn.outerHTML = `
                <div class="qty-box">
                    <button class="minus">-</button>
                    <span class="qty">${qty}</span>
                    <button class="plus">+</button>
                </div>
            `;
            const qtyBox = product.querySelector(".qty-box");
            const qtySpan = qtyBox.querySelector(".qty");
            
            cart.push({ 
                id: Date.now(), 
                quantity: 1,
                name: productName,
                price: productPrice,
                weight: productWeight,
                image: productImg
            });
            
            updateCartCount();
            updateCartSidebar();
            
            qtyBox.querySelector(".plus").addEventListener("click", () => {
                qty++;
                qtySpan.textContent = qty;
                cart[cart.length - 1].quantity = qty;
                updateCartCount();
                updateCartSidebar();
            });
            
            qtyBox.querySelector(".minus").addEventListener("click", () => {
                qty--;
                if (qty <= 0) {
                    cart.pop();
                    qtyBox.outerHTML = `<button class="add-btn">ADD</button>`;
                    updateCartCount();
                    updateCartSidebar();
                    const newBtn = product.querySelector(".add-btn");
                    if (newBtn) {
                        newBtn.dataset.bound = "true";
                        newBtn.addEventListener("click", arguments.callee);
                    }
                } else {
                    qtySpan.textContent = qty;
                    cart[cart.length - 1].quantity = qty;
                    updateCartCount();
                    updateCartSidebar();
                }
            });
        });
    }
});

// Cart sidebar toggle
const cartBtn = document.querySelector('.btn2');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');

if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (cartSidebar) cartSidebar.classList.add('open');
        if (cartOverlay) cartOverlay.style.display = 'block';
        updateCartSidebar();
    });
}

function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.style.display = 'none';
}

if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Login Modal functionality
const modal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeBtn = document.querySelector('.close-modal');

if(loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (modal) modal.style.display = 'block';
    });
}
if(closeBtn) {
    closeBtn.addEventListener('click', function() {
        if (modal) modal.style.display = 'none';
    });
}
window.addEventListener('click', function(e) {
    if(e.target === modal) {
        if (modal) modal.style.display = 'none';
    }
});

// Product detail modal close
const closeDetailBtn = document.querySelector('.close-detail');
if(closeDetailBtn) {
    closeDetailBtn.addEventListener('click', closeProductDetail);
}
const detailModal = document.getElementById('productDetailModal');
if(detailModal) {
    detailModal.addEventListener('click', function(e) {
        if(e.target === detailModal) {
            closeProductDetail();
        }
    });
}


const detailAddBtn = document.getElementById('detailAddToCartBtn');
if(detailAddBtn) {
    detailAddBtn.addEventListener('click', addFromDetailToCart);
}

updateCartCount();
const dealsRow = document.querySelector(".deals-row");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

// Store original cards
const originalCards = Array.from(dealsRow.children);
// Duplicate for infinite scroll effect
originalCards.forEach(card => {
    dealsRow.appendChild(card.cloneNode(true));
});

let scrollInterval = null;
let isHovering = false;

function scrollLeft() {
    dealsRow.scrollBy({ left: -300, behavior: "smooth" });
}

function scrollRight() {
    dealsRow.scrollBy({ left: 300, behavior: "smooth" });
}

function startAutoScroll() {
    if (scrollInterval) stopAutoScroll();
    scrollInterval = setInterval(() => {
        if (!isHovering && dealsRow) {
            dealsRow.scrollLeft += 2;
            if (dealsRow.scrollLeft >= dealsRow.scrollWidth / 2) {
                dealsRow.scrollLeft = 0;
            }
        }
    }, 20);
}

function stopAutoScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

dealsRow.addEventListener("mouseenter", () => {
    isHovering = true;
});

dealsRow.addEventListener("mouseleave", () => {
    isHovering = false;
});

if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        scrollLeft();
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        scrollRight();
    });
}

startAutoScroll();

// Fix deal cards add to cart
function fixDealCardButtons() {
    document.querySelectorAll(".deal-card").forEach(card => {
        const btn = card.querySelector(".add-btn");
        if (!btn || btn.dataset.bound) return;

        const productImg = card.querySelector("img").src;
        const productName = card.querySelector("h3").innerText;
        const productPriceText = card.querySelector(".new-price").innerText;
        const productPrice = parseInt(productPriceText.replace('₹', ''));
        const productWeight = "1 pack";

        btn.dataset.bound = "true";
        
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            let qty = 1;
            
            newBtn.outerHTML = `
                <div class="qty-box">
                    <button class="minus">-</button>
                    <span class="qty">${qty}</span>
                    <button class="plus">+</button>
                </div>
            `;
            
            const qtyBox = card.querySelector(".qty-box");
            const qtySpan = qtyBox.querySelector(".qty");
            
            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity++;
                cart[cart.indexOf(existingItem)] = existingItem;
            } else {
                cart.push({
                    id: Date.now(),
                    quantity: 1,
                    name: productName,
                    price: productPrice,
                    weight: productWeight,
                    image: productImg
                });
            }
            
            updateCartCount();
            updateCartSidebar();
            
            qtyBox.querySelector(".plus").addEventListener("click", () => {
                qty++;
                qtySpan.textContent = qty;
                const item = cart.find(i => i.name === productName);
                if (item) item.quantity = qty;
                updateCartCount();
                updateCartSidebar();
            });
            
            qtyBox.querySelector(".minus").addEventListener("click", () => {
                qty--;
                if (qty <= 0) {
                    const index = cart.findIndex(i => i.name === productName);
                    if (index !== -1) cart.splice(index, 1);
                    qtyBox.outerHTML = `<button class="add-btn">ADD TO CART</button>`;
                    updateCartCount();
                    updateCartSidebar();
                    fixDealCardButtons();
                } else {
                    qtySpan.textContent = qty;
                    const item = cart.find(i => i.name === productName);
                    if (item) item.quantity = qty;
                    updateCartCount();
                    updateCartSidebar();
                }
            });
        });
    });
}

setTimeout(fixDealCardButtons, 100);