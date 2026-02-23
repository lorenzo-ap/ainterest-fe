import { ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowsMaximize, IconPhotoDown, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser, useDeletePost } from '../queries';
import { toastService } from '../services';
import { type PostModel, UserRole } from '../types';
import { downloadImage } from '../utils';
import { PostImageModal } from './PostImageModal';

type PostActionsProps = {
	post: PostModel;
	isHovered: boolean;
	showInfo: boolean;
};

export const PostActions = ({ post, isHovered, showInfo }: PostActionsProps) => {
	const { t } = useTranslation();
	const { data: currentUser } = useCurrentUser();

	const [postImageModalOpened, { open: openPostImageModal, close: closePostImageModal }] = useDisclosure(false);

	const { mutate: deletePost, isPending: isDeletePostLoading } = useDeletePost(post.id, {
		onSuccess: () => {
			toastService.success(t('apis.post.delete'));
		}
	});

	return (
		<>
			<div className='flex gap-1'>
				<Tooltip label={t('components.post_card.maximize_image')} withArrow>
					<ActionIcon
						aria-label={t('components.post_card.maximize_image')}
						className='max-md:hidden'
						onClick={openPostImageModal}
						size={18}
						tabIndex={isHovered || showInfo ? 0 : -1}
						variant='transparent'
					>
						<IconArrowsMaximize className='text-slate-400' size={18} />
					</ActionIcon>
				</Tooltip>

				<Tooltip label={t('components.post_card.download_image')} withArrow>
					<ActionIcon
						aria-label={t('components.post_card.download_image')}
						onClick={() => {
							downloadImage(post.prompt, post.photo, post.user.username);
						}}
						p={0}
						size={18}
						tabIndex={isHovered || showInfo ? 0 : -1}
						variant='transparent'
					>
						<IconPhotoDown className='text-slate-400' size={18} />
					</ActionIcon>
				</Tooltip>

				{(currentUser?.role === UserRole.ADMIN || post.user.id === currentUser?.id) && (
					<Tooltip label={t('components.post_card.delete_post')} withArrow>
						<ActionIcon
							aria-label={t('components.post_card.delete_post')}
							loaderProps={{ color: 'white' }}
							loading={isDeletePostLoading}
							onClick={() => {
								deletePost();
							}}
							p={0}
							size={18}
							tabIndex={isHovered || showInfo ? 0 : -1}
							variant='transparent'
						>
							<IconTrash className='text-red-400' size={18} />
						</ActionIcon>
					</Tooltip>
				)}
			</div>

			<PostImageModal alt={post.prompt} close={closePostImageModal} image={post.photo} opened={postImageModalOpened} />
		</>
	);
};
