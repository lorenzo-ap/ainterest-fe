import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNotificationListener } from './hooks';
import { CreatePostPage, ErrorPage, HomePage, ResetPasswordPage, UserProfilePage } from './pages';
import { Page, ProtectedRoute } from './pages/components';
import { Header } from './pages/components/Header';
import { useCurrentUser } from './queries';

const App = () => {
	useCurrentUser({
		enabled: true
	});
	useNotificationListener();

	return (
		<MantineProvider defaultColorScheme='light' withCssVariables>
			<Notifications autoClose={3000} position='bottom-right' zIndex={1000} />

			<BrowserRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true
				}}
			>
				<Header />

				<main className='min-h-[calc(100vh-77px)] w-full px-4 py-8 sm:px-8'>
					<Routes>
						<Route
							element={
								<Page title='AInterest'>
									<HomePage />
								</Page>
							}
							path='/'
						/>

						<Route element={<UserProfilePage />} path='/account/:username' />

						<Route
							element={
								<Page title='Reset password'>
									<ResetPasswordPage />
								</Page>
							}
							path='/reset-password/:token'
						/>

						<Route element={<ProtectedRoute />}>
							<Route
								element={
									<Page title='Generate image'>
										<CreatePostPage />
									</Page>
								}
								path='/generate-image'
							/>
						</Route>

						<Route
							element={
								<Page title='404'>
									<ErrorPage />
								</Page>
							}
							path='*'
						/>
					</Routes>
				</main>
			</BrowserRouter>
		</MantineProvider>
	);
};

export default App;
