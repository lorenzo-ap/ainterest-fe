import { ActionIcon, Loader, Text } from '@mantine/core';
import { IconCircleXFilled, IconInfoCircle } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PostModel } from '../types';
import { getLocale } from '../utils';
import { PostActions } from '.';
import { PostMetaBar } from './PostMetaBar';

export const Post = (post: PostModel) => {
	const { t, i18n } = useTranslation();

	const [showInfo, setShowInfo] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isHovered, setIsHovered] = useState(false);

	const locale = getLocale(i18n.language);
	const formattedDate = format(new Date(post.createdAt), 'MMMM d, yyyy HH:mm', {
		locale
	});
	const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

	return (
		// biome-ignore lint: Used for hover-based visual state only
		<div
			className='card group relative aspect-square overflow-y-hidden rounded-xl border border-color shadow-card'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative h-full w-full'>
				{loading && (
					<div className='absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-black/15'>
						<Loader color='white' size='xl' />
					</div>
				)}

				{!loading && (
					<div
						className={`${showInfo ? 'opacity-100' : 'md:group-hover:opacity-100'} absolute inset-0 z-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-700`}
					/>
				)}

				<img
					alt={post.prompt}
					className={`h-auto w-full rounded-xl object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
					loading='lazy'
					onLoad={() => {
						setLoading(false);
					}}
					src={post.photo}
				/>
			</div>

			{!loading && (
				<>
					<ActionIcon
						aria-label={t('a11y.toggle_info')}
						className='absolute top-3 right-3 z-10 md:hidden'
						onClick={() => {
							setShowInfo((prev) => !prev);
						}}
						size={40}
						tabIndex={showInfo ? 0 : -1}
						variant='transparent'
					>
						{showInfo ? (
							<IconCircleXFilled className='text-slate-300' size={40} />
						) : (
							<IconInfoCircle className='text-slate-300' size={40} />
						)}
					</ActionIcon>

					<div
						className={`absolute flex max-h-[75%] flex-col md:-bottom-full md:group-hover:bottom-0 ${showInfo ? '-bottom-0' : '-bottom-full'} right-0 left-0 m-2 rounded-md bg-[#10131F] p-4 transition-all duration-500`}
					>
						<div className='flex flex-col items-start justify-between gap-y-1.5'>
							<div className='flex items-center justify-between self-stretch'>
								<Text className='text-slate-300 text-xs'>{capitalizedDate}</Text>

								<PostActions isHovered={isHovered} post={post} showInfo={showInfo} />
							</div>

							<Text
								className='scrollbar max-h-[100px] overflow-y-scroll pr-0.5 text-white max-lg:text-sm'
								tabIndex={isHovered || showInfo ? 0 : -1}
							>
								{post.prompt}
							</Text>
						</div>

						<PostMetaBar isHovered={isHovered} post={post} showInfo={showInfo} />
					</div>
				</>
			)}
		</div>
	);
};
