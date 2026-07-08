# Ember ElevenLabs MCP

A production-ready **Model Context Protocol (MCP)** server for **Ember AI** that provides one thing only:

> **High-quality ElevenLabs Text-to-Speech**

## Philosophy

**One Tool. Do It Well.**

This repository intentionally contains only one MCP tool.

```
tts_speak
```

Everything else happens automatically.

---

# Features

- ✅ Streamable HTTP MCP
- ✅ Ember compatible
- ✅ ElevenLabs v3
- ✅ Fixed voice configuration
- ✅ Automatic Markdown cleanup
- ✅ Optional emoji removal
- ✅ Long text splitting
- ✅ Audio merging
- ✅ UUID filenames
- ✅ Public audio URLs
- ✅ Timeout
- ✅ Retry with exponential backoff
- ✅ Circuit breaker
- ✅ Structured logging
- ✅ Automatic cleanup
- ✅ Health endpoint

---

# Requirements

- Node.js 20+
- ElevenLabs API Key
- Zeabur account
- Ember with Streamable HTTP MCP support

---

# Installation

```bash
npm install
cp .env.example .env
npm run build
npm start
```

---

# Environment Variables

```
PORT=3000

PUBLIC_BASE_URL=https://your-domain

ELEVENLABS_API_KEY=

ELEVENLABS_VOICE_ID=

ELEVENLABS_MODEL_ID=eleven_v3

AUTO_REMOVE_MARKDOWN=true

AUTO_REMOVE_EMOJI=true

AUTO_SPLIT_TEXT=true

AUTO_RETRY=true

AUTO_CLEANUP_DAYS=7
```

---

# Deploy to Zeabur

1. Push repository to GitHub.
2. Import repository into Zeabur.
3. Configure environment variables.
4. Deploy.
5. Copy the public domain.

---

# Ember Configuration

Transport:

```
Streamable HTTP
```

Endpoint:

```
https://your-domain/mcp
```

Tool:

```
tts_speak
```

---

# Health Check

```
GET /health
```

Expected response

```json
{
  "status":"ok"
}
```

---

# Returned Response

```json
{
  "success": true,
  "audio_url": "https://your-domain/audio/uuid.mp3",
  "duration": 2.31
}
```

---

# Project Structure

```
src/
public/audio/
logs/

SPEC.md
AGENTS.md
ARCHITECTURE.md
STYLEGUIDE.md
```

---

# Roadmap

## v1.0

- Stable ElevenLabs MCP
- Zeabur deployment
- Ember integration

## v1.1

- Streaming synthesis (if supported)

## v1.2

- Audio cache

---

# License

MIT

---

Made for Ember ❤️
