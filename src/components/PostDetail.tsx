import { Modal } from '@mantine/core';
import { format } from 'date-fns';
import { type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { routes } from '../constants';
import { useAuthModals } from '../providers';
import { useCurrentUser, useDeletePost, useLikePost } from '../queries';
import { toastService } from '../services';
import { type PostModel, UserRole } from '../types';
import { copyToClipboard, downloadImage, getLocale, sharePhoto } from '../utils';
import { CommentsPanel } from './CommentsPanel';
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CloseIcon,
	CopyIcon,
	DownloadIcon,
	HeartFilledIcon,
	HeartIcon,
	Initials,
	ShareIcon,
	TrashIcon
} from './ui';

type DetailActionProps = {
	label: string;
	icon: ReactNode;
	onClick: () => void;
	danger?: boolean;
	active?: boolean;
	disabled?: boolean;
};

const DETAIL_ACTION_TONES = {
	danger: 'text-danger hover:bg-danger-tint',
	active: 'border-transparent bg-brand-tint-strong text-brand',
	default: 'text-ink-2 hover:bg-hover hover:text-ink'
} as const;

const detailActionTone = ({ danger, active }: Pick<DetailActionProps, 'danger' | 'active'>) => {
	if (danger) return DETAIL_ACTION_TONES.danger;
	if (active) return DETAIL_ACTION_TONES.active;
	return DETAIL_ACTION_TONES.default;
};

