# STYLEGUIDE.md

# Coding Style Guide

## Purpose

This document defines mandatory coding standards for ember-elevenlabs-mcp.

The goal is long-term maintainability.

---

# Language

- TypeScript
- strict mode enabled
- ES Modules

---

# Naming

Files

- lower-case
- kebab-case where appropriate

Functions

- camelCase

Types

- PascalCase

Constants

- UPPER_SNAKE_CASE

---

# Function Design

Functions should:

- have one responsibility
- be short
- avoid side effects when possible

Avoid functions longer than ~80 lines.

---

# Validation

All external input must be validated.

Use Zod.

Never trust MCP input.

Never trust environment variables.

---

# Error Handling

Never swallow exceptions.

Bad

try {
}
catch {}

Good

- log
- map to structured error
- return readable message

---

# Logging

Use logger.ts only.

Never call console.log directly.

Levels:

- info
- warn
- error

Include request id whenever available.

---

# HTTP

Always set reasonable timeout.

Never perform infinite retries.

Always classify retryable vs non-retryable errors.

---

# File System

Always create directories if missing.

Never overwrite existing audio files.

Prefer UUID filenames.

---

# Dependencies

Prefer small, well-maintained libraries.

Avoid unnecessary packages.

Do not add a dependency unless it provides meaningful value.

---

# Comments

Explain WHY.

Avoid comments that simply repeat the code.

---

# TODO Policy

No TODO.

No FIXME.

No placeholder implementations.

---

# Formatting

Use Prettier-compatible formatting.

Consistent indentation.

One export per module whenever practical.

---

# Testing Expectations

Every major module should be independently testable.

Business logic should not depend on HTTP framework details.

---

# Performance

Correctness first.

Reliability second.

Performance third.

Do not optimize prematurely.

---

# Security

Never log API keys.

Never expose stack traces.

Never return internal implementation details.

Always read secrets from environment variables.

---

# Project Philosophy

Keep the repository intentionally small.

Every new feature should answer:

"Does this improve tts_speak?"

If not,

it probably does not belong in this repository.
