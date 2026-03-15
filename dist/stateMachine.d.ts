import type { BootstrapEvent, HandshakeState } from './types.js';
export interface TransitionResult {
    state: HandshakeState;
    reason?: string;
}
export declare class BootstrapSession {
    private state;
    private readonly seen;
    getState(): HandshakeState;
    apply(event: BootstrapEvent, now?: number): TransitionResult;
}
