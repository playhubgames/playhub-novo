let regularGames = [];

document.addEventListener('DOMContentLoaded', async () => {
  const benefitsSlider = document.getElementById('benefitsSlider');

  if (benefitsSlider) {
    const cards = benefitsSlider.innerHTML;
    benefitsSlider.innerHTML = cards + cards + cards;
  }

  try {
    const response = await fetch('games_dump_complete.json');
    const data = await response.json();

    regularGames = data.map(game => {
      const primary = game.account_options?.find(opt => opt.type === 'primaria') || { price: 0 };
      const secondary = game.account_options?.find(opt => opt.type === 'secundaria') || { price: 0 };

      let category = 'outros';
      const genres = game.genre || [];
      const genreString = genres.join(' ').toLowerCase();

      if (genreString.includes('terror')) category = 'terror';
      else if (genreString.includes('luta')) category = 'luta';
      else if (genreString.includes('esporte') || genreString.includes('corrida') || genreString.includes('futebol')) category = 'esporte';
      else if (genreString.includes('infantil') || genreString.includes('lego') || genreString.includes('family')) category = 'infantil';
      else if (genreString.includes('rpg')) category = 'rpg';
      else if (genreString.includes('aventura')) category = 'aventura';
      else if (genreString.includes('ação') || genreString.includes('acao') || genreString.includes('tiro')) category = 'acao';

      return {
        id: game.id,
        title: game.title,
        platform: game.console,
        image_url: game.image,
        description: game.description,
        category: category,
        primaryAccount: {
          pixPrice: Number(primary.price),
          installmentPrice: Number(primary.price)
        },
        secondaryAccount: {
          pixPrice: Number(secondary.price),
          installmentPrice: Number(secondary.price)
        }
      };
    });

    initRegularGames();
  } catch (error) {
    console.error('Erro ao carregar jogos:', error);
  }
});

function initRegularGames() {
  const searchInput = document.getElementById('searchInput');
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  const priceFilter = document.getElementById('priceFilter');
  const priceValue = document.getElementById('priceValue');
  const gamesGrid = document.getElementById('regularGamesGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  if (!searchInput || !categoryInputs.length || !priceFilter || !gamesGrid || !noResults) {
    return;
  }

  let currentCategory = 'all';
  let filteredGames = [...regularGames];

  function updateNoResultsMessage() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      noResults.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p>Nenhum jogo encontrado para "${searchTerm}"</p>
          <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.5rem;">Não achou o que procurava?</p>
          <button onclick="sendGameRequestToWhatsApp('${searchTerm.replace(/'/g, "\\'")}')" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #25d366 0%, #128c7e 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path>
            </svg>
            Enviar para WhatsApp
          </button>
        `;
    } else {
      noResults.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p>Nenhum jogo encontrado</p>
        `;
    }
  }

  window.sendGameRequestToWhatsApp = function (gameName) {
    const message = `Olá! Estou procurando o jogo: ${gameName}\n\nPoderia verificar se vocês têm disponível?`;
    window.open(`https://wa.me/5518997409779?text=${encodeURIComponent(message)}`, '_blank');
  };

  function renderGames() {
    gamesGrid.innerHTML = '';

    if (resultsCount) {
      resultsCount.textContent = `${filteredGames.length} jogos encontrados`;
    }

    if (filteredGames.length === 0) {
      gamesGrid.style.display = 'none';
      noResults.style.display = 'flex';
      updateNoResultsMessage();
      return;
    }

    gamesGrid.style.display = 'grid';
    noResults.style.display = 'none';

    filteredGames.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.className = 'regular-game-card';
      gameCard.style.cursor = 'pointer';

      const secondaryPixPrice = game.secondaryAccount.pixPrice;
      const secondaryInstallmentPrice = (game.secondaryAccount.installmentPrice / 2).toFixed(2);

      gameCard.innerHTML = `
          <div class="regular-game-box">
            <img src="${game.image_url}" alt="${game.title}" class="regular-game-cover" loading="lazy">
            <div class="regular-game-badge">Em Estoque</div>
          </div>
          <div class="regular-game-content">
            <h3 class="regular-game-title">${game.title}</h3>
            <span class="regular-game-platform">${game.platform}</span>
            <div class="regular-game-pricing">
              <span class="regular-game-from">A partir de</span>
              <span class="regular-game-price">R$ ${secondaryPixPrice.toFixed(2)}</span>
              <span class="regular-game-installment">ou 2x de R$ ${secondaryInstallmentPrice}</span>
            </div>
          </div>
        `;

      gameCard.addEventListener('click', () => openGameModal(game));

      gamesGrid.appendChild(gameCard);
    });
  }

  function filterGames() {
    const searchTerm = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceFilter.value);

    filteredGames = regularGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm);
      const matchesCategory = currentCategory === 'all' || game.category === currentCategory;
      const matchesPrice = maxPrice >= 250 || game.secondaryAccount.pixPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    renderGames();
  }

  function updatePriceLabel() {
    const value = parseInt(priceFilter.value);
    if (value >= 250) {
      priceValue.textContent = 'Todos';
    } else {
      priceValue.textContent = `Até R$ ${value}`;
    }
  }

  categoryInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        currentCategory = e.target.value;
        filterGames();
      }
    });
  });

  searchInput.addEventListener('input', filterGames);

  priceFilter.addEventListener('input', () => {
    updatePriceLabel();
    filterGames();
  });

  updatePriceLabel();
  renderGames();
}

