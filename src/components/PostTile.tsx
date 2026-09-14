import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from '../api';
import { routes } from '../constants';
import { useAuthModals } from '../providers';
import { postKeys, useCurrentUser, useLikePost, userKeys } from '../queries';
import type { PostModel } from '../types';
import { STALE_TIME } from '../utils';
import { HeartFilledIcon, HeartIcon, Initials } from './ui';

type PostTileProps = {
	post: PostModel;
	feature?: boolean;
	onOpen: () => void;
};

/**
 * A piece of artwork in the gallery. Chrome stays out of the way until the
 * viewer asks for it: on pointer devices the credits fade in on hover, on
 * touch a whisper-thin scrim keeps the creator visible without covering work.
 */
export const PostTile = ({ post, feature, onOpen }: PostTileProps) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const [loaded, setLoaded] = useState(false);

	const { data: currentUser } = useCurrentUser();
	const { openSignIn } = useAuthModals();
	const { mutate: likePost } = useLikePost(post.id);

	const prefetchUserData = () => {
		const { id, username } = post.user;

		queryClient.prefetchQuery({
			queryKey: userKeys.user(username),
			queryFn: () => getUserByUsername(username),
			staleTime: STALE_TIME
		});

		queryClient.prefetchQuery({
			queryKey: postKeys.userPosts(id),
			queryFn: () => getUserPosts(id),
			staleTime: STALE_TIME
		});
	};

	const toggleLike = () => {
		if (!currentUser) {
			openSignIn();
			return;
		}

		likePost();
	};

	return (
		<article className={`group relative overflow-hidden rounded-md bg-inset ${feature ? 'tile-feature' : ''}`}>
			{!loaded && (
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-hover to-transparent' />
				</div>
			)}

			<button
				aria-label={post.prompt}
				className='block aspect-square w-full cursor-zoom-in'
				onClick={onOpen}
				type='button'
			>
				{/* biome-ignore lint: onLoad is not a user interaction */}
				<img
					alt={post.prompt}
					className={`h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out md:group-hover:scale-[1.045] ${
						loaded ? 'opacity-100' : 'opacity-0'
					}`}
					loading='lazy'
					onLoad={() => setLoaded(true)}
					src={post.photo}
				/>
			</button>

			{/* touch: permanent hairline scrim so credit never hides the artwork */}
			<div className='pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent md:hidden' />

			{/* pointer: full reveal */}
			<div className='pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 md:block' />

			<div className='pointer-events-none absolute inset-x-0 bottom-0 p-2.5 md:translate-y-1.5 md:p-3.5 md:opacity-0 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-y-0 md:group-hover:opacity-100'>
				<p className='mb-2.5 line-clamp-2 hidden font-mono text-[12px] text-white/85 leading-relaxed md:block'>
					{post.prompt}
				</p>

				<div className='flex items-center justify-between gap-2'>
					<Link
						className='pointer-events-auto flex min-w-0 items-center gap-2 transition-opacity hover:opacity-75'
						onMouseEnter={prefetchUserData}
						to={routes.profile(post.user.username)}
					>
						<Initials className='ring-1 ring-white/25' name={post.user.username} size={22} src={post.user.photo} />
						<span className='truncate font-medium text-[12px] text-white/90'>{post.user.username}</span>
					</Link>

					<div className='flex shrink-0 items-center'>
						<button
							aria-label={t(
								post.likedByCurrentUser ? 'components.post_card.unlike_post' : 'components.post_card.like_post'
							)}
							className='pointer-events-auto flex h-7 items-center gap-1 rounded-sm px-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white'
							onClick={toggleLike}
							type='button'
						>
							{post.likedByCurrentUser ? (
								<HeartFilledIcon className='text-brand-lo' size={16} />
							) : (
								<HeartIcon size={16} />
							)}
							{post.likesCount > 0 && <span className='text-[11px]'>{post.likesCount}</span>}
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};
