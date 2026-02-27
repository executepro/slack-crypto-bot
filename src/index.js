// Slack Crypto Bot for Cloudflare Workers
// Simplified version without full Bolt framework due to CF Workers compatibility

// Secrets will be provided via environment variables

// Import services
import { getCryptoPrice, getTopCryptos } from './services/coingecko.js';

// Verify Slack request signature
function verifySlackSignature(request, body) {
  // Simplified verification - in production should properly verify
  return true;
}

// Handle slash commands
async function handleSlashCommand(command, text, env) {
  const cmd = command.replace('/', '');

  switch (cmd) {
    case 'price':
      return await handlePriceCommand(text);
    case 'top':
      return await handleTopCommand(text);
    case 'alert':
      return await handleAlertCommand(text, env);
    default:
      return {
        text: `Unknown command: ${command}`,
        response_type: 'ephemeral'
      };
  }
}

async function handlePriceCommand(symbol) {
  if (!symbol) {
    return {
      text: 'Please specify a cryptocurrency symbol. Example: `/price BTC`',
      response_type: 'ephemeral'
    };
  }

  try {
    const priceData = await getCryptoPrice(symbol.toUpperCase());

    if (!priceData) {
      return {
        text: `❌ Could not find price data for ${symbol}. Please check the symbol and try again.`,
        response_type: 'ephemeral'
      };
    }

    const { name, current_price, price_change_percentage_24h, market_cap } =
      priceData;
    const changeEmoji = price_change_percentage_24h >= 0 ? '📈' : '📉';
    const changeText = `${changeEmoji} ${
      price_change_percentage_24h >= 0 ? '+' : ''
    }${price_change_percentage_24h.toFixed(2)}%`;
    const marketCapText = market_cap
      ? `$${market_cap.toLocaleString()}`
      : 'N/A';

    return {
      text: `${name} (${symbol.toUpperCase()}) Price`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${name} (${symbol.toUpperCase()})`
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
  } catch (error) {
    console.error('Error fetching price:', error);
    return {
      text: '❌ Sorry, there was an error fetching the price data. Please try again later.',
      response_type: 'ephemeral'
    };
  }
}

async function handleTopCommand(limit) {
  const numLimit = parseInt(limit) || 10;

  if (numLimit < 1 || numLimit > 100) {
    return {
      text: 'Please specify a limit between 1 and 100. Example: `/top 5`',
      response_type: 'ephemeral'
    };
  }

  try {
    const topCryptos = await getTopCryptos(numLimit);

    if (!topCryptos || topCryptos.length === 0) {
      return {
        text: '❌ Could not fetch top cryptocurrencies. Please try again later.',
        response_type: 'ephemeral'
      };
    }

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

    return {
      text: `Top ${numLimit} Cryptocurrencies by Market Cap`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🏆 Top ${numLimit} Cryptocurrencies`
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
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return {
      text: '❌ Sorry, there was an error fetching the cryptocurrency data. Please try again later.',
      response_type: 'ephemeral'
    };
  }
}

async function handleAlertCommand(text, env) {
  // TODO: Implement alert storage using MongoDB or Durable Objects
  // For now, just acknowledge
  return {
    text: `✅ Alert functionality coming soon! For now, use /price to check manually.`,
    response_type: 'ephemeral'
  };
}

// Main fetch handler
export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Slack sends form-encoded data for slash commands
      const body = await request.text();
      const params = new URLSearchParams(body);

      const command = params.get('command');
      const text = params.get('text') || '';

      console.log('🚀 Received command:', command, 'with text:', text);

      // Basic validation
      if (!command) {
        console.error('No command received');
        return new Response(
          JSON.stringify({
            text: 'Invalid request - no command',
            response_type: 'ephemeral'
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('⚡ Processing command:', command, 'with text:', text);
      const response = await handleSlashCommand(command, text, env);
      console.log('✅ Sending response:', JSON.stringify(response));

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error handling request:', error);
      return new Response(
        JSON.stringify({
          text: `Internal server error: ${error.message}`,
          response_type: 'ephemeral'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};
