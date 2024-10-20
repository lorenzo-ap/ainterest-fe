import styles from './index.module.scss';

const CardSkeleton = () => {
  return (
    <div className={`${styles.border} card animate-pulse p-4 border rounded-xl flex flex-col aspect-[1/1]`}>
      <div className={`${styles.backgroundColor} w-full flex-grow mb-4 rounded-md`} />
      <div className={`${styles.backgroundColor} w-3/4 h-6 rounded-md`} />
    </div>
  );
};

export default CardSkeleton;
