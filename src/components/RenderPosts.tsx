import { Skeleton, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { PostModel } from '../types';
import { Post } from './Post';

const PostSkeleton = () => (
	<>
		{Array.from({ length: 10 }).map((_, index) => (
			<div
				className='card flex aspect-square flex-col rounded-xl border border-color p-4'
				key={`skeleton-${index}-${Math.random().toString(36).substring(2, 11)}`}
			>
				<Skeleton className='mb-4 flex-grow' radius='md' />
				<Skeleton className='w-3/4' height={24} radius='md' />
			</div>
		))}
	</>
);

export const PostsSkeleton = () => (
	<>
		<Skeleton className='mt-11 mb-3 md:mt-14' height={42} radius='md' />
		<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>{<PostSkeleton />}</div>
	</>
);

type RenderPostsProps = {
	posts: PostModel[];
	searchText: string;
	loading: boolean;
};

export const RenderPosts = ({ posts, searchText, loading }: RenderPostsProps) => {
	const { t } = useTranslation();

	return (
		<div className='mt-3'>
			{searchText && (
				<Title className='mb-3 font-medium' order={2} size={'h3'}>
					<span className='opacity-60'>{t('components.render_posts.showing_results_for')}</span>{' '}
					<span className='opacity-100'>{searchText}</span>
				</Title>
			)}

			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'>
				{loading && <PostSkeleton />}
				{!loading && posts.length > 0 && posts.map((post) => <Post key={post.id} {...post} />)}
				{!loading && posts.length === 0 && (
					<Title c='violet' className='col-span-full mt-4 uppercase' order={2}>
						{t('components.render_posts.no_posts_found')}
					</Title>
				)}
			</div>
		</div>
	);
};
