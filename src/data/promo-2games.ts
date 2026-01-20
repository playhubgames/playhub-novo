import rawData from './promocoes_primaria_25.json';

export const promo2Games = rawData.map((item, index) => {
    let category = 'others';
    const nameLower = item.name.toLowerCase();

    // Categorization Logic
    if (nameLower.includes('fifa') || nameLower.includes('nba') || nameLower.includes('ride') || nameLower.includes('f1') || nameLower.includes('pes ') || nameLower.includes('efootball')) {
        category = 'sports';
    } else if (nameLower.includes('lego') || nameLower.includes('minecraft') || nameLower.includes('disney') || nameLower.includes('family')) {
        category = 'lego';
    } else if (nameLower.includes('resident evil') || nameLower.includes('silent hill') || nameLower.includes('outlast') || nameLower.includes('terror') || nameLower.includes('horror')) {
        category = 'terror';
    } else if (nameLower.includes('mortal kombat') || nameLower.includes('street fighter') || nameLower.includes('injustice') || nameLower.includes('tekken') || nameLower.includes('dragon ball') || nameLower.includes('ufc')) {
        category = 'fight';
    } else if (nameLower.includes('call of duty') || nameLower.includes('battlefield') || nameLower.includes('far cry') || nameLower.includes('sniper') || nameLower.includes('doom') || nameLower.includes('rainbow six')) {
        category = 'shooting';
    } else if (nameLower.includes('assassin') || nameLower.includes('god of war') || nameLower.includes('last of us') || nameLower.includes('spider') || nameLower.includes('unkcharted') || nameLower.includes('batman') || nameLower.includes('red dead') || nameLower.includes('gta') || nameLower.includes('grand theft auto')) {
        category = 'action';
    }

    return {
        id: String(index + 1),
        title: item.name,
        image_url: item.image,
        platform: item.name.includes('PS5') ? 'PS5' : 'PS4',
        account_type: 'primary',
        price: 94.90, // Base display price
        cost: item.priceValue,
        quantity_required: 2,
        category: category
    };
});
