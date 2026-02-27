// Simple test script to verify CoinGecko API integration
import { getCryptoPrice, getTopCryptos } from './src/services/coingecko.js';

async function testBot() {
  console.log('🧪 Testing Slack Crypto Bot...\n');

  // Test price lookup
  console.log('Testing /price BTC:');
  const btcPrice = await getCryptoPrice('BTC');
  if (btcPrice) {
    console.log(
      `✅ ${btcPrice.name} (${
        btcPrice.symbol
      }): $${btcPrice.current_price.toLocaleString()}`
    );
    console.log(
      `📈 24h Change: ${
        btcPrice.price_change_percentage_24h >= 0 ? '+' : ''
      }${btcPrice.price_change_percentage_24h.toFixed(2)}%`
    );
  } else {
    console.log('❌ Failed to fetch BTC price');
  }

  console.log('\nTesting /top 3:');
  const topCryptos = await getTopCryptos(3);
  if (topCryptos && topCryptos.length > 0) {
    console.log('✅ Top 3 Cryptocurrencies:');
    topCryptos.forEach((crypto, index) => {
      console.log(
        `  ${index + 1}. ${
          crypto.name
        } (${crypto.symbol.toUpperCase()}): $${crypto.current_price.toFixed(2)}`
      );
    });
  } else {
    console.log('❌ Failed to fetch top cryptocurrencies');
  }

  console.log('\n🎉 Test complete!');
}

// Run test
testBot().catch(console.error);