window.openGameModal = function (game) {
  const modal = document.getElementById('gameModal');
  if (!modal) {
    createGameModal();
    window.openGameModal(game);
    return;
  }

  const primaryPixPrice = game.primaryAccount.pixPrice;
  const secondaryPixPrice = game.secondaryAccount.pixPrice;

  // Format Description and Specs
  let descriptionHtml = '';
  let specsHtml = '';

  if (game.description) {
    const parts = game.description.split(/Especificações técnicas[:\r\n]*/i);
    const narrativeText = parts[0] || '';
    const specsText = parts[1] || '';

    // Process Narrative
    const narrativeLines = narrativeText.split(/\r\n|\n/).map(line => line.trim()).filter(line => line);
    descriptionHtml = narrativeLines.map(line => {
      // Simple heuristic: If line is short and uppercase, treating as header
      // Or specific known headers. 
      // User example: "RIDE 4 PARA PS4"
      const isHeader = line.length > 3 && line.length < 100 && line === line.toUpperCase() && !line.includes('.');
      if (isHeader) {
        return `<h4 class="modal-story-title">${line}</h4>`;
      }
      return `<p class="modal-story-text">${line}</p>`;
    }).join('');

    // Process Specs
    if (specsText) {
      const specLines = specsText.split(/\r\n|\n/).map(s => s.trim()).filter(s => s);
      const specCards = specLines.map(line => {
        if (line.includes(':')) {
          const [key, ...values] = line.split(':');
          const value = values.join(':').trim();
          // Skip content like "Confira agora..."
          if (key.toLowerCase().includes('confira agora')) return '';
          if (!value) return '';

          return `
                    <div class="tech-spec-card">
                        <span class="spec-label">${key.trim()}</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `;
        } else if (line.toLowerCase().includes('lançamento')) {
          // Handle "Lançamento 08 de Outubro..." which might not have :
          return `
                    <div class="tech-spec-card">
                        <span class="spec-label">Lançamento</span>
                        <span class="spec-value">${line.replace(/lançamento/i, '').trim()}</span>
                    </div>
                `;
        }
        return '';
      }).join('');

      if (specCards) {
        specsHtml = `
                <div class="modal-specs-section">
                    <h4 class="game-modal-section-title">Especificações Técnicas</h4>
                    <div class="tech-specs-grid">
                        ${specCards}
                    </div>
                </div>
            `;
      }
    }
  }

  const modalContent = `
      <button class="modal-close" onclick="closeGameModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="game-modal-header">
        <img src="${game.image_url}" alt="${game.title}" class="game-modal-image">
        <div class="game-modal-info">
          <h3 class="game-modal-title">${game.title}</h3>
          <span class="game-modal-platform">${game.platform}</span>
          <div class="game-modal-description-container">
            ${descriptionHtml}
          </div>
          ${specsHtml}
        </div>
      </div>

      <h4 class="game-modal-section-title">Escolha o tipo de conta</h4>

      <div class="account-type-options">
        <div class="account-type-card" onclick="showPaymentOptions('primary')">
          <div class="account-type-badge">MAIS POPULAR</div>
          <div class="account-type-header">
            <div class="account-type-title-container">
              <span class="account-type-title">Conta Primária</span>
              <button class="account-type-info-btn" onclick="event.stopPropagation(); toggleTooltip('primary')" title="O que é?">?</button>
              <div id="tooltipPrimary" class="account-info-tooltip">
                <div class="tooltip-title">Conta Primária</div>
                <div class="tooltip-text">Jogue online, acesse DLCs e atualizações. Os jogos ficam vinculados à sua conta PlayStation.</div>
              </div>
            </div>
            <div class="account-type-price-container">
              <div class="account-type-price">R$ ${primaryPixPrice.toFixed(2)}</div>
            </div>
          </div>
          <div class="account-type-description">
            Jogue online e offline com acesso completo a todos os recursos do jogo.
          </div>
        </div>

        <div class="account-type-card account-type-card-secondary" onclick="showPaymentOptions('secondary')">
          <div class="account-type-badge">MELHOR CUSTO</div>
          <div class="account-type-header">
            <div class="account-type-title-container">
              <span class="account-type-title">Conta Secundária</span>
              <button class="account-type-info-btn" onclick="event.stopPropagation(); toggleTooltip('secondary')" title="O que é?">?</button>
              <div id="tooltipSecondary" class="account-info-tooltip">
                <div class="tooltip-title">Conta Secundária</div>
                <div class="tooltip-text">Jogue offline através do compartilhamento de biblioteca. Ideal para jogos single player.</div>
              </div>
            </div>
            <div class="account-type-price-container">
              <div class="account-type-price">R$ ${secondaryPixPrice.toFixed(2)}</div>
            </div>
          </div>
          <div class="account-type-description">
            Modo offline apenas. Perfeito para aproveitar campanhas e histórias épicas.
          </div>
        </div>
      </div>
    `;

  modal.querySelector('.game-modal-content').innerHTML = modalContent;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  window.currentGame = game;
}

