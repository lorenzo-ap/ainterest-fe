import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useNotificationListener } from './hooks';
import { CreatePostPage, ErrorPage, HomePage, UserProfilePage } from './pages';
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
      <Notifications position='bottom-right' zIndex={1000} autoClose={3000} />
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
              path='/'
              element={
                <Page title='AInterest'>
                  <HomePage />
                </Page>
              }
            />

            <Route path='/account/:username' element={<UserProfilePage />} />

            <Route element={<ProtectedRoute />}>
              <Route
                path='/generate-image'
                element={
                  <Page title='Generate image'>
                    <CreatePostPage />
                  </Page>
                }
              />
            </Route>

            <Route
              path='*'
              element={
                <Page title='404'>
                  <ErrorPage />
                </Page>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
