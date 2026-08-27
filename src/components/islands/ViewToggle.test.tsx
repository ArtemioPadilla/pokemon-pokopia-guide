// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewToggle from './ViewToggle';

describe('ViewToggle', () => {
  it('marks the active view pressed and the other not', () => {
    render(
      <ViewToggle
        view="list"
        onChange={vi.fn()}
        listLabel="List"
        mapLabel="Map"
        groupLabel="View"
      />,
    );
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Map' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the clicked view', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ViewToggle
        view="list"
        onChange={onChange}
        listLabel="List"
        mapLabel="Map"
        groupLabel="View"
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Map' }));
    expect(onChange).toHaveBeenCalledWith('map');
  });
});
