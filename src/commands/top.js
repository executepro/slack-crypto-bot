import { getTopCryptos } from '../services/coingecko.js';

export async function handleTopCommand(limitText) {
  const limit = parseInt(limitText.trim()) || 10;

  // Validate limit
  if (limit < 1 || limit > 100) {
    return {
      text: 'Please specify a limit between 1 and 100. Example: `/top 5`',
      response_type: 'ephemeral'
    };
  }

  try {
    const topCryptos = await getTopCryptos(limit);

    if (!topCryptos || topCryptos.length === 0) {
      return {
        text: '❌ Could not fetch top cryptocurrencies. Please try again later.',
        response_type: 'ephemeral'
      };
    }

    // Create table format
    let tableText =
      '```\nRank | Symbol | Name                | Price       | 24h Change\n';
    tableText +=
      '-----|--------|---------------------|-------------|-----------\n';

    topCryptos.forEach((crypto, index) => {
      const rank = (index + 1).toString().padStart(2);
      const symbol = crypto.symbol.toUpperCase().padEnd(6);
      const name = crypto.name.substring(0, 20).padEnd(20);
      const price = `$${crypto.current_price.toFixed(2).padStart(10)}`;
      const change = `${
        crypto.price_change_percentage_24h >= 0 ? '+' : ''
      }${crypto.price_change_percentage_24h.toFixed(2)}%`.padStart(10);

      tableText += `${rank}  | ${symbol} | ${name} | ${price} | ${change}\n`;
    });

    tableText += '```';

    const message = {
      text: `Top ${limit} Cryptocurrencies by Market Cap`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🏆 Top ${limit} Cryptocurrencies`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: tableText
          }
        }
      ]
    };

    return message;
  } catch (error) {
    console.error('❌ Error fetching top cryptos:', error);
    return {
      text: '❌ Sorry, there was an error fetching the cryptocurrency data. Please try again later.',
      response_type: 'ephemeral'
    };
  }
}
