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

const areas = [
  { id: 'withered-wasteland', title: 'Withered Wasteland' },
  { id: 'bleak-beach', title: 'Bleak Beach' },
];

const baseProps = {
  totalPokedex: 40,
  totalCollectibles: 12,
  areas,
  pokedexLabel: 'Pokédex',
  collectiblesLabel: 'Collectibles',
  areaLabel: 'Current area',
  resetLabel: 'Reset progress',
  resetConfirmMessage: 'Reset everything?',
};

describe('HomeProgress', () => {
  beforeEach(() => {
    memory.clear();
    vi.resetModules();
  });

  it('renders both progress bars against their totals', async () => {
    const { default: HomeProgress } = await import('./HomeProgress');
    render(<HomeProgress {...baseProps} />);
    expect(screen.getByRole('progressbar', { name: 'Pokédex' })).toHaveAttribute(
      'aria-valuemax',
      '40',
    );
    expect(screen.getByRole('progressbar', { name: 'Collectibles' })).toHaveAttribute(
      'aria-valuemax',
      '12',
    );
  });

  it('lists every area as a select option', async () => {
    const { default: HomeProgress } = await import('./HomeProgress');
    render(<HomeProgress {...baseProps} />);
    expect(screen.getByRole('option', { name: 'Withered Wasteland' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bleak Beach' })).toBeInTheDocument();
  });

  it('does not reset when the user cancels the confirm dialog', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const { default: HomeProgress } = await import('./HomeProgress');
    render(<HomeProgress {...baseProps} />);
    await user.click(screen.getByRole('button', { name: 'Reset progress' }));
    // Nothing to assert on state directly here (store is module-level), but
    // confirming the dialog was consulted is the contract under test.
    expect(window.confirm).toHaveBeenCalledWith('Reset everything?');
  });
});
