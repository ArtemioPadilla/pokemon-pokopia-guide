// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('exposes done/total via aria-value attributes', () => {
    render(<ProgressBar done={3} total={10} label="Pokédex" />);
    const bar = screen.getByRole('progressbar', { name: 'Pokédex' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '10');
  });

  it('renders the done/total count as text', () => {
    render(<ProgressBar done={3} total={10} label="Pokédex" />);
    expect(screen.getByText('3 / 10')).toBeInTheDocument();
  });

  it('does not divide by zero when total is 0', () => {
    render(<ProgressBar done={0} total={0} label="Empty" />);
    expect(screen.getByRole('progressbar', { name: 'Empty' })).toHaveAttribute(
      'aria-valuemax',
      '0',
    );
  });
});
