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

const items = [
  {
    id: 'poke-001',
    nationalNumber: 1,
    pokopiaNumber: 1,
    name: 'Bulbasaur',
    types: ['Grass', 'Poison'],
    generation: 1,
    area: 'Withered Wasteland',
    habitat: 'Pretty Flower Bed',
    x: 32,
    y: 58,
  },
  { id: 'poke-025', nationalNumber: 25, name: 'Pikachu', types: ['Electric'], generation: 1 },
  {
    id: 'poke-527',
    nationalNumber: 527,
    name: 'Woobat',
    types: ['Psychic', 'Flying'],
    generation: 5,
  },
];

describe('PokedexChecklist', () => {
  beforeEach(() => {
    memory.clear();
    vi.resetModules();
  });

  it('groups items by generation under their own heading', async () => {
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Unknown"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Gen 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gen 5' })).toBeInTheDocument();
  });

  it('shows the progress bar starting at 0 done', async () => {
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Unknown"
      />,
    );
    expect(screen.getByRole('progressbar', { name: 'Pokédex' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  it('checking an item updates its checkbox and the progress count', async () => {
    const user = userEvent.setup();
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Unknown"
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /Bulbasaur/ });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByRole('progressbar', { name: 'Pokédex' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
  });

  it('defaults to the list view, with the map view available via the toggle', async () => {
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Unknown"
      />,
    );
    // List view (checkboxes) is present without any interaction.
    expect(screen.getByRole('checkbox', { name: /Bulbasaur/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Withered Wasteland' })).not.toBeInTheDocument();
  });

  it('toggling a map pin updates the exact same store the list checkbox reads', async () => {
    const user = userEvent.setup();
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Unknown"
        listLabel="List"
        mapLabel="Map"
        viewGroupLabel="View"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Map' }));
    const pin = screen.getByRole('button', { name: /Bulbasaur/ });
    expect(pin).toHaveAttribute('aria-pressed', 'false');

    await user.click(pin);
    expect(pin).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('progressbar', { name: 'Pokédex' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );

    // Switching back to the list view shows the same item checked — same
    // underlying `pokedexStore`, no separate map-only state.
    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('checkbox', { name: /Bulbasaur/ })).toBeChecked();
  });

  it('falls back to the "habitat unknown" label when habitat is not set', async () => {
    const { default: PokedexChecklist } = await import('./PokedexChecklist');
    render(
      <PokedexChecklist
        items={items}
        progressLabel="Pokédex"
        genLabel="Gen"
        habitatUnknownLabel="Habitat not verified"
      />,
    );
    expect(screen.getAllByText('Habitat not verified').length).toBeGreaterThan(0);
    expect(screen.getByText('Pretty Flower Bed')).toBeInTheDocument();
  });
});
