import { ActionIcon, Avatar, Text } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from '../api';
import { postKeys, useCurrentUser, useLikePost, userKeys } from '../queries';
import type { PostModel } from '../types';
import { STALE_TIME } from '../utils';

type PostMetaBarProps = {
	post: PostModel;
	isHovered: boolean;
	showInfo: boolean;
};

export const PostMetaBar = ({ post, isHovered, showInfo }: PostMetaBarProps) => {
	const { t } = useTranslation();
	const location = useLocation();
	const queryClient = useQueryClient();
	const { data: currentUser } = useCurrentUser();

	const [profileUsername, setProfileUsername] = useState<string>('');

	const { mutate: likePost } = useLikePost(post.id, currentUser?.id || '');

	useEffect(() => {
		setProfileUsername(location.pathname.split('/').reverse()[0]);
	}, [location.pathname]);

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

	return (
		<div className='mt-2.5 flex items-center justify-between'>
			<Link
				className='flex items-center gap-x-1.5 hover:opacity-85'
				onMouseEnter={prefetchUserData}
				style={{ pointerEvents: profileUsername === post.user.username ? 'none' : 'auto' }}
				tabIndex={isHovered || showInfo ? 0 : -1}
				to={`/account/${post.user.username}`}
			>
				<Avatar color='initials' key={post.user.username} name={post.user.username} size={30} src={post.user.photo}>
					{post.user.username[0].toUpperCase()}
				</Avatar>
				<Text className='text-sm text-white'>{post.user.username}</Text>
			</Link>

			<div className='flex items-center gap-x-1'>
				<ActionIcon
					aria-label={t(
						post.likes.includes(currentUser?.id ?? '')
							? 'components.post_card.unlike_post'
							: 'components.post_card.like_post'
					)}
					className={currentUser ? '' : 'pointer-events-none'}
					onClick={() => {
						likePost();
					}}
					tabIndex={isHovered || showInfo ? 0 : -1}
					variant='transparent'
				>
					{post.likes.includes(currentUser?.id ?? '') ? (
						<IconHeartFilled className='text-slate-300' color='firebrick' size={24} />
					) : (
						<IconHeart className='text-slate-300' size={24} />
					)}
				</ActionIcon>

				{post.likes.length > 0 && <Text className='text-sm text-white'>{post.likes.length}</Text>}
			</div>
		</div>
	);
};
