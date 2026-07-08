# ARCHITECTURE.md

# Ember ElevenLabs MCP Architecture

## High-Level Flow

```
Ember
   │
   ▼
Streamable HTTP MCP (/mcp)
   │
   ▼
tts_speak
   │
   ▼
Text Preprocessing
(Markdown → Emoji → Whitespace)
   │
   ▼
Text Splitter
(if needed)
   │
   ▼
Retry + Timeout + Circuit Breaker
   │
   ▼
ElevenLabs API
   │
   ▼
Merge Audio (if multiple chunks)
   │
   ▼
Save MP3
(public/audio)
   │
   ▼
Return audio_url
```

---

# Directory Layout

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
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
├── SPEC.md
└── AGENTS.md
```

---

# Module Responsibilities

## index.ts

Application entry point.

Responsibilities:

- Start HTTP server
- Register Streamable HTTP MCP endpoint
- Register `tts_speak`
- Serve `/audio/*`
- Serve `/health`

No business logic.

---

## config.ts

Read and validate environment variables.

Use Zod.

Export a typed configuration object.

No network requests.

---

## markdown.ts

Clean incoming text.

Must:

- remove markdown
- optionally remove emoji
- normalize whitespace
- trim

Pure functions only.

---

## splitter.ts

Detect oversized requests.

Split at sentence boundaries whenever possible.

Avoid breaking words unnecessarily.

Return ordered chunks.

---

## retry.ts

Provide reusable retry wrapper.

Features:

- timeout
- exponential backoff
- retry policy
- circuit breaker

No ElevenLabs-specific code.

---

## elevenlabs.ts

Encapsulate all ElevenLabs communication.

Responsibilities:

- create requests
- send requests
- receive audio
- map API errors
- never expose raw HTTP details

---

## logger.ts

Structured logging.

Support:

- info
- warn
- error

Never use console.log directly outside logger.

---

## cleanup.ts

Delete expired audio files.

Run on application startup and at a regular in-process interval.

No external scheduler required.

---

# Design Rules

- Keep modules focused.
- Prefer composition over large files.
- Avoid circular dependencies.
- Business logic must not live in index.ts.

---

# Request Lifecycle

1. Receive MCP request.
2. Validate input.
3. Clean text.
4. Split if necessary.
5. Call ElevenLabs.
6. Merge audio if needed.
7. Save file.
8. Log request.
9. Return URL.

---

# Extensibility

Future enhancements should improve the existing `tts_speak` workflow.

Do not introduce additional MCP tools unless explicitly approved.

Examples of acceptable future work:

- streaming synthesis
- audio caching
- SSML support
- performance improvements