function createGameModal() {
  const modal = document.createElement('div');
  modal.id = 'gameModal';
  modal.className = 'game-modal';
  modal.innerHTML = '<div class="game-modal-content"></div>';

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeGameModal();
    }
  });

  document.body.appendChild(modal);
}

window.closeGameModal = function () {
  const modal = document.getElementById('gameModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};

window.showPaymentOptions = function (accountType) {
  const game = window.currentGame;
  if (!game) return;

  const modal = document.getElementById('gameModal');
  const accountTypeText = accountType === 'primary' ? 'Conta Primária' : 'Conta Secundária';
  const accountData = accountType === 'primary' ? game.primaryAccount : game.secondaryAccount;
  const pixPrice = accountData.pixPrice;
  const installmentPrice = accountData.installmentPrice;
  const installmentPricePerMonth = (installmentPrice / 2).toFixed(2);

  const modalContent = `
      <button class="modal-close" onclick="closeGameModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <button class="modal-back" onclick="openGameModal(window.currentGame)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Voltar
      </button>

      <div class="game-modal-header">
        <img src="${game.image_url}" alt="${game.title}" class="game-modal-image">
        <div class="game-modal-info">
          <h3 class="game-modal-title">${game.title}</h3>
          <span class="game-modal-platform">${game.platform}</span>
          <p class="game-modal-description">${game.description}</p>
        </div>
      </div>

      <div class="payment-type-badge">${accountTypeText}</div>

      <h4 class="game-modal-section-title">Escolha a forma de pagamento</h4>

      <div class="payment-options">
        <div class="payment-option-card payment-option-pix" onclick="selectPaymentMethod('${accountType}', ${pixPrice}, 'pix')">
          <div class="payment-option-badge">MAIS RÁPIDO</div>
          <div class="payment-option-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7.45 3.73L12 11.63 4.55 7.91 12 4.18zM4 9.27l7 3.5v6.96l-7-3.5V9.27zm9 10.46v-6.96l7-3.5v6.96l-7 3.5z"/>
            </svg>
          </div>
          <h3 class="payment-option-title">À vista no PIX</h3>
          <div class="payment-option-price">R$ ${pixPrice.toFixed(2)}</div>
          <p class="payment-option-description">Pagamento instantâneo e entrega imediata</p>
        </div>

        <div class="payment-option-card payment-option-installment" onclick="selectPaymentMethod('${accountType}', ${installmentPrice}, 'installment')">
          <div class="payment-option-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h3 class="payment-option-title">Parcelado</h3>
          <div class="payment-option-price">2x de R$ ${installmentPricePerMonth}</div>
          <div class="payment-option-total">Total: R$ ${installmentPrice.toFixed(2)}</div>
          <p class="payment-option-description">Sem juros no cartão de crédito</p>
        </div>
      </div>
    `;

  modal.querySelector('.game-modal-content').innerHTML = modalContent;
};

window.selectPaymentMethod = function (accountType, price, paymentType) {
  const game = window.currentGame;
  if (!game) return;

  const modal = document.getElementById('gameModal');
  const accountTypeText = accountType === 'primary' ? 'Conta Primária' : 'Conta Secundária';
  const installmentPrice = (price / 2).toFixed(2);
  const paymentText = paymentType === 'pix' ? 'À vista no PIX' : `Parcelado em 2x de R$ ${installmentPrice}`;

  const savedCart = localStorage.getItem('playhub_cart');
  const hasItemsInCart = savedCart && JSON.parse(savedCart).length > 0;

  const actionButtons = hasItemsInCart ? `
      <button class="action-button action-button-cart" onclick="addToCartAndClose('${accountType}', ${price}, '${paymentType}')" style="width: 100%;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <div>
          <div class="action-button-title">Adicionar ao Carrinho</div>
          <div class="action-button-subtitle">Continue comprando outros jogos</div>
        </div>
      </button>
    ` : `
      <button class="action-button action-button-cart" onclick="addToCartAndClose('${accountType}', ${price}, '${paymentType}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <div>
          <div class="action-button-title">Adicionar ao Carrinho</div>
          <div class="action-button-subtitle">Continue comprando outros jogos</div>
        </div>
      </button>

      <button class="action-button action-button-whatsapp" onclick="buyNow('${accountType}', ${price}, '${paymentType}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <div>
          <div class="action-button-title">Comprar Agora</div>
          <div class="action-button-subtitle">Enviar direto para o WhatsApp</div>
        </div>
      </button>
    `;

  const modalContent = `
      <button class="modal-close" onclick="closeGameModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <button class="modal-back" onclick="showPaymentOptions('${accountType}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Voltar
      </button>

      <div class="game-modal-header">
        <img src="${game.image_url}" alt="${game.title}" class="game-modal-image">
        <div class="game-modal-info">
          <h3 class="game-modal-title">${game.title}</h3>
          <span class="game-modal-platform">${game.platform}</span>
          <p class="game-modal-description">${game.description}</p>
        </div>
      </div>

      <div class="payment-type-badge">${accountTypeText}</div>
      <div class="payment-type-badge" style="margin-left: 0.5rem;">${paymentText}</div>

      <h4 class="game-modal-section-title">O que você deseja fazer?</h4>

      <div class="action-buttons">
        ${actionButtons}
      </div>
    `;

  modal.querySelector('.game-modal-content').innerHTML = modalContent;
};

window.addToCartAndClose = function (accountType, price, paymentType) {
  const game = window.currentGame;
  if (!game || typeof addToCart !== 'function') return;

  addToCart(game, accountType, price, paymentType);
  closeGameModal();
};

window.buyNow = function (accountType, price, paymentType) {
  const game = window.currentGame;
  if (!game) return;

  const accountTypeText = accountType === 'primary' ? 'Primária' : 'Secundária';
  const installmentPrice = (price / 2).toFixed(2);
  const paymentText = paymentType === 'pix' ? 'A Vista' : `Parcelado em 2x de R$ ${installmentPrice}`;
  const message = `🛒 Resumo do Pedido\n\n🎮 ${game.title}\nConta: ${accountTypeText}\nPagamento: ${paymentText}\nValor: R$ ${price.toFixed(2)}\n\n💰 Total do pedido: R$${price.toFixed(2)}`;

  window.open(`https://wa.me/5518997409779?text=${encodeURIComponent(message)}`, '_blank');
  closeGameModal();
};

window.toggleTooltip = function (type) {
  const tooltipId = type === 'primary' ? 'tooltipPrimary' : 'tooltipSecondary';
  const tooltip = document.getElementById(tooltipId);
  const otherTooltipId = type === 'primary' ? 'tooltipSecondary' : 'tooltipPrimary';
  const otherTooltip = document.getElementById(otherTooltipId);

  if (otherTooltip) {
    otherTooltip.classList.remove('show');
  }

  if (tooltip) {
    tooltip.classList.toggle('show');
  }
};


