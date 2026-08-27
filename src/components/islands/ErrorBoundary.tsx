import * as React from 'react';

interface ErrorBoundaryProps {
  /** Default fallback's heading text — localize per usage site (no i18n lives inside this component). */
  messageLabel?: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Class-based React error boundary that catches rendering errors inside its
 * subtree and surfaces a minimal, accessible fallback instead of a blank
 * page. Must be a class component — React's error boundary API
 * (getDerivedStateFromError) is intentionally not available as a hook.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  render() {
    const { error } = this.state;

    if (error !== null) {
      return (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <p className="font-medium">
            {this.props.messageLabel ?? 'Something went wrong in this section.'}
          </p>
          <p className="mt-1 text-xs">
            <code>
              {error.name}: {error.message}
            </code>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
