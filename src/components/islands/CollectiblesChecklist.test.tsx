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
