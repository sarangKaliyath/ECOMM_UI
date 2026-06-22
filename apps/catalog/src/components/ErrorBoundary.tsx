import React, { Component } from "react";

interface Props {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.name ? ` - ${this.props.name}` : ""}]`, error, errorInfo);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg m-4">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {this.props.name ? `${this.props.name} failed to load` : "Something went wrong"}
          </h2>
          {import.meta.env.DEV && this.state.error && (
            <p className="text-sm text-red-500 mb-4 font-mono">{this.state.error.message}</p>
          )}
          <button
            onClick={this.reset}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
