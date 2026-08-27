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
  { id: 'art-01', category: 'artifact', name: 'Cracked Tablet', area: 'Withered Wasteland' },
  {
    id: 'rec-01',
    category: 'record',
    name: 'Evacuation Notice',
    area: 'Bleak Beach',
    note: 'found near the pier',
    x: 70,
    y: 55,
  },
];

const categoryLabels = {
  artifact: 'Ancient Artifacts',
  record: 'Human Records',
  photo: 'Highlight Reel',
};

describe('CollectiblesChecklist', () => {
  beforeEach(() => {
    memory.clear();
    vi.resetModules();
  });

  it('groups items by category under their own heading', async () => {
    const { default: CollectiblesChecklist } = await import('./CollectiblesChecklist');
    render(
      <CollectiblesChecklist
        items={items}
        progressLabel="Collectibles"
        categoryLabels={categoryLabels}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Ancient Artifacts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Human Records' })).toBeInTheDocument();
  });

  it('checking an item updates the progress count', async () => {
    const user = userEvent.setup();
    const { default: CollectiblesChecklist } = await import('./CollectiblesChecklist');
    render(
      <CollectiblesChecklist
        items={items}
        progressLabel="Collectibles"
        categoryLabels={categoryLabels}
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: /Cracked Tablet/ });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getByRole('progressbar', { name: 'Collectibles' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );
  });

  it('toggling a map pin updates the exact same store the list checkbox reads', async () => {
    const user = userEvent.setup();
    const { default: CollectiblesChecklist } = await import('./CollectiblesChecklist');
    render(
      <CollectiblesChecklist
        items={items}
        progressLabel="Collectibles"
        categoryLabels={categoryLabels}
        listLabel="List"
        mapLabel="Map"
        viewGroupLabel="View"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Map' }));
    const pin = screen.getByRole('button', { name: /Evacuation Notice/ });
    expect(pin).toHaveAttribute('aria-pressed', 'false');

    await user.click(pin);
    expect(pin).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('progressbar', { name: 'Collectibles' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    );

    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('checkbox', { name: /Evacuation Notice/ })).toBeChecked();
  });

  it('an item without a pin position (like the artifact here) never appears on the map', async () => {
    const user = userEvent.setup();
    const { default: CollectiblesChecklist } = await import('./CollectiblesChecklist');
    render(
      <CollectiblesChecklist
        items={items}
        progressLabel="Collectibles"
        categoryLabels={categoryLabels}
        listLabel="List"
        mapLabel="Map"
        viewGroupLabel="View"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Map' }));
    expect(screen.queryByRole('button', { name: /Cracked Tablet/ })).not.toBeInTheDocument();
    // ...but it's always there in the list view.
    await user.click(screen.getByRole('button', { name: 'List' }));
    expect(screen.getByRole('checkbox', { name: /Cracked Tablet/ })).toBeInTheDocument();
  });

  it('renders the optional note when present', async () => {
    const { default: CollectiblesChecklist } = await import('./CollectiblesChecklist');
    render(
      <CollectiblesChecklist
        items={items}
        progressLabel="Collectibles"
        categoryLabels={categoryLabels}
      />,
    );
    expect(screen.getByText('found near the pier')).toBeInTheDocument();
  });
});
