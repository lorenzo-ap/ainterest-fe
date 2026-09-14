import { GallerySkeleton, QueryBoundary } from '../../components';
import { ExploreFeed } from './components';

const HomeSkeleton = () => (
	<section className='mx-auto max-w-gallery px-5 pt-10 pb-24 sm:px-8'>
		<div className='mb-8 h-11 w-full max-w-md rounded-full bg-inset' />
		<GallerySkeleton />
	</section>
);

export const HomePage = () => (
	<QueryBoundary loading={<HomeSkeleton />}>
		<ExploreFeed />
	</QueryBoundary>
);
