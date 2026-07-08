# IMPLEMENTATION_PLAN.md

# Ember ElevenLabs MCP
Implementation Plan v1.0

This document describes the recommended implementation order.

The objective is to keep the repository compiling after every phase.

---

# Phase 0

Repository initialization

Create

- package.json
- tsconfig.json
- .gitignore
- .env.example
- README.md

Verification

- npm install
- npm run build

must succeed.

---

# Phase 1

Configuration

Implement

src/config.ts

Responsibilities

- load environment variables
- validate with Zod
- export typed configuration

Verification

Application starts successfully.

---

# Phase 2

Logger

Implement

src/logger.ts

Support

- info
- warn
- error

Every log should contain timestamp.

Verification

Logger outputs structured messages.

---

# Phase 3

Markdown Cleaner

Implement

src/markdown.ts

Support

- remove markdown
- remove emoji (optional)
- normalize whitespace
- trim

Verification

Input text becomes clean plain text.

---

# Phase 4

Retry Infrastructure

Implement

src/retry.ts

Support

- timeout
- retry
- exponential backoff
- circuit breaker

Verification

Retry policy works independently of ElevenLabs.

---

# Phase 5

ElevenLabs Client

Implement

src/elevenlabs.ts

Support

- authentication
- synthesis request
- error mapping
- save audio

Verification

One sentence successfully generates one mp3.

---

# Phase 6

Long Text Splitter

Implement

src/splitter.ts

Support

- sentence-aware splitting
- configurable chunk size

Verification

Large text generates multiple chunks.

---

# Phase 7

Audio Merge

Merge multiple synthesized chunks into one final MP3.

Verification

Caller receives only one audio URL.

---

# Phase 8

Cleanup Service

Implement

src/cleanup.ts

Delete files older than configured retention period.

Verification

Expired audio is removed.

---

# Phase 9

HTTP Server

Implement

src/index.ts

Responsibilities

- Streamable HTTP MCP
- register tts_speak
- serve /audio/*
- serve /health

Verification

Server starts.

---

# Phase 10

MCP Tool

Register

tts_speak

Workflow

validate
↓

clean
↓

split
↓

retry
↓

ElevenLabs
↓

merge
↓

save
↓

return URL

Verification

Ember successfully invokes the tool.

---

# Phase 11

Integration Testing

Verify

- npm run build
- local execution
- Zeabur deployment
- Ember connection
- audio playback

---

# Phase 12

Release Checklist

Before release

- no TODO
- no FIXME
- no placeholder code
- strict mode passes
- README complete
- environment variables documented
- logs working
- health endpoint working

---

# Definition of Done

The implementation is complete only if:

✓ npm install succeeds

✓ npm run build succeeds

✓ Zeabur deployment succeeds

✓ Ember connects successfully

✓ tts_speak returns a playable audio URL

✓ Logging works

✓ Retry works

✓ Circuit breaker works

✓ Cleanup works

✓ Health endpoint works

End of implementation plan.
