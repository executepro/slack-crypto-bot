import { getCryptoPrice } from '../services/coingecko.js';

export async function handlePriceCommand(symbol) {
  symbol = symbol.trim().toUpperCase();

  if (!symbol) {
    return {
      text: 'Please specify a cryptocurrency symbol. Example: `/price BTC`',
      response_type: 'ephemeral'
    };
  }

  try {
    console.log('🔍 Fetching price for:', symbol);
    const priceData = await getCryptoPrice(symbol);
    console.log('📊 Price data received:', !!priceData);

    if (!priceData) {
      return {
        text: `❌ Could not find price data for ${symbol}. Please check the symbol and try again.`,
        response_type: 'ephemeral'
      };
    }

    const { name, current_price, price_change_percentage_24h, market_cap } =
      priceData;

    // Format price change with emoji
    const changeEmoji = price_change_percentage_24h >= 0 ? '📈' : '📉';
    const changeText = `${changeEmoji} ${
      price_change_percentage_24h >= 0 ? '+' : ''
    }${price_change_percentage_24h.toFixed(2)}%`;

    // Format market cap
    const marketCapText = market_cap
      ? `$${market_cap.toLocaleString()}`
      : 'N/A';

    const message = {
      text: `${name} (${symbol}) Price`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${name} (${symbol})`
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Current Price*\n$${current_price.toLocaleString()}`
            },
            {
              type: 'mrkdwn',
              text: `*24h Change*\n${changeText}`
            },
            {
              type: 'mrkdwn',
              text: `*Market Cap*\n${marketCapText}`
            }
          ]
        }
      ]
    };

    return message;
  } catch (error) {
    console.error('❌ Error fetching price:', error);
    return {
      text: '❌ Sorry, there was an error fetching the price data. Please try again later.',
      response_type: 'ephemeral'
    };
  }
}
