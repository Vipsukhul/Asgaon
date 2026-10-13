import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Asgaon Uncaught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fef9ee] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-lg border border-[#e8e2d9]">
            <div className="w-16 h-16 rounded-full bg-[#fef3c7] text-[#ba1a1a] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h2 className="font-heading font-extrabold text-[20px] text-[#166534] mb-2">
              Something went wrong
            </h2>
            <p className="text-[13px] text-[#707974] mb-6">
              A temporary interface error occurred. Please reload the page to restore your civic session.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, errorMessage: '' });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#166534] text-white text-[13px] font-bold hover:bg-[#052e16] transition-colors shadow-xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
