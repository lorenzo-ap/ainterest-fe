import { ActionIcon, Avatar, Button, Modal, ScrollArea, Skeleton, Text, TextInput, Tooltip } from '@mantine/core';
import { IconArrowDown } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Suspense, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from '../api';
import { postKeys, useComments, useCreateComment, userKeys } from '../queries';
import { getLocale, STALE_TIME } from '../utils';

type CommentsModalProps = {
	opened: boolean;
	postId: string;
	close: () => void;
};

const CommentsSkeleton = () => (
	<div className='flex flex-col gap-4'>
		{[1, 2, 3].map((item) => (
			<div className='flex gap-3' key={item}>
				<Skeleton circle height={38} width={38} />
				<div className='flex flex-grow flex-col gap-2'>
					<div className='flex items-baseline gap-2'>
						<Skeleton height={14} radius='sm' width='30%' />
						<Skeleton height={10} radius='sm' width='20%' />
					</div>
					<Skeleton height={14} radius='sm' width='100%' />
				</div>
			</div>
		))}
	</div>
);

const CommentsContent = ({ postId }: { postId: string }) => {
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();
	const { data: comments } = useComments(postId);
	const locale = getLocale(i18n.language);

	if (comments.length) {
		return (
			<div className='flex flex-col gap-4'>
				{comments.map((comment) => {
					const prefetchUserData = () => {
						const { id, username } = comment.author;

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
						<div className='flex gap-3' key={comment.id}>
							<Link
								className='flex-shrink-0 hover:opacity-85'
								onMouseEnter={prefetchUserData}
								to={`/account/${comment.author.username}`}
							>
								<Avatar
									alt={comment.author.username}
									color='initials'
									name={comment.author.username}
									radius='xl'
									size='md'
									src={comment.author.photo}
								>
									{comment.author.username[0].toUpperCase()}
								</Avatar>
							</Link>
							<div className='flex flex-col'>
								<div className='flex items-baseline gap-2'>
									<Link
										className='font-semibold text-sm hover:underline'
										onMouseEnter={prefetchUserData}
										to={`/account/${comment.author.username}`}
									>
										{comment.author.username}
									</Link>
									<Text className='text-gray-500 text-xs'>
										{formatDistanceToNow(new Date(comment.createdAt), {
											addSuffix: true,
											locale
										})}
									</Text>
								</div>
								<Text className='text-sm'>{comment.text}</Text>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className='flex h-full items-center justify-center p-4 text-gray-500'>
			{t('components.comments_modal.no_comments_yet')}
		</div>
	);
};

export const CommentsModal = ({ opened, postId, close }: CommentsModalProps) => {
	const { t } = useTranslation();
	const [text, setText] = useState('');
	const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);

	const viewport = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });

	const { mutate: createComment, isPending } = useCreateComment({
		onSuccess: () => setText('')
	});

	const handleScroll = (position: { y: number }) => {
		if (!viewport.current) return;
		const sh = viewport.current.scrollHeight;
		const ch = viewport.current.clientHeight || 400;
		const st = Math.round(position.y);

		const isScrollable = sh > ch + 10;
		const isNotAtBottom = sh - ch - st > 50;
		setIsScrollButtonVisible(isScrollable && isNotAtBottom);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;
		createComment({ postId, text: text.trim() });
	};

	return (
		<Modal
			centered
			onClose={close}
			opened={opened}
			padding='md'
			radius='md'
			size='lg'
			title={<Text className='font-semibold text-lg'>{t('components.comments_modal.title')}</Text>}
		>
			<div className='relative h-[400px]'>
				<ScrollArea h={400} offsetScrollbars onScrollPositionChange={handleScroll} viewportRef={viewport}>
					{opened && (
						<Suspense fallback={<CommentsSkeleton />}>
							<CommentsContent postId={postId} />
						</Suspense>
					)}
				</ScrollArea>

				<div
					className={`absolute right-5 bottom-2 z-20 transition-all duration-300 ${
						isScrollButtonVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
					}`}
				>
					<Tooltip label={t('components.comments_modal.scroll_to_bottom')} withArrow>
						<ActionIcon
							className='shadow-lg'
							color='violet'
							onClick={scrollToBottom}
							radius='xl'
							size='lg'
							variant='filled'
						>
							<IconArrowDown size={20} />
						</ActionIcon>
					</Tooltip>
				</div>
			</div>

			<form className='mt-4 flex gap-2' onSubmit={handleSubmit}>
				<TextInput
					className='flex-grow'
					data-autofocus
					disabled={isPending}
					onChange={(e) => setText(e.target.value)}
					placeholder={t('components.comments_modal.placeholder')}
					size='md'
					value={text}
				/>
				<Button color='violet' disabled={!text.trim() || isPending} loading={isPending} size='md' type='submit'>
					{t('components.comments_modal.post')}
				</Button>
			</form>
		</Modal>
	);
};
