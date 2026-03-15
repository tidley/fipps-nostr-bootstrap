# FIPPS Nostr Bootstrap

Nostr is used as a **bootstrap/signalling layer only** for FIPPS peers.

- Use relays for discovery, rendezvous, and signed handshake setup material.
- Switch to direct/chosen FIPPS transport immediately after session derivation.
- Keep bulk app traffic off relays.

## What this repo contains

- `spec/bootstrap-v0.1.md` — concrete protocol design (kinds/tags, state machine, retry/replay, key lifecycle)
- `src/` — minimal reference skeleton for bootstrap message validation + handshake state flow

## Repo goals

1. Make bootstrap interoperability explicit.
2. Keep trust/security in FIPPS, not relay behavior.
3. Support offline/asynchronous rendezvous with signed Nostr events.

## Quick start

```bash
npm install
npm run build
```
