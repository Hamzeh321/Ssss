let cart = [];

function addToCart(item, price, quantityId) {
  const quantity = parseInt(document.getElementById(quantityId).value);
  cart.push({ item, price, quantity });
  updateCartModal();
  updateCartCount();
  showToast(`تمت إضافة ${item} إلى السلة!`);
  saveCart();
}

function updateCartModal() {
  const cartItems = document.getElementById('cartItems');
  const totalPrice = document.getElementById('totalPrice');
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <span>${item.item} - ${item.price} دولار (الكمية: ${item.quantity})</span>
      <button onclick="removeFromCart(${index})">حذف</button>
    `;
    cartItems.appendChild(cartItem);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = `الإجمالي: ${total} دولار`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartModal();
  updateCartCount();
  saveCart();
}

function confirmOrder() {
  const address = document.getElementById('address').value;
  const recipientName = document.getElementById('recipientName').value;
  const creditCard = document.getElementById('creditCard').value;

  if (!address || !recipientName || !creditCard || cart.length === 0) {
    alert('الرجاء تعبئة جميع الحقول والتأكد من وجود عناصر في السلة.');
    return;
  }

  if (creditCard.length !== 16 || isNaN(creditCard)) {
    alert('رقم بطاقة الأمان غير صحيح. يجب أن يحتوي على 16 رقمًا.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderDetails = {
    items: cart,
    address,
    recipientName,
    creditCard: creditCard.slice(-4), // حفظ آخر 4 أرقام فقط لأمان أكثر
    total,
    timestamp: new Date().toLocaleString(),
  };

  sendDataToServer(orderDetails);

  alert(`تم تأكيد الطلب! سيتم التوصيل إلى: ${address}\nالإجمالي: ${total} دولار`);
  cart = [];
  updateCartModal();
  updateCartCount();
  closeModal();
  saveCart();
}

function sendDataToServer(data) {
  fetch('save_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(result => {
      console.log('تم حفظ البيانات:', result);
    })
    .catch(error => {
      console.error('خطأ في إرسال البيانات:', error);
    });
}

function closeModal() {
  document.getElementById('cartModal').style.display = 'none';
}

function openCartModal() {
  document.getElementById('cartModal').style.display = 'flex';
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function filterProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const title = card.querySelector('h2').textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartModal();
    updateCartCount();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('active');
}

window.onload = loadCart;