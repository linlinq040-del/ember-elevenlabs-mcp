# AGENTS.md

# AI Agent Instructions for ember-elevenlabs-mcp

## Mission

You are contributing to **ember-elevenlabs-mcp**.

This repository exists for one purpose only:

> Build a production-ready ElevenLabs Text-to-Speech MCP server for Ember.

Do not broaden the scope.

---

# Core Principles

1. One Tool. Do It Well.
2. Reliability over Features.
3. Configuration over Complexity.
4. Production over Demo.
5. Readability over Cleverness.

---

# MCP Rules

- Use the latest official @modelcontextprotocol/sdk.
- Use Streamable HTTP transport.
- Endpoint must be `/mcp`.
- Do not use stdio.
- Remain compatible with Ember.

---

# MCP Tool Policy

Exactly ONE tool is allowed.

Tool name:

tts_speak

Do not create:

- listVoices
- setVoice
- getVoice
- dashboard
- settings
- profile
- emotion
- memory
- search
- calendar

unless explicitly requested by the repository owner.

---

# ElevenLabs Rules

Voice is fixed.

Read only from environment variables:

ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID
ELEVENLABS_MODEL_ID

Default model:

eleven_v3

Never hardcode secrets.

---

# Text Processing

Before synthesis always:

- remove Markdown
- optionally remove Emoji
- normalize whitespace
- trim text

If text exceeds provider limits:

split → synthesize → merge → return one MP3.

---

# Reliability

Implement:

- timeout (10s)
- retry (max 3)
- exponential backoff
- circuit breaker
- structured logging

Retry only for transient failures.

Never retry invalid credentials.

---

# File Structure

Keep modules small.

Recommended:

src/
    index.ts
    config.ts
    elevenlabs.ts
    markdown.ts
    splitter.ts
    retry.ts
    logger.ts
    cleanup.ts

Avoid unnecessary nesting.

---

# Coding Standards

- TypeScript strict mode
- Async/Await only
- No callback style
- No `any`
- Use Zod for validation
- No placeholder implementations
- No TODO comments
- No dead code

---

# Error Handling

Return structured errors.

Never expose stack traces.

Preferred format:

{
  "success": false,
  "code": "...",
  "message": "..."
}

---

# Logging

Every request should record:

- timestamp
- request id
- duration
- character count
- status
- failure reason (if any)

---

# Cleanup

Delete generated audio older than the configured retention period.

Implementation must not rely on cron.

---

# Pull Request Expectations

Every code change should:

- compile successfully
- preserve compatibility
- keep the single-tool philosophy
- avoid unnecessary dependencies

---

# Non Goals

Do NOT transform this repository into:

- a chatbot
- a memory service
- a dashboard
- a multi-provider TTS framework

---

# Final Rule

Whenever a design choice is unclear, prefer the simpler implementation that
keeps the repository focused on reliable ElevenLabs TTS for Ember.
