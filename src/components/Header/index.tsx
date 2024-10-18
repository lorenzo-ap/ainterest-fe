import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-5 border-b border-b-[#E6EBF4]'>
      <div className='w-full max-w-7xl mx-auto flex justify-between items-center'>
        <Link to='/'>
          <span className='text-2xl font-semibold'>
            <span className='text-[#6469FF] font-bold'>AI</span>mage Generator
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
