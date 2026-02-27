// CoinGecko API service for crypto data
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache for price data (simple in-memory cache)
const priceCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCryptoPrice(symbol) {
  const cacheKey = `price_${symbol}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📋 Using cached data for:', symbol);
    return cached.data;
  }

  try {
    console.log('🔍 Fetching price for:', symbol);

    // Use simple price endpoint - more reliable
    // First try to map common symbols to CoinGecko IDs
    const symbolToId = {
      btc: 'bitcoin',
      eth: 'ethereum',
      ada: 'cardano',
      bnb: 'binancecoin',
      sol: 'solana',
      matic: 'polygon-ecosystem-token',
      dot: 'polkadot',
      avax: 'avalanche-2',
      ltc: 'litecoin',
      atom: 'cosmos',
      link: 'chainlink',
      doge: 'dogecoin'
    };

    const coinId = symbolToId[symbol.toLowerCase()] || symbol.toLowerCase();
    console.log('🎯 Mapped', symbol, 'to coin ID:', coinId);

    const apiUrl = `${COINGECKO_BASE_URL}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
    console.log('🌐 Making API call to:', apiUrl);

    const priceResponse = await fetch(apiUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      }
    });
    console.log(
      '📡 API response status:',
      priceResponse.status,
      priceResponse.statusText
    );

    if (!priceResponse.ok) {
      console.error(
        '❌ Price API failed:',
        priceResponse.status,
        priceResponse.statusText
      );
      return null;
    }

    const priceData = await priceResponse.json();
    console.log('📊 Raw price data:', JSON.stringify(priceData));

    const coinData = priceData[coinId];

    if (!coinData) {
      console.log(
        '❌ No data found for coin ID:',
        coinId,
        '- Available keys:',
        Object.keys(priceData)
      );
      return null;
    }

    const result = {
      id: coinId,
      symbol: symbol.toUpperCase(),
      name: symbol.toUpperCase(), // Simple API doesn't provide name
      current_price: coinData.usd,
      price_change_percentage_24h: coinData.usd_24h_change || 0,
      market_cap: coinData.usd_market_cap,
      last_updated: new Date().toISOString()
    };

    console.log(
      '✅ Successfully processed data for:',
      symbol,
      '- Price: $' + result.current_price
    );

    // Cache the result
    priceCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('❌ Error fetching crypto price:', error.message);
    return null;
  }
}

export async function getTopCryptos(limit = 10) {
  const cacheKey = `top_${limit}`;
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📋 Using cached data for top cryptos, limit:', limit);
    return cached.data;
  }

  try {
    console.log('🔍 Fetching top cryptos from API, limit:', limit);

    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      console.error(
        '❌ Top cryptos API failed:',
        response.status,
        response.statusText
      );
      return [];
    }

    const data = await response.json();
    console.log('✅ Successfully fetched top cryptos:', data.length, 'results');

    // Cache the result
    priceCache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error('❌ Error fetching top cryptos:', error.message);
    return [];
  }
}
