const CardSkeleton = () => {
  return (
    <div className='card animate-pulse p-4 border border-gray-300 rounded-md flex flex-col aspect-[1/1]'>
      <div className='bg-gray-300 w-full flex-grow mb-4 rounded-md' />
      <div className='bg-gray-300 w-3/4 h-6 rounded-md' />
    </div>
  );
};

export default CardSkeleton;
