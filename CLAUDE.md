# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Twilio TUI — a terminal user interface for managing Twilio services (SMS, calls, phone numbers, debugging). Built with TypeScript on the Bun runtime using [OpenTUI](https://opentui.com/docs/getting-started/) for the terminal UI layer. Interacts with Twilio via the Twilio CLI (`twilio` commands).

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **UI Framework**: OpenTUI (terminal UI components: Select, Input, Textarea, ScrollBox, Text, Box, TabSelect)
- **Backend**: Twilio CLI executed as child processes, parsing JSON output

## Build & Development Commands

```bash
bun install          # Install dependencies
bun run dev          # Start development
bun run build        # Build for production
bun test             # Run all tests
bun test <file>      # Run a single test file
```

## Architecture

The app is structured as a **tabbed interface** (using OpenTUI's `TabSelect`) with feature modules:

1. **SMS Dashboard & Composer** (MVP) — split-pane: message list (left) + compose area (right)
2. **Call Monitor & Dialer** — call history table + outbound dialing
3. **Phone Number Manager** — browse, configure, search, and purchase numbers
4. **Debugger / Log Tail** — live error log viewer with severity coloring
5. **Account Switcher** — profile management, balance, usage overview

### CLI Integration Pattern

All Twilio data flows through the `twilio` CLI. Commands are executed as child processes and responses are parsed as JSON. Key command families:
- `twilio api core messages list/create` — messaging
- `twilio api core calls list/create` — calls
- `twilio phone-numbers list/update` — number management
- `twilio debugger logs list` — error logs
- `twilio profiles list` — account profiles

## Reference

- OpenTUI docs: https://opentui.com/docs/getting-started/
- Planning doc with feature details and CLI command mappings: `plan/ideas.md`
