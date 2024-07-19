import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { logo } from './assets';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';

const App = () => {
    return (
        <BrowserRouter>
            <header className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#E6EBF4]">
                <Link to="/">
                    <img className="w-28 object-contain" src={logo} alt="OpenAI logo" />
                </Link>

                <Link className="font-inter font-medium bg-[#6469FF] text-white px-4 py-2 rounded-md" to="/create-post">
                    Create
                </Link>
            </header>

            <main className="sm:px-8 px-4 py-8 w-full bg-[#F9FAFE] min-h-[calc(100vh-73px)]">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-post" element={<CreatePost />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;
