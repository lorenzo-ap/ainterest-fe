export const CardSkeleton = () => {
  return (
    <div className='border-color card flex aspect-square animate-pulse flex-col rounded-xl border p-4'>
      <div className='card__bg mb-4 w-full flex-grow rounded-md' />
      <div className='card__bg h-6 w-3/4 rounded-md' />
    </div>
  );
};
