import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={this.state.error?.message || 'An unexpected error occurred'}
          extra={[
            <Button type="primary" key="home" onClick={this.handleReset}>
              Try Again
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for cases where you need hooks
export const ErrorBoundaryWithHooks: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleNavigateHome = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Result
        style={{ display: 'none' }}
        extra={[
          <Button key="home" onClick={handleNavigateHome}>
            Go Home
          </Button>,
        ]}
      />
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWithHooks;
