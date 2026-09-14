import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { ScrollToTopButton } from './components';
import { legacyRoutes, routes } from './constants';
import { useNotificationListener } from './hooks';
import { CreatePostPage, ErrorPage, HomePage, ResetPasswordPage, UserProfilePage } from './pages';
import { Header, MobileTabBar, Onboarding, Page, ProtectedRoute } from './pages/components';
import { AuthModalsProvider, OnboardingProvider } from './providers';
import { useCurrentUser } from './queries';
import { theme } from './theme';

/** Old profile links — and anything already shared — keep working. */
const LegacyProfileRedirect = () => {
	const { username } = useParams<{ username: string }>();
	return <Navigate replace to={username ? routes.profile(username) : routes.explore} />;
};

const App = () => {
	useCurrentUser({
		enabled: true
	});
	useNotificationListener();

	return (
		<MantineProvider defaultColorScheme='dark' theme={theme} withCssVariables>
			<Notifications autoClose={3000} position='bottom-right' zIndex={1000} />

			<BrowserRouter
				future={{
					v7_relativeSplatPath: true,
					v7_startTransition: true
				}}
			>
				<AuthModalsProvider>
					<OnboardingProvider>
						<Header />

						<main className='min-h-dvh pt-header pb-tabbar md:pb-0'>
							<Routes>
								<Route
									element={
										<Page title='AInterest'>
											<HomePage />
										</Page>
									}
									path={routes.explore}
								/>

								<Route element={<UserProfilePage />} path='/u/:username' />
								<Route element={<LegacyProfileRedirect />} path={legacyRoutes.profile} />

								<Route
									element={
										<Page title='New password · AInterest'>
											<ResetPasswordPage />
										</Page>
									}
									path='/reset-password/:token'
								/>

								<Route element={<ProtectedRoute />}>
									<Route
										element={
											<Page title='Create · AInterest'>
												<CreatePostPage />
											</Page>
										}
										path={routes.create}
									/>
								</Route>

								<Route element={<Navigate replace to={routes.create} />} path={legacyRoutes.create} />

								<Route
									element={
										<Page title='Not found · AInterest'>
											<ErrorPage />
										</Page>
									}
									path='*'
								/>
							</Routes>
						</main>

						<ScrollToTopButton />
						<MobileTabBar />
						<Onboarding />
					</OnboardingProvider>
				</AuthModalsProvider>
			</BrowserRouter>
		</MantineProvider>
	);
};

export default App;
