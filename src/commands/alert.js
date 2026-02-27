export async function handleAlertCommand(text) {
  const args = text.trim().split(' ');
  const symbol = args[0]?.toUpperCase();
  const targetPrice = parseFloat(args[1]);

  // Validate input
  if (!symbol || isNaN(targetPrice) || targetPrice <= 0) {
    return {
      text: '❌ Invalid format. Use: `/alert SYMBOL PRICE`\nExample: `/alert BTC 50000`',
      response_type: 'ephemeral'
    };
  }

  try {
    // For now, we'll just acknowledge the alert
    // In production, this would store in MongoDB or Durable Objects
    const alertMessage = `✅ Alert set! I'll notify you when ${symbol} reaches $${targetPrice.toLocaleString()}.\n\n*Note: Automated alerts are coming soon. For now, use /price to check manually.*`;

    return {
      text: alertMessage,
      response_type: 'ephemeral'
    };
  } catch (error) {
    console.error('❌ Error setting alert:', error);
    return {
      text: '❌ Sorry, there was an error setting your alert. Please try again later.',
      response_type: 'ephemeral'
    };
  }
}