const DetailAction = ({ label, icon, onClick, danger, active, disabled }: DetailActionProps) => (
	<button
		className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-line text-[13px] transition-colors duration-150 disabled:opacity-40 ${detailActionTone(
			{ active, danger }
		)}`}
		disabled={disabled}
		onClick={onClick}
		type='button'
	>
		{icon}
		<span className='truncate'>{label}</span>
	</button>
);

type PostDetailProps = {
	posts: PostModel[];
	index: number | null;
	onClose: () => void;
	onNavigate: (index: number) => void;
};

/**
 * The artwork gets the room. Everything else — creator, prompt, actions,
 * conversation — sits in a quiet rail beside it (below it, on a phone).
 */
export const PostDetail = ({ posts, index, onClose, onNavigate }: PostDetailProps) => {
	const { t, i18n } = useTranslation();

	const [loadedPostId, setLoadedPostId] = useState('');
	const [intrinsicWidth, setIntrinsicWidth] = useState(0);
	const [cached, setCached] = useState<PostModel>();

	const selected = index === null ? undefined : posts[index];
	// keep the last artwork on screen while the overlay fades out
	const post = selected ?? cached;
	const postId = post?.id ?? '';

	const { data: currentUser } = useCurrentUser();
	const { openSignIn } = useAuthModals();
	const { mutate: likePost } = useLikePost(postId);
	const { mutate: deletePost, isPending: isDeleting } = useDeletePost(postId, {
		onSuccess: () => {
			toastService.success(t('apis.post.delete'));
			onClose();
		}
	});

	const imageLoaded = Boolean(postId) && loadedPostId === postId;
	const hasPrevious = index !== null && index > 0;
	const hasNext = index !== null && index < posts.length - 1;

	useEffect(() => {
		if (selected) setCached(selected);
	}, [selected]);

	useEffect(() => {
		if (index === null) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowLeft' && index > 0) onNavigate(index - 1);
			if (event.key === 'ArrowRight' && index < posts.length - 1) onNavigate(index + 1);
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [index, posts.length, onNavigate]);

	if (!post) return null;

	const locale = getLocale(i18n.language);
	const formattedDate = format(new Date(post.createdAt), 'd MMMM yyyy', { locale });
	const canDelete = currentUser?.role === UserRole.ADMIN || post.user.id === currentUser?.id;

	const toggleLike = () => {
		if (!currentUser) {
			openSignIn();
			return;
		}

		likePost();
	};

	return (
		<Modal
			classNames={{ content: 'bg-bg-deep', body: 'h-dvh p-0' }}
			fullScreen
			onClose={onClose}
			opened={index !== null}
			padding={0}
			transitionProps={{ transition: 'fade', duration: 180 }}
			withCloseButton={false}
		>
			<div className='relative flex h-dvh flex-col overflow-hidden lg:flex-row'>
				{/* the artwork itself lights the room */}
				<img
					alt=''
					aria-hidden
					className='pointer-events-none absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-[80px] saturate-150'
					key={post.photo}
					src={post.photo}
				/>
				<div className='pointer-events-none absolute inset-0 bg-bg-deep/60' />

				<div className='relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden'>
					<header className='flex h-14 shrink-0 items-center justify-between px-3 sm:px-5'>
						<button
							aria-label={t('common.close')}
							className='icon-btn h-9 w-9 text-ink-2'
							onClick={onClose}
							type='button'
						>
							<CloseIcon size={20} />
						</button>

						<span className='font-mono text-[11px] text-ink-3 tracking-widest'>
							{index === null ? '' : `${index + 1} / ${posts.length}`}
						</span>

						<div className='flex items-center gap-1'>
							<button
								aria-label={t('components.post_detail.previous')}
								className='icon-btn h-9 w-9 disabled:opacity-25'
								disabled={!hasPrevious}
								onClick={() => index !== null && onNavigate(index - 1)}
								type='button'
							>
								<ChevronLeftIcon size={20} />
							</button>
							<button
								aria-label={t('components.post_detail.next')}
								className='icon-btn h-9 w-9 disabled:opacity-25'
								disabled={!hasNext}
								onClick={() => index !== null && onNavigate(index + 1)}
								type='button'
							>
								<ChevronRightIcon size={20} />
							</button>
						</div>
					</header>

					<figure className='flex h-[52vh] shrink-0 items-center justify-center px-4 pb-6 lg:h-auto lg:min-h-0 lg:flex-1 lg:px-12 lg:pb-12'>
						{/* biome-ignore lint: onLoad is not a user interaction */}
						<img
							alt={post.prompt}
							className={`h-auto max-h-full max-w-full rounded-lg drop-shadow-[0_20px_50px_rgb(0_0_0/45%)] transition-all duration-700 ease-out ${
								imageLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.02] opacity-0 blur-lg'
							}`}
							key={post.id}
							onLoad={(event) => {
								setLoadedPostId(post.id);
								// the element box tracks the artwork itself, so the radius lands on the
								// image; small sources may grow, but never past twice their resolution
								setIntrinsicWidth(event.currentTarget.naturalWidth);
							}}
							src={post.photo}
							style={{ width: intrinsicWidth ? intrinsicWidth * 2 : undefined }}
						/>
					</figure>
				</div>

				<aside className='flex w-full shrink-0 flex-col gap-7 border-line bg-bg/50 px-5 py-7 backdrop-blur-xl lg:z-10 lg:w-[400px] lg:overflow-y-auto lg:border-l lg:px-7'>
					<div className='flex items-center justify-between gap-3'>
						<Link
							className='flex min-w-0 items-center gap-3 transition-opacity hover:opacity-75'
							onClick={onClose}
							to={routes.profile(post.user.username)}
						>
							<Initials name={post.user.username} size={40} src={post.user.photo} />
							<div className='min-w-0'>
								<p className='truncate font-medium text-[15px] text-ink leading-tight'>{post.user.username}</p>
								<p className='mt-0.5 text-[12px] text-ink-3'>{formattedDate}</p>
							</div>
						</Link>

						<button
							aria-label={t(
								post.likedByCurrentUser ? 'components.post_card.unlike_post' : 'components.post_card.like_post'
							)}
							className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] transition-colors duration-150 ${
								post.likedByCurrentUser
									? 'bg-brand-tint-strong text-brand'
									: 'border border-line text-ink-2 hover:bg-hover hover:text-ink'
							}`}
							onClick={toggleLike}
							type='button'
						>
							{post.likedByCurrentUser ? <HeartFilledIcon size={17} /> : <HeartIcon size={17} />}
							{post.likesCount}
						</button>
					</div>

					<div>
						<div className='mb-2.5 flex items-center justify-between'>
							<h3 className='eyebrow'>{t('components.post_detail.prompt')}</h3>
							<button
								className='flex items-center gap-1.5 text-[11px] text-ink-3 transition-colors hover:text-ink'
								onClick={() => copyToClipboard(post.prompt, t('components.post_detail.prompt_copied'))}
								type='button'
							>
								<CopyIcon size={13} />
								{t('components.post_detail.copy')}
							</button>
						</div>

						<p className='rounded-md border border-line bg-inset p-4 font-mono text-[13px] text-ink-2 leading-relaxed'>
							{post.prompt}
						</p>
					</div>

					<div className='flex gap-2'>
						<DetailAction
							icon={<DownloadIcon size={16} />}
							label={t('components.post_detail.download')}
							onClick={() => downloadImage(post.prompt, post.photo, post.user.username)}
						/>
						<DetailAction
							icon={<ShareIcon size={16} />}
							label={t('components.post_detail.share')}
							onClick={() => sharePhoto(post.prompt, post.photo)}
						/>
						{canDelete && (
							<button
								aria-label={t('components.post_card.delete_post')}
								className='flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line text-danger transition-colors duration-150 hover:bg-danger-tint disabled:opacity-40'
								disabled={isDeleting}
								onClick={() => deletePost()}
								type='button'
							>
								<TrashIcon size={16} />
							</button>
						)}
					</div>

					<div className='border-line border-t pt-6'>
						<CommentsPanel commentsCount={post.commentsCount} key={post.id} postId={post.id} />
					</div>
				</aside>
			</div>
		</Modal>
	);
};
