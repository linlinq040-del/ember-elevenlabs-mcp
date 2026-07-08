# SPEC.md

# Ember ElevenLabs MCP

**Version:** 1.0  
**Status:** Frozen

---

# 1. Objective

Build a production-ready Model Context Protocol (MCP) server for Ember AI.

This repository has exactly one responsibility:

> Convert text into speech using ElevenLabs and return a playable audio URL.

The philosophy is:

> **One Tool. Do It Well.**

---

# 2. Scope

The project only implements one MCP tool:

`tts_speak`

No additional MCP tools should be implemented unless explicitly requested.

Out of scope:

- Voice management
- Multiple TTS providers
- Dashboard
- User authentication
- Database
- Memory
- Calendar
- Search
- Image generation
- Analytics

---

# 3. Deployment Target

Primary target:

- Zeabur

Also compatible with any Node.js platform.

Transport:

- Streamable HTTP MCP

Endpoint:

`/mcp`

---

# 4. MCP Tool

Tool name:

`tts_speak`

Input:

```json
{
  "text":"Hello."
}
```

Output:

```json
{
  "success": true,
  "audio_url":"https://example.com/audio/xxxx.mp3",
  "duration":2.31
}
```

Never return binary audio.

Never return Base64.

---

# 5. ElevenLabs

Read configuration from environment variables.

Required:

- ELEVENLABS_API_KEY
- ELEVENLABS_VOICE_ID

Optional:

- ELEVENLABS_MODEL_ID (default: eleven_v3)

Voice is fixed.

No runtime voice switching.

---

# 6. Text Processing

Before sending text to ElevenLabs automatically:

- Remove Markdown
- Remove Emoji (configurable)
- Normalize whitespace
- Trim leading/trailing spaces

---

# 7. Long Text

Automatically split long text.

Generate audio for each chunk.

Merge all chunks into a single MP3.

Return only one audio URL.

---

# 8. Audio Storage

Directory:

public/audio

Generate UUID filenames.

Never overwrite existing files.

Serve through:

/audio/<filename>

---

# 9. Reliability

Implement:

- 10 second timeout
- Retry (max 3)
- Exponential backoff (1s / 2s / 4s)
- Circuit breaker

Retry only for:

- 429
- 500
- 502
- 503
- Timeout

Never retry:

- 400
- 401
- 403
- 404

Circuit breaker:

10 consecutive failures

↓

30 second cooldown

---

# 10. Logging

Write logs to:

logs/app.log

Include:

- timestamp
- request id
- character count
- duration
- success/failure
- error reason

---

# 11. Health Endpoint

GET /health

Returns:

```json
{
  "status":"ok"
}
```

---

# 12. Cleanup

Automatically delete audio files older than 7 days.

No cron dependency.

Cleanup runs inside the application lifecycle.

---

# 13. Configuration

Supported .env values:

- PORT
- PUBLIC_BASE_URL
- ELEVENLABS_API_KEY
- ELEVENLABS_VOICE_ID
- ELEVENLABS_MODEL_ID
- AUTO_REMOVE_MARKDOWN
- AUTO_REMOVE_EMOJI
- AUTO_SPLIT_TEXT
- AUTO_RETRY
- AUTO_CLEANUP_DAYS

---

# 14. Suggested Project Structure

```text
ember-elevenlabs-mcp
├── src
│   ├── index.ts
│   ├── config.ts
│   ├── elevenlabs.ts
│   ├── markdown.ts
│   ├── splitter.ts
│   ├── retry.ts
│   ├── logger.ts
│   └── cleanup.ts
├── public
│   └── audio
├── logs
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── SPEC.md
```

---

# 15. Coding Standards

- TypeScript strict mode
- Async/Await only
- No callback style
- No `any`
- Zod validation
- No TODO placeholders
- Clear error messages
- Modular architecture

---

# 16. Acceptance Criteria

A successful implementation must satisfy all of the following:

1. `npm install` succeeds.
2. `npm run build` succeeds.
3. Deploys successfully to Zeabur.
4. Ember connects through Streamable HTTP.
5. `tts_speak` generates speech.
6. Audio URL is publicly accessible.
7. Long text is automatically split and merged.
8. Timeout, retry and circuit breaker function correctly.
9. Health endpoint responds correctly.
10. Logs are written successfully.

---

# 17. Design Philosophy

- One Tool.
- Do It Well.
- Reliability over features.
- Configuration over complexity.
- Production over demo.
- Readability over cleverness.

End of specification.
