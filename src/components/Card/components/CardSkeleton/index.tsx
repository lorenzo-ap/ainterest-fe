import styles from './index.module.scss';

const CardSkeleton = () => {
  return (
    <div className={`${styles.border} card flex aspect-square animate-pulse flex-col rounded-xl border p-4`}>
      <div className={`${styles.backgroundColor} mb-4 w-full flex-grow rounded-md`} />
      <div className={`${styles.backgroundColor} h-6 w-3/4 rounded-md`} />
    </div>
  );
};

export default CardSkeleton;
