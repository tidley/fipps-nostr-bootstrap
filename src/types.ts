export type BootstrapKind =
  | 'fipps.bootstrap.init'
  | 'fipps.bootstrap.ack'
  | 'fipps.bootstrap.confirm'
  | 'fipps.bootstrap.fail';

export type HandshakeState =
  | 'IDLE'
  | 'INIT_SENT'
  | 'ACK_RECEIVED'
  | 'CONFIRM_SENT'
  | 'SWITCHING'
  | 'ESTABLISHED'
  | 'FAILED';

export interface BootstrapEvent {
  kind: BootstrapKind;
  sessionId: string;
  fromNostrPubkey: string;
  toNostrPubkey?: string;
  fromFippsIdentity: string;
  ephemeralPubkey?: string;
  expiresAt: number;
  createdAt: number;
  payload: Record<string, unknown>;
  sig: string;
}
