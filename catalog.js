let selectedGames = new Set();
let accountType = '';
let quantityRequired = 0;
let baseQuantity = 0;
let filteredGames = [];
let allGames = [];
let currentCategory = 'all';
let searchTerm = '';
let calculatedPrice = 0;
let extraGamesCount = 0;
let maxExtraGames = 2;

window.initCatalog = function initCatalog(type, quantity, games) {
  accountType = type;
  quantityRequired = quantity;
  baseQuantity = quantity;
  allGames = games;

  filteredGames = games.filter(
    game => game.account_type == accountType && game.quantity_required == quantityRequired
  );
  console.log('Initialized catalog. Total games:', games.length, 'Filtered games:', filteredGames.length, 'Type:', accountType, 'Qty:', quantityRequired);

  renderGames();
  updateUI();
  setupBuyButton();
  setupAddExtraButton();
  setupCancelExtraButton();
  setupCartButton();
  setupCategoryButtons();
  setupSearchInput();
}

function renderGames() {
  const gamesGrid = document.getElementById('gamesGrid');
  gamesGrid.innerHTML = '';

  let gamesToDisplay = filteredGames;

  if (currentCategory !== 'all') {
    gamesToDisplay = gamesToDisplay.filter(game => game.category === currentCategory);
  }

  if (searchTerm) {
    gamesToDisplay = gamesToDisplay.filter(game =>
      game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (gamesToDisplay.length === 0) {
    if (searchTerm) {
      gamesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; color: #6b7280;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem; opacity: 0.5;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Nenhum jogo encontrado para "${searchTerm}"</p>
          <p style="font-size: 0.9rem; color: #9ca3af; margin-bottom: 1.5rem;">Não achou o que procurava?</p>
          <button onclick="sendPromoGameRequestToWhatsApp('${searchTerm.replace(/'/g, "\\'")}')" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
            </svg>
            Enviar para WhatsApp
          </button>
        </div>
      `;
    } else {
      gamesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; text-align: center; color: #6b7280;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem; opacity: 0.5;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p style="font-size: 1.25rem; font-weight: 600;">Nenhum jogo encontrado</p>
        </div>
      `;
    }
    return;
  }

  gamesToDisplay.forEach(game => {
    const isSelected = selectedGames.has(game.id);
    const currentMaxGames = baseQuantity + extraGamesCount;
    const isDisabled = selectedGames.size >= currentMaxGames && !isSelected;

    const gameCard = document.createElement('div');
    gameCard.className = `game-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
    gameCard.onclick = () => !isDisabled && toggleGame(game.id);

    gameCard.innerHTML = `
      <div class="game-image-container">
        <img src="${game.image_url}" alt="${game.title}" class="game-image">
        <div class="game-overlay"></div>
        ${isSelected ? `
          <div class="check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        ` : ''}
        <div class="game-info">
          <h3 class="game-title">${game.title}</h3>
          <span class="game-platform">${game.platform}</span>
        </div>
      </div>
    `;

    gamesGrid.appendChild(gameCard);
  });
}

function calculatePrice() {
  const selectedGamesList = filteredGames.filter(game => selectedGames.has(game.id));
  const totalCost = selectedGamesList.reduce((sum, game) => sum + (game.cost || 0), 0);

  let basePrice;
  if (totalCost >= 60.00) {
    basePrice = 99.90;
  } else if (totalCost >= 45.00) {
    basePrice = 97.50;
  } else {
    basePrice = 94.90;
  }

  let extraPrice = 0;
  if (extraGamesCount > 0) {
    if (accountType === 'primary') {
      if (extraGamesCount === 1) {
        extraPrice = 43.50;
      } else if (extraGamesCount === 2) {
        extraPrice = 43.50 + 37.90;
      }
    } else if (accountType === 'secondary') {
      if (extraGamesCount === 1) {
        extraPrice = 27.99;
      } else if (extraGamesCount === 2) {
        extraPrice = 27.99 + 23.99;
      }
    }
  }

  return basePrice + extraPrice;
}

function toggleGame(gameId) {
  const currentMaxGames = baseQuantity + extraGamesCount;

  if (selectedGames.has(gameId)) {
    selectedGames.delete(gameId);
  } else {
    if (selectedGames.size < currentMaxGames) {
      selectedGames.add(gameId);
    }
  }

  renderGames();
  updateUI();
}

function updateUI() {
  const selectionCounter = document.getElementById('selectionCounter');
  const floatingMessage = document.getElementById('floatingMessage');
  const messageText = document.getElementById('messageText');
  const floatingBuyButton = document.getElementById('floatingBuyButton');
  const floatingAddExtraButton = document.getElementById('floatingAddExtraButton');
  const floatingCancelExtraButton = document.getElementById('floatingCancelExtraButton');
  const floatingCartButton = document.getElementById('floatingCartButton');

  const selectedCount = selectedGames.size;
  const currentMaxGames = baseQuantity + extraGamesCount;
  const remaining = currentMaxGames - selectedCount;

  selectionCounter.textContent = `Selecionados: ${selectedCount} de ${currentMaxGames}`;

  if (selectedCount === 0) {
    calculatedPrice = 0;
    if (floatingMessage) {
      floatingMessage.classList.remove('show');
      floatingMessage.style.display = '';
    }
  } else if (selectedCount < currentMaxGames) {
    if (floatingMessage && messageText) {
      if (remaining === 1) {
        messageText.textContent = 'Escolha mais 1 jogo';
      } else {
        messageText.textContent = `Escolha mais ${remaining} jogos`;
      }
      floatingMessage.style.display = '';
      floatingMessage.classList.add('show');
      if (floatingBuyButton) {
        floatingBuyButton.style.display = 'none';
      }
      if (floatingAddExtraButton) {
        floatingAddExtraButton.style.display = 'none';
      }
      if (floatingCancelExtraButton) {
        floatingCancelExtraButton.style.display = extraGamesCount > 0 ? 'flex' : 'none';
      }
      if (floatingCartButton) {
        floatingCartButton.style.display = 'none';
      }
    }
  } else if (selectedCount === currentMaxGames) {
    calculatedPrice = calculatePrice();
    if (floatingMessage && messageText && floatingBuyButton) {
      messageText.textContent = `Pedido pronto! Total: R$ ${calculatedPrice.toFixed(2)}`;
      floatingBuyButton.style.display = 'flex';
      floatingMessage.style.display = '';
      floatingMessage.classList.add('show');

      if (floatingCartButton) {
        floatingCartButton.style.display = 'flex';
      }

      if (floatingCancelExtraButton) {
        floatingCancelExtraButton.style.display = 'none';
      }

      if (floatingAddExtraButton && extraGamesCount < maxExtraGames) {
        floatingAddExtraButton.style.display = 'flex';

        let extraText = '';
        let extraPriceText = '';

        if (accountType === 'primary') {
          if (extraGamesCount === 0) {
            extraPriceText = '+R$43,50';
            extraText = `Adicione mais 1 jogo por apenas ${extraPriceText}`;
          } else if (extraGamesCount === 1) {
            extraPriceText = '+R$37,90';
            extraText = `Adicione mais 1 jogo por apenas ${extraPriceText}`;
          }
        } else if (accountType === 'secondary') {
          if (extraGamesCount === 0) {
            extraPriceText = '+R$27,99';
            extraText = `Adicione mais 1 jogo por apenas ${extraPriceText}`;
          } else if (extraGamesCount === 1) {
            extraPriceText = '+R$23,99';
            extraText = `Adicione mais 1 jogo por apenas ${extraPriceText}`;
          }
        }

        floatingAddExtraButton.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          ${extraText}
        `;
      } else {
        if (floatingAddExtraButton) {
          floatingAddExtraButton.style.display = 'none';
        }
      }
    }
  }
}

