import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home, CreatePost } from './pages';
import { Header, Page } from './components';

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <main className='sm:px-8 px-4 py-8 w-full bg-[#F9FAFE] min-h-[calc(100vh-73px)]'>
        <Routes>
          <Route
            path='/'
            element={
              <Page title='AImage Generator'>
                <Home />
              </Page>
            }
          />

          <Route
            path='/create-post'
            element={
              <Page title='Create post'>
                <CreatePost />
              </Page>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
