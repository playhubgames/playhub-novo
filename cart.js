let cart = [];

window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.removeFromCart = removeFromCart;
window.updateCartItem = updateCartItem;
window.checkoutCart = checkoutCart;
window.addToCart = addToCart;

function loadCart() {
  const savedCart = localStorage.getItem('playhub_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('playhub_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';
  }
}

function addToCart(game, accountType, price, paymentType) {
  const cartItem = {
    id: Date.now(),
    gameId: game.id,
    gameTitle: game.title,
    gameImage: game.image_url,
    gamePlatform: game.platform,
    gameDescription: game.description,
    accountType: accountType,
    price: price,
    paymentType: paymentType
  };

  cart.push(cartItem);
  saveCart();

  showNotification('Jogo adicionado ao carrinho!');
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  renderCart();
  showNotification('Jogo removido do carrinho');
}

function updateCartItem(itemId, field, value) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item[field] = value;

    if (field === 'accountType') {
      const game = window.currentGame || { primaryPrice: item.price, secondaryPrice: item.price };
      item.price = value === 'primary' ? game.primaryPrice : game.secondaryPrice;
    }

    saveCart();
    renderCart();
  }
}

function openCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCartModal() {
  const modal = document.getElementById('cartModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  const cartTotalItems = document.getElementById('cartTotalItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');

  if (cart.length === 0) {
    cartItemsContainer.style.display = 'none';
    cartEmpty.style.display = 'flex';
    cartSummary.style.display = 'none';
    return;
  }

  cartItemsContainer.style.display = 'block';
  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  cartTotalItems.textContent = cart.length;
  cartTotalPrice.textContent = `R$ ${total.toFixed(2)}`;

  cartItemsContainer.innerHTML = cart.map(item => {
    const installmentPrice = (item.price / 2).toFixed(2);
    const accountTypeText = item.accountType === 'primary' ? 'Conta Primária' : 'Conta Secundária';
    const paymentTypeText = item.paymentType === 'pix'
      ? 'À vista no PIX'
      : `2x de R$ ${installmentPrice}`;

    return `
      <div class="cart-item" data-item-id="${item.id}">
        <img src="${item.gameImage}" alt="${item.gameTitle}" class="cart-item-image">
        <div class="cart-item-details">
          <h3 class="cart-item-title">${item.gameTitle}</h3>
          <span class="cart-item-platform">${item.gamePlatform}</span>

          <div class="cart-item-options">
            <div class="cart-item-option">
              <label>Tipo de Conta:</label>
              <select class="cart-item-select" onchange="updateCartItem(${item.id}, 'accountType', this.value)">
                <option value="primary" ${item.accountType === 'primary' ? 'selected' : ''}>Conta Primária</option>
                <option value="secondary" ${item.accountType === 'secondary' ? 'selected' : ''}>Conta Secundária</option>
              </select>
            </div>

            <div class="cart-item-option">
              <label>Pagamento:</label>
              <select class="cart-item-select" onchange="updateCartItem(${item.id}, 'paymentType', this.value)">
                <option value="pix" ${item.paymentType === 'pix' ? 'selected' : ''}>À vista no PIX</option>
                <option value="installment" ${item.paymentType === 'installment' ? 'selected' : ''}>Parcelado (2x)</option>
              </select>
            </div>
          </div>

          <div class="cart-item-pricing">
            <div class="cart-item-account-type">${accountTypeText}</div>
            <div class="cart-item-payment-type">${paymentTypeText}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
          </div>
        </div>

        <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remover">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}

function checkoutCart() {
  if (cart.length === 0) return;

  const gamesList = cart.map(item => {
    const accountTypeText = item.accountType === 'primary' ? 'Primária' : 'Secundária';
    const installmentPrice = (item.price / 2).toFixed(2);
    const paymentText = item.paymentType === 'pix'
      ? 'A Vista'
      : `Parcelado em 2x de R$ ${installmentPrice}`;

    return `🎮 ${item.gameTitle}\nConta: ${accountTypeText}\nPagamento: ${paymentText}\nValor: R$ ${item.price.toFixed(2)}`;
  }).join('\n\n');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const finalMessage = `🛒 Resumo do Pedido\n\n${gamesList}\n\n💰 Total do pedido: R$${total.toFixed(2)}`;

  window.open(`https://wa.me/5518997409779?text=${encodeURIComponent(finalMessage)}`, '_blank');

  cart = [];
  saveCart();
  closeCartModal();
  showNotification('Pedido enviado! Aguarde nosso contato.');
}

function showNotification(message) {
  const existingNotification = document.querySelector('.cart-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();

  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCartModal();
      }
    });
  }
});