function setupBuyButton() {
  const floatingBuyButton = document.getElementById('floatingBuyButton');

  if (floatingBuyButton) {
    floatingBuyButton.addEventListener('click', () => {
      const selectedGamesList = filteredGames.filter(game => selectedGames.has(game.id));
      const gameNames = selectedGamesList.map(game => game.title).join('\n');

      const finalMessage = `Olá, quero comprar os jogos:\n\n${gameNames}\n\nTotal: R$ ${calculatedPrice.toFixed(2)}`;

      const message = encodeURIComponent(finalMessage);

      window.open(`https://wa.me/5518997409779?text=${message}`, '_blank');
    });
  }
}

function setupAddExtraButton() {
  const floatingAddExtraButton = document.getElementById('floatingAddExtraButton');

  if (floatingAddExtraButton) {
    floatingAddExtraButton.addEventListener('click', () => {
      if (extraGamesCount < maxExtraGames) {
        extraGamesCount++;
        updateUI();
        renderGames();
      }
    });
  }
}

function setupCancelExtraButton() {
  const floatingCancelExtraButton = document.getElementById('floatingCancelExtraButton');

  if (floatingCancelExtraButton) {
    floatingCancelExtraButton.addEventListener('click', () => {
      if (extraGamesCount > 0) {
        const excessGames = selectedGames.size - baseQuantity;
        if (excessGames > 0) {
          const gamesArray = Array.from(selectedGames);
          for (let i = 0; i < excessGames; i++) {
            selectedGames.delete(gamesArray[gamesArray.length - 1 - i]);
          }
        }
        extraGamesCount = 0;
        updateUI();
        renderGames();
      }
    });
  }
}

