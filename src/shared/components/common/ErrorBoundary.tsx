'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { WarningCircleIcon, ArrowClockwiseIcon } from '@phosphor-icons/react';
import { Button } from '@/src/shared/components/ui/button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Senior Component-level Error Boundary.
 * Catches JavaScript errors in its child component tree, logs the error,
 * and displays a clean fallback UI instead of crashing the entire page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center p-6 my-4 rounded-2xl border border-rose-200/80 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/50 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
            <WarningCircleIcon size={28} weight="bold" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Đã xảy ra lỗi khi tải khu vực này
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
            {this.state.error.message || 'Hệ thống gặp sự cố tạm thời.'}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={this.resetErrorBoundary}
            className="inline-flex items-center gap-1.5 text-xs"
          >
            <ArrowClockwiseIcon size={14} weight="bold" />
            Thử lại
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
