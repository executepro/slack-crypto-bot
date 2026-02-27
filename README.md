# Slack Crypto Price Bot

A Slack bot that provides real-time cryptocurrency price information and alerts.

## Features

- **/price [SYMBOL]**: Get current price, 24h change, and market cap for any cryptocurrency
- **/top [LIMIT]**: Show top cryptocurrencies by market cap (default: 10)
- **/alert [SYMBOL] [PRICE]**: Set price alerts (coming soon with automated notifications)

## Example Usage

```
/price BTC
/top 5
/alert ETH 3000
```

## Technology Stack

- **Framework**: Slack Bolt for JavaScript
- **Runtime**: Cloudflare Workers
- **API**: CoinGecko free API
- **Data**: In-memory caching (5-minute TTL)

## URLs & Dashboard Access

### **Slack App Dashboard**

- **URL**: https://api.slack.com/apps/A0AHBU62VPU
- **App Name**: Execute Pro Crypto Bot
- **App ID**: A0AHBU62VPU

### **Cloudflare Worker**

- **Worker URL**: https://bot.executepro.net
- **Worker Name**: crypto-bot
- **Dashboard**: https://dash.cloudflare.com/workers

### **Portfolio & Website**

- **Main Site**: https://executepro.net
- **Bot Demo**: https://executepro.net/bot-demo.html
- **GitHub**: https://github.com/executepro/slack-crypto-bot

## Installation

### For Users (Invite-Only)

This bot is currently invite-only. To get access:

1. Email `executepro@proton.me` with "Slack crypto bot access request"
2. Receive an invite token
3. Use the token to install the bot to your Slack workspace

### For Developers (Self-Hosting)

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up your Slack app at https://api.slack.com/apps
4. Configure environment variables in `wrangler.toml`
5. Deploy: `npm run deploy`

## Development

```bash
# Install dependencies
npm install

# Run locally (set secrets first)
export SLACK_BOT_TOKEN="xoxb-your-bot-token"
export SLACK_SIGNING_SECRET="your-signing-secret"
npm run dev

# Deploy to Cloudflare Workers (interactive secret setup)
npm run deploy-with-secrets

# Or deploy manually:
wrangler secret put SLACK_BOT_TOKEN
wrangler secret put SLACK_SIGNING_SECRET
wrangler deploy
```

## Security Notes

**Secrets are NOT stored in code** - they are set as Cloudflare Worker secrets during deployment:

- `SLACK_BOT_TOKEN`: Your Slack bot token (starts with `xoxb-`)
- `SLACK_SIGNING_SECRET`: Slack signing secret for request verification

Never commit secrets to version control!

## Deployment Checklist

- [x] Slack app created and configured
- [x] Bot token and signing secret set as Cloudflare secrets
- [x] Worker deployed to `bot.executepro.net`
- [x] DNS CNAME record: `bot.executepro.net` → Cloudflare Workers
- [x] Slack command URLs updated to `https://bot.executepro.net/slack/commands`
- [x] Portfolio website updated with bot showcase
- [x] Invite system ready for user access

## License

This project is part of the Execute Pro portfolio. Contact for licensing inquiries.
