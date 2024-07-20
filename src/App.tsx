import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <BrowserRouter>
      <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-5 border-b border-b-[#E6EBF4]'>
        <div className='w-full max-w-7xl mx-auto'>
          <Link to='/'>
            <span className='text-2xl font-bold'>Image Generator</span>
          </Link>
        </div>
      </header>

      <main className='sm:px-8 px-4 py-8 w-full bg-[#F9FAFE] min-h-[calc(100vh-73px)]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create-post' element={<CreatePost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
