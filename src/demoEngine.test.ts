import { describe, expect, it } from 'vitest';

import { runDemo } from './demoEngine.js';
import type { BootstrapEvent } from './types.js';

function ev(kind: BootstrapEvent['kind'], createdAt: number): BootstrapEvent {
  return {
    kind,
    sessionId: 's1',
    fromNostrPubkey: 'npub_x',
    fromFippsIdentity: 'fips_x',
    ephemeralPubkey: kind === 'fipps.bootstrap.confirm' ? undefined : 'epk',
    expiresAt: 1000,
    createdAt,
    payload: {},
    sig: 'sig',
  };
}

describe('runDemo', () => {
  it('returns success for established flow', () => {
    const r = runDemo(
      [
        ev('fipps.bootstrap.init', 1),
        ev('fipps.bootstrap.ack', 2),
        ev('fipps.bootstrap.confirm', 3),
        ev('fipps.bootstrap.confirm', 4),
      ],
      10,
    );
    expect(r.success).toBe(true);
    expect(r.finalState).toBe('ESTABLISHED');
  });

  it('fails fast on validation error', () => {
    const bad = ev('fipps.bootstrap.init', 1);
    bad.sig = '';
    const r = runDemo([bad], 10);
    expect(r.success).toBe(false);
    expect(r.finalState).toBe('FAILED');
    expect(r.steps[0].reason).toBe('missing-signature');
  });

  it('fails on transition failure', () => {
    const r = runDemo([ev('fipps.bootstrap.ack', 1)], 10);
    expect(r.success).toBe(false);
    expect(r.finalState).toBe('FAILED');
  });
});
