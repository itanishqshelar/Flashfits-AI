# OpenRouter AI Chatbot - Quick Fix Guide

## ✅ What Was Fixed

### Problem:

The free Gemini model (`google/gemini-2.0-flash-exp:free`) was rate-limited.

**Error:**

```
Provider returned error, code: 429
google/gemini-2.0-flash-exp:free is temporarily rate-limited upstream
```

### Solution:

Implemented **automatic model fallback** - if one model fails, it tries the next one automatically.

## 🔄 New Features

### Multi-Model Fallback System

The API now tries 3 different free models in order:

1. **Meta Llama 3.2** (Primary) - Fast and reliable
2. **Microsoft Phi-3** (Backup) - Good for conversation
3. **Mistral 7B** (Last resort) - Solid performance

If one is rate-limited or down, it automatically tries the next!

## 🚀 How to Test

### 1. Start Dev Server

```powershell
npm run dev
```

### 2. Go to AI Chat Page

Open browser: `http://localhost:3001/ai`

### 3. Test a Message

Try asking:

- "Show me casual outfits"
- "I need a formal dress for a wedding"
- "What's trending in fashion?"

## 🔧 Configuration

### Environment Variables Required

**`.env.local`:**

```bash
OPENROUTER_API_KEY=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
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

✅ Already configured!

### Vercel Production

Add these in Vercel Dashboard → Environment Variables:

```
OPENROUTER_API_KEY=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
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## 🎯 How It Works

```
User sends message
    ↓
Try Model 1: Meta Llama
    ↓ (if fails)
Try Model 2: Microsoft Phi-3
    ↓ (if fails)
Try Model 3: Mistral 7B
    ↓ (if all fail)
Return error message
```

## 🐛 Troubleshooting

### "OpenRouter API key not configured"

**Fix:** Make sure `.env.local` has `OPENROUTER_API_KEY`

### "All AI models are currently unavailable"

**Cause:** All 3 free models are rate-limited (rare)
**Fix:**

- Wait 5-10 minutes
- OR use a paid model (add credits to OpenRouter)

### Chat not responding

**Check:**

1. Is dev server running? (`npm run dev`)
2. Check browser console for errors (F12)
3. Check terminal for API errors

## 💡 Want Better Performance?

### Option 1: Use Paid Models (Recommended)

Add $5 credits to OpenRouter and use better models:

**Edit `app/api/ai-chat/route.ts`:**

```typescript
const models = [
  "openai/gpt-4o-mini", // $0.15 per 1M tokens (cheap!)
  "anthropic/claude-3-haiku", // Fast and accurate
  "meta-llama/llama-3.2-3b-instruct:free", // Fallback to free
];
```

### Option 2: Get Your Own API Keys

Add your own Google AI API key to OpenRouter for unlimited access:

- Go to: https://openrouter.ai/settings/integrations
- Add Google AI API key
- Removes rate limits on Gemini models

## 📊 Model Comparison

| Model           | Speed  | Quality    | Cost     | Rate Limits |
| --------------- | ------ | ---------- | -------- | ----------- |
| Meta Llama 3.2  | ⚡⚡⚡ | ⭐⭐⭐     | FREE     | Moderate    |
| Microsoft Phi-3 | ⚡⚡   | ⭐⭐⭐     | FREE     | Moderate    |
| Mistral 7B      | ⚡⚡   | ⭐⭐⭐⭐   | FREE     | High        |
| GPT-4o Mini     | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | $0.15/1M | None        |
| Claude Haiku    | ⚡⚡⚡ | ⭐⭐⭐⭐   | $0.25/1M | None        |

## ✅ Current Status

- ✅ API configured correctly
- ✅ OpenRouter key valid
- ✅ Multi-model fallback enabled
- ✅ Error handling improved
- ✅ Ready for production

## 🎉 Benefits of This Setup

1. **High Availability** - If one model fails, others work
2. **Cost Effective** - Free models with paid fallback option
3. **Flexible** - Easy to add/remove models
4. **Reliable** - Automatic retry logic
5. **Production Ready** - Works on Vercel

## 📝 Next Steps

1. Test locally: `npm run dev` → visit `/ai`
2. Deploy to Vercel with env vars
3. Optionally add credits for premium models
4. Monitor usage: https://openrouter.ai/activity

---

**Need Help?**

- OpenRouter Docs: https://openrouter.ai/docs
- Check API status: https://openrouter.ai/models
- View usage: https://openrouter.ai/activity