function setupCartButton() {
  const floatingCartButton = document.getElementById('floatingCartButton');

  if (floatingCartButton) {
    floatingCartButton.addEventListener('click', () => {
      openPromoCartModal();
    });
  }
}

function openPromoCartModal() {
  const modal = document.getElementById('promoCartModal');
  const floatingMessage = document.getElementById('floatingMessage');
  if (!modal) return;

  const selectedGamesList = filteredGames.filter(game => selectedGames.has(game.id));
  renderPromoCart(selectedGamesList);

  if (floatingMessage) {
    floatingMessage.style.display = 'none';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePromoCartModal() {
  const modal = document.getElementById('promoCartModal');
  const floatingMessage = document.getElementById('floatingMessage');
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  if (floatingMessage && selectedGames.size > 0) {
    floatingMessage.style.display = '';
  }
}

window.closePromoCartModal = closePromoCartModal;

function renderPromoCart(gamesList) {
  const cartItemsContainer = document.getElementById('promoCartItems');
  const cartEmpty = document.getElementById('promoCartEmpty');
  const cartSummary = document.getElementById('promoCartSummary');
  const cartTotalItems = document.getElementById('promoCartTotalItems');
  const cartTotalPrice = document.getElementById('promoCartTotalPrice');

  if (!cartItemsContainer || !cartEmpty || !cartSummary) return;

  if (gamesList.length === 0) {
    cartItemsContainer.style.display = 'none';
    cartEmpty.style.display = 'flex';
    cartSummary.style.display = 'none';
    return;
  }

  cartItemsContainer.style.display = 'block';
  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';

  cartTotalItems.textContent = gamesList.length;
  cartTotalPrice.textContent = `R$ ${calculatedPrice.toFixed(2)}`;

  cartItemsContainer.innerHTML = gamesList.map(game => {
    const accountTypeText = accountType === 'primary' ? 'Conta Primária' : 'Conta Secundária';

    return `
      <div class="promo-cart-item" data-game-id="${game.id}">
        <img src="${game.image_url}" alt="${game.title}" class="promo-cart-item-image">
        <div class="promo-cart-item-details">
          <h3 class="promo-cart-item-title">${game.title}</h3>
          <span class="promo-cart-item-platform">${game.platform}</span>
          <div class="promo-cart-item-type">${accountTypeText}</div>
        </div>
        <button class="promo-cart-item-remove" onclick="removePromoGame('${game.id}')" title="Remover">
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

window.removePromoGame = function (gameId) {
  selectedGames.delete(gameId);

  const selectedCount = selectedGames.size;
  const currentMaxGames = baseQuantity + extraGamesCount;

  if (selectedCount < baseQuantity && extraGamesCount > 0) {
    extraGamesCount = 0;
  }

  const selectedGamesList = filteredGames.filter(game => selectedGames.has(game.id));
  renderPromoCart(selectedGamesList);
  updateUI();
  renderGames();

  if (selectedGames.size === 0) {
    closePromoCartModal();
  }
};

function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-btn');

  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      currentCategory = button.getAttribute('data-category');
      renderGames();
    });
  });
}

function setupSearchInput() {
  const searchInput = document.getElementById('promoSearchInput');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderGames();
    });
  }
}

window.sendPromoGameRequestToWhatsApp = function (gameName) {
  const message = `Olá! Estou procurando o jogo: ${gameName}\n\nPoderia verificar se vocês têm disponível?`;
  window.open(`https://wa.me/5518997409779?text=${encodeURIComponent(message)}`, '_blank');
};

window.sendPromoCartToWhatsApp = function () {
  const selectedGamesList = filteredGames.filter(game => selectedGames.has(game.id));
  const gameNames = selectedGamesList.map(game => game.title).join('\n');
  const accountTypeText = accountType === 'primary' ? 'Conta Primária' : 'Conta Secundária';

  const finalMessage = `Olá! Quero comprar os seguintes jogos:\n\n${gameNames}\n\nTipo de Conta: ${accountTypeText}\nTotal: R$ ${calculatedPrice.toFixed(2)}`;

  const message = encodeURIComponent(finalMessage);

  window.open(`https://wa.me/5518997409779?text=${message}`, '_blank');
};
