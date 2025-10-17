'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
          <div className="max-w-md mx-auto p-6 glass-card-elevated text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-4">
              Error en la Aplicación
            </h1>
            <p className="text-foreground-secondary mb-6">
              Ha ocurrido un error inesperado. Por favor recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200"
            >
              Recargar Página
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-foreground-secondary">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 text-xs text-foreground-tertiary bg-black/20 p-3 rounded-apple overflow-auto">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
