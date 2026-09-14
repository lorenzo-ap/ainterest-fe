import type { ReactNode } from 'react';
import { useState } from 'react';
import type { PostModel } from '../types';
import { PostDetail } from './PostDetail';
import { PostTile } from './PostTile';

const GRID = 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4 3xl:grid-cols-5';

/** Every ninth tile breaks the rhythm — a curated wall, not a spreadsheet. */
const isFeature = (index: number) => index % 9 === 4;

const SKELETON_KEYS = Array.from({ length: 12 }).map(() => crypto.randomUUID());

export const GallerySkeleton = () => (
	<div className={GRID}>
		{SKELETON_KEYS.map((key, index) => (
			<div
				className={`relative aspect-square overflow-hidden rounded-md bg-inset ${isFeature(index) ? 'tile-feature' : ''}`}
				key={key}
			>
				<div className='absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-hover to-transparent' />
			</div>
		))}
	</div>
);

type GalleryProps = {
	posts: PostModel[];
	loading?: boolean;
	emptyTitle: string;
	emptyHint?: string;
	emptyAction?: ReactNode;
};

export const Gallery = ({ posts, loading, emptyTitle, emptyHint, emptyAction }: GalleryProps) => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	if (loading) return <GallerySkeleton />;

	if (!posts.length) {
		return (
			<div className='flex flex-col items-center justify-center px-6 py-24 text-center'>
				<p className='font-display text-3xl text-ink sm:text-4xl'>{emptyTitle}</p>
				{emptyHint && <p className='mt-3 max-w-sm text-[15px] text-ink-3'>{emptyHint}</p>}
				{emptyAction && <div className='mt-7'>{emptyAction}</div>}
			</div>
		);
	}

	return (
		<>
			<div className={GRID}>
				{posts.map((post, index) => (
					<PostTile feature={isFeature(index)} key={post.id} onOpen={() => setOpenIndex(index)} post={post} />
				))}
			</div>

			<PostDetail index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} posts={posts} />
		</>
	);
};
