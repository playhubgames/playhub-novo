# Como Adicionar Jogos ao Catálogo

Os jogos estão separados em 3 arquivos diferentes:

1. **regular-games-data.js** - Jogos do catálogo principal
2. **promo-2games-data.js** - Jogos da promoção "2 por R$ 94,90" (Conta Primária)
3. **promo-3games-data.js** - Jogos da promoção "3 por R$ 94,90" (Conta Secundária)

## Estrutura de um Jogo

Cada jogo deve seguir este formato:

```javascript
{
  id: 'r16',
  title: 'Nome do Jogo',
  description: 'Descrição completa do jogo explicando seus principais recursos e atrativos.',
  image_url: 'URL_DA_IMAGEM',
  platform: 'PS5',
  category: 'acao',
  primaryAccount: {
    pixPrice: 199.90,
    installmentPrice: 219.90
  },
  secondaryAccount: {
    pixPrice: 99.90,
    installmentPrice: 109.90
  }
}
```

## Campos Obrigatórios

### id
- Identificador único do jogo
- Use o formato 'r' + número sequencial (ex: 'r16', 'r17')

### title
- Nome completo do jogo
- Exemplo: 'God of War Ragnarök'

### description
- Descrição detalhada do jogo
- Explique os principais recursos, mecânicas e atrativos
- Seja persuasivo para atrair o cliente

### image_url
- URL da imagem de capa do jogo
- Use imagens de alta qualidade
- Recomendado: 800x800px ou maior

### platform
- Console compatível
- Opções: 'PS4', 'PS5' ou 'PS4/PS5'

### category
- Categoria do jogo para filtros
- Opções disponíveis:
  - 'acao' - Jogos de ação
  - 'aventura' - Jogos de aventura
  - 'rpg' - RPGs
  - 'esporte' - Jogos esportivos
  - 'luta' - Jogos de luta
  - 'terror' - Jogos de terror
  - 'infantil' - Jogos infantis

### primaryAccount
Objeto com os preços para Conta Primária:
- **pixPrice**: Preço à vista no PIX (menor preço)
- **installmentPrice**: Preço total do parcelamento em 2x

### secondaryAccount
Objeto com os preços para Conta Secundária:
- **pixPrice**: Preço à vista no PIX (menor preço)
- **installmentPrice**: Preço total do parcelamento em 2x

## Exemplo Completo

```javascript
{
  id: 'r16',
  title: 'Spider-Man 2',
  description: 'Jogue com Peter Parker e Miles Morales em uma aventura épica por Nova York. Enfrente vilões icônicos e domine novos poderes nesta sequência espetacular.',
  image_url: 'https://images.pexels.com/photos/example.jpg',
  platform: 'PS5',
  category: 'acao',
  primaryAccount: {
    pixPrice: 249.90,
    installmentPrice: 269.90
  },
  secondaryAccount: {
    pixPrice: 124.90,
    installmentPrice: 134.90
  }
}
```

## Importante

1. Sempre adicione uma vírgula após cada jogo, exceto o último
2. O preço exibido no catálogo é sempre o da **conta secundária** (menor preço)
3. O sistema mostra automaticamente "A partir de R$ X,XX" baseado no menor preço
4. O preço do parcelamento deve ser sempre maior que o do PIX (inclui taxas)
5. A conta secundária sempre tem preço menor que a primária

## Onde Adicionar

### Catálogo Principal
Adicione novos jogos no array `regularGames` no arquivo **regular-games-data.js**, seguindo o formato acima.

### Promoção 2 por R$ 94,90
Para adicionar jogos na promoção de 2 jogos, edite o arquivo **promo-2games-data.js**.

Estrutura simplificada para jogos de promoção:

```javascript
{
  id: '5',
  title: 'Nome do Jogo',
  image_url: 'URL_DA_IMAGEM',
  platform: 'PS5',
  account_type: 'primary',
  price: 94.90,
  cost: 25.00,
  quantity_required: 2,
  category: 'action'
}
```

### Promoção 3 por R$ 94,90
Para adicionar jogos na promoção de 3 jogos, edite o arquivo **promo-3games-data.js**.

Estrutura simplificada para jogos de promoção:

```javascript
{
  id: '9',
  title: 'Nome do Jogo',
  image_url: 'URL_DA_IMAGEM',
  platform: 'PS5',
  account_type: 'secondary',
  price: 94.90,
  cost: 15.00,
  quantity_required: 3,
  category: 'action'
}
```

## Campo de Custo (INTERNO)

O campo **cost** é usado internamente para calcular o preço final dinâmico baseado na soma dos custos dos jogos selecionados:

### Lógica de Precificação

Quando o cliente seleciona os jogos, o sistema soma os custos e define o preço final:

- **Custo Total entre R$ 60,00 e R$ 75,00** → Preço Final: **R$ 99,90**
- **Custo Total entre R$ 45,00 e R$ 59,99** → Preço Final: **R$ 97,50**
- **Custo Total entre R$ 0,00 e R$ 44,99** → Preço Final: **R$ 94,90**

### Importante sobre o campo cost:
- Este valor NÃO é exibido para o cliente
- É usado apenas para cálculos internos de precificação
- Defina valores realistas baseados no custo real de cada jogo
- O preço final será calculado automaticamente e mostrado ao cliente quando ele completar a seleção
