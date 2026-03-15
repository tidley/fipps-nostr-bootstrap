import type { BootstrapEvent, HandshakeState } from './types.js';

export interface TransitionResult {
  state: HandshakeState;
  reason?: string;
}

export class BootstrapSession {
  private state: HandshakeState = 'IDLE';
  private readonly seen = new Set<string>();

  getState(): HandshakeState {
    return this.state;
  }

  apply(event: BootstrapEvent, now = Math.floor(Date.now() / 1000)): TransitionResult {
    const replayKey = `${event.sessionId}:${event.kind}:${event.fromNostrPubkey}:${event.createdAt}`;
    if (this.seen.has(replayKey)) return { state: 'FAILED', reason: 'replay-detected' };
    this.seen.add(replayKey);

    if (event.expiresAt < now) {
      this.state = 'FAILED';
      return { state: this.state, reason: 'expired-event' };
    }

    switch (this.state) {
      case 'IDLE':
        if (event.kind === 'fipps.bootstrap.init') {
          this.state = 'INIT_SENT';
          return { state: this.state };
        }
        break;
      case 'INIT_SENT':
        if (event.kind === 'fipps.bootstrap.ack') {
          this.state = 'ACK_RECEIVED';
          return { state: this.state };
        }
        break;
      case 'ACK_RECEIVED':
        if (event.kind === 'fipps.bootstrap.confirm') {
          this.state = 'SWITCHING';
          return { state: this.state };
        }
        break;
      case 'SWITCHING':
        this.state = 'ESTABLISHED';
        return { state: this.state };
      default:
        break;
    }

    this.state = 'FAILED';
    return { state: this.state, reason: 'invalid-transition' };
  }
}
