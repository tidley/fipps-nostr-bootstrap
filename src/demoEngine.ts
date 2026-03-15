import { BootstrapSession } from './stateMachine.js';
import type { BootstrapEvent, HandshakeState } from './types.js';
import { validateBootstrapEvent } from './validate.js';

export interface DemoStepResult {
  index: number;
  kind: BootstrapEvent['kind'];
  validationOk: boolean;
  transitionState: HandshakeState;
  reason?: string;
}

export interface DemoRunResult {
  finalState: HandshakeState;
  success: boolean;
  steps: DemoStepResult[];
}

export function runDemo(events: BootstrapEvent[], now: number): DemoRunResult {
  const session = new BootstrapSession();
  const steps: DemoStepResult[] = [];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const v = validateBootstrapEvent(e, now);
    if (!v.ok) {
      steps.push({
        index: i,
        kind: e.kind,
        validationOk: false,
        transitionState: 'FAILED',
        reason: v.reason,
      });
      return { finalState: 'FAILED', success: false, steps };
    }

    const t = session.apply(e, now);
    steps.push({
      index: i,
      kind: e.kind,
      validationOk: true,
      transitionState: t.state,
      reason: t.reason,
    });

    if (t.state === 'FAILED') {
      return { finalState: 'FAILED', success: false, steps };
    }
  }

  const finalState = session.getState();
  return { finalState, success: finalState === 'ESTABLISHED', steps };
}
