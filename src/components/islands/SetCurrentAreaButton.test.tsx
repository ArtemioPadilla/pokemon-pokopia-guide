// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const memory = new Map<string, unknown>();

vi.mock('idb-keyval', () => ({
  get: vi.fn((key: string) => Promise.resolve(memory.get(key))),
  set: vi.fn((key: string, value: unknown) => {
    memory.set(key, value);
    return Promise.resolve();
  }),
  del: vi.fn((key: string) => {
    memory.delete(key);
    return Promise.resolve();
  }),
}));

describe('SetCurrentAreaButton', () => {
  beforeEach(() => {
    memory.clear();
    vi.resetModules();
  });

  it('shows the "set as current" label when not the current area', async () => {
    const { default: SetCurrentAreaButton } = await import('./SetCurrentAreaButton');
    render(
      <SetCurrentAreaButton
        areaId="bleak-beach"
        label="Set as current"
        currentLabel="Current area"
      />,
    );
    expect(screen.getByRole('button', { name: 'Set as current' })).toBeInTheDocument();
  });

  it('switches to the "current" label and becomes aria-disabled after a click', async () => {
    const user = userEvent.setup();
    const { default: SetCurrentAreaButton } = await import('./SetCurrentAreaButton');
    render(
      <SetCurrentAreaButton
        areaId="bleak-beach"
        label="Set as current"
        currentLabel="Current area"
      />,
    );

    const btn = screen.getByRole('button', { name: 'Set as current' });
    await user.click(btn);

    const current = await screen.findByRole('button', { name: 'Current area' });
    expect(current).toHaveAttribute('aria-disabled', 'true');
  });
});
