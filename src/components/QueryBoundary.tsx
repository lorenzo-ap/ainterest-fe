import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Component, type ErrorInfo, type ReactNode, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

type ErrorBoundaryProps = {
	children: ReactNode;
	onReset: () => void;
	fallback: (retry: () => void) => ReactNode;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error(error, info.componentStack);
	}

	retry = () => {
		this.props.onReset();
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return this.props.fallback(this.retry);
		}

		return this.props.children;
	}
}

type QueryBoundaryProps = {
	children: ReactNode;
	loading: ReactNode;
	error?: (retry: () => void) => ReactNode;
};

/**
 * Suspense and failure in one place: a request that goes wrong degrades to a
 * small, retryable message instead of taking the screen down with it.
 */
export const QueryBoundary = ({ children, loading, error }: QueryBoundaryProps) => {
	const { t } = useTranslation();

	const fallback =
		error ??
		((retry: () => void) => (
			<div className='flex flex-col items-center justify-center gap-4 px-6 py-20 text-center'>
				<p className='text-[15px] text-ink-2'>{t('components.error_state.title')}</p>
				<button
					className='h-10 rounded-full border border-line px-5 text-[14px] text-ink-2 transition-colors hover:bg-hover hover:text-ink'
					onClick={retry}
					type='button'
				>
					{t('components.error_state.retry')}
				</button>
			</div>
		));

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary fallback={fallback} onReset={reset}>
					<Suspense fallback={loading}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
};
