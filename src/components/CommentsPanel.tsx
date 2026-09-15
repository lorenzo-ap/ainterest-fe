import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getUserByUsername, getUserPosts } from '../api';
import { routes } from '../constants';
import { useAuthModals } from '../providers';
import { postKeys, useComments, useCreateComment, useCurrentUser, userKeys } from '../queries';
import { getLocale, STALE_TIME } from '../utils';
import { QueryBoundary } from './QueryBoundary';
import { ArrowUpIcon, Initials } from './ui';

const CommentsSkeleton = () => (
	<div className='flex flex-col gap-5'>
		{[1, 2, 3].map((item) => (
			<div className='flex gap-3' key={item}>
				<div className='h-[30px] w-[30px] shrink-0 rounded-full bg-inset' />
				<div className='flex flex-grow flex-col gap-2 pt-1.5'>
					<div className='h-2.5 w-1/3 rounded-full bg-inset' />
					<div className='h-2.5 w-5/6 rounded-full bg-inset' />
				</div>
			</div>
		))}
	</div>
);

const CommentsList = ({ postId }: { postId: string }) => {
	const { t, i18n } = useTranslation();
	const queryClient = useQueryClient();
	const { data: comments } = useComments(postId);

	const locale = getLocale(i18n.language);

	if (!comments.length) {
		return <p className='py-6 text-center text-ink-3 text-sm'>{t('components.comments_modal.no_comments_yet')}</p>;
	}

	return (
		<ul className='flex flex-col gap-5'>
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
					<li className='flex gap-3' key={comment.id}>
						<Link
							className='transition-opacity hover:opacity-75'
							onMouseEnter={prefetchUserData}
							to={routes.profile(comment.author.username)}
						>
							<Initials name={comment.author.username} size={30} src={comment.author.photo} />
						</Link>

						<div className='min-w-0 flex-1'>
							<div className='flex items-baseline gap-2'>
								<Link
									className='font-medium text-[13px] text-ink hover:underline'
									onMouseEnter={prefetchUserData}
									to={routes.profile(comment.author.username)}
								>
									{comment.author.username}
								</Link>
								<span className='text-[11px] text-ink-3'>
									{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale })}
								</span>
							</div>

							<p className='mt-0.5 break-words text-[14px] text-ink-2 leading-relaxed'>{comment.text}</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

type CommentsPanelProps = {
	postId: string;
	commentsCount: number;
};

/** Comments as part of the artwork's story — not a modal on top of a modal. */
export const CommentsPanel = ({ postId, commentsCount }: CommentsPanelProps) => {
	const { t } = useTranslation();
	const { data: currentUser } = useCurrentUser();
	const { openSignIn } = useAuthModals();

	const [text, setText] = useState('');

	const { mutate: createComment, isPending } = useCreateComment({
		onSuccess: () => setText('')
	});

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (!text.trim()) return;
		createComment({ postId, text: text.trim() });
	};

	return (
		<section className='flex flex-col'>
			<h3 className='eyebrow mb-4'>
				{t('components.comments_modal.title')}
				{commentsCount > 0 && <span className='ms-1.5 text-ink-2'>{commentsCount}</span>}
			</h3>

			<QueryBoundary
				error={(retry) => (
					<div className='flex items-center justify-between gap-3 rounded-md bg-inset px-4 py-3'>
						<p className='text-[13px] text-ink-3'>{t('components.error_state.comments')}</p>
						<button
							className='shrink-0 text-[13px] text-brand transition-opacity hover:opacity-70'
							onClick={retry}
							type='button'
						>
							{t('components.error_state.retry')}
						</button>
					</div>
				)}
				loading={<CommentsSkeleton />}
			>
				<CommentsList postId={postId} />
			</QueryBoundary>

			{currentUser ? (
				<form className='mt-5 flex items-center gap-2 pt-1 lg:sticky lg:bottom-0' onSubmit={handleSubmit}>
					<Initials name={currentUser.username} size={30} src={currentUser.photo} />

					<div className='relative flex-1'>
						<input
							aria-label={t('components.comments_modal.placeholder')}
							className='h-10 w-full rounded-full bg-inset pr-10 pl-4 text-[14px] text-ink outline-none ring-brand-tint-strong transition-shadow placeholder:text-ink-3 focus:bg-transparent focus:ring-2'
							disabled={isPending}
							onChange={(event) => setText(event.target.value)}
							placeholder={t('components.comments_modal.placeholder')}
							type='text'
							value={text}
						/>

						<button
							aria-label={t('components.comments_modal.post')}
							className='absolute top-1/2 right-1.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white transition-opacity duration-150 disabled:opacity-30'
							disabled={!text.trim() || isPending}
							type='submit'
						>
							<ArrowUpIcon size={16} />
						</button>
					</div>
				</form>
			) : (
				<button
					className='mt-5 h-10 rounded-full border border-line text-[13px] text-ink-2 transition-colors hover:bg-hover hover:text-ink'
					onClick={openSignIn}
					type='button'
				>
					{t('components.comments_modal.sign_in_to_comment')}
				</button>
			)}
		</section>
	);
};
