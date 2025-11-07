# OpenRouter AI Integration

This project now uses OpenRouter API instead of Google Gemini for the AI chatbot.

## 🔑 Getting Your OpenRouter API Key

1. Visit: https://openrouter.ai/
2. Sign up or log in
3. Go to **Keys**: https://openrouter.ai/keys
4. Click **Create Key**
5. Copy your API key (starts with `sk-or-v1-...`)

## ⚙️ Configuration

### Local Development

Add to `.env.local`:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

### Production (Vercel)

Add environment variables in Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - `OPENROUTER_API_KEY`: Your OpenRouter key
   - `NEXT_PUBLIC_SITE_URL`: Your production URL (e.g., `https://flashfits.vercel.app`)

## 🤖 Available Models

The chatbot currently uses: `google/gemini-2.0-flash-exp:free`

### Other Free Models You Can Try:

```javascript
// In app/api/ai-chat/route.ts, change the model parameter:

// Google Gemini (Free)
model: "google/gemini-2.0-flash-exp:free";

// Meta Llama (Free)
model: "meta-llama/llama-3.2-3b-instruct:free";

// Microsoft Phi (Free)
model: "microsoft/phi-3-mini-128k-instruct:free";

// Mistral (Free)
model: "mistralai/mistral-7b-instruct:free";
```

### Paid Models (Better Quality):

```javascript
// GPT-4o (Most capable)
model: "openai/gpt-4o";

// Claude 3.5 Sonnet (Excellent for creative tasks)
model: "anthropic/claude-3.5-sonnet";

// GPT-4 Turbo
model: "openai/gpt-4-turbo";
```

## 💰 Pricing

- **Free models**: $0 (with usage limits)
- **Paid models**: Pay-per-token (very affordable)
- Check current pricing: https://openrouter.ai/models

## 🔧 Customization

### Change Model

Edit `app/api/ai-chat/route.ts`:

```typescript
body: JSON.stringify({
  model: 'your-preferred-model', // Change this
  messages: [...],
  temperature: 0.7, // Creativity (0-1)
  max_tokens: 1000  // Response length
})
```

### Adjust Temperature

- `0.0` - Very focused and deterministic
- `0.7` - Balanced (default)
- `1.0` - Very creative and random

### Adjust Max Tokens

- `500` - Short responses
- `1000` - Medium responses (default)
- `2000` - Long, detailed responses

## 📊 Features

✅ No vendor lock-in (switch models anytime)
✅ Access to 100+ AI models
✅ Free tier available
✅ Pay only for what you use
✅ Automatic fallback to other models if one fails
✅ Built-in rate limiting and error handling

## 🐛 Troubleshooting

### "OpenRouter API key not configured"

- Make sure `OPENROUTER_API_KEY` is set in `.env.local`
- Restart your dev server after adding the key

### "Failed to get AI response"

- Check your API key is valid
- Check you have credits (for paid models)
- Try switching to a free model

### Rate Limit Errors

- Free models have usage limits
- Upgrade to paid models for unlimited usage
- Check your usage: https://openrouter.ai/activity

## 🔗 Resources

- OpenRouter Dashboard: https://openrouter.ai/
- Model Pricing: https://openrouter.ai/models
- API Documentation: https://openrouter.ai/docs
- Activity/Usage: https://openrouter.ai/activity

## 🎯 Benefits Over Gemini

1. **Multiple Models**: Switch between GPT-4, Claude, Llama, etc.
2. **Cost Effective**: Pay only for what you use
3. **No Quotas**: No daily/monthly limits (with paid models)
4. **Reliability**: Automatic failover if a model is down
5. **Flexibility**: Easy to A/B test different models
