import 'react-image-crop/dist/ReactCrop.css';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Initials, Spinner } from '../../../components/ui';
import { postKeys, useCurrentUser, useUpdateCurrentUser } from '../../../queries';
import { toastService } from '../../../services';
import type { UserModel } from '../../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type UserAvatarProps = {
	user: UserModel;
	isCurrentUser: boolean;
};

export const UserAvatar = ({ user, isCurrentUser }: UserAvatarProps) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data: currentUser } = useCurrentUser();
	const { mutate: updateUser, isPending } = useUpdateCurrentUser({
		onSuccess: () => {
			resetFileInput();
			toastService.success(t('apis.user.update'));
			queryClient.invalidateQueries({
				queryKey: postKeys.posts
			});
		}
	});

	const [uploadedPhoto, setUploadedPhoto] = useState<string>();
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
	const [cropModalOpened, { open: openCropModal, close: closeCropModal }] = useDisclosure(false);

	const imgRef = useRef<HTMLImageElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];

		if (!selectedFile) return;

		if (selectedFile.size > MAX_FILE_SIZE) {
			toastService.error(t('apis.user.error_size'));
			resetFileInput();
			return;
		}

		const objectUrl = URL.createObjectURL(selectedFile);
		setUploadedPhoto(objectUrl);
		openCropModal();
	};

	const resetFileInput = () => {
		closeCropModal();
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		setUploadedPhoto(undefined);
		setCrop(undefined);
		setCompletedCrop(null);
	};

	const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		const centeredCrop = centerCrop(
			makeAspectCrop(
				{
					unit: '%',
					width: 90
				},
				1, // 1:1 aspect ratio for avatar
				width,
				height
			),
			width,
			height
		);
		setCrop(centeredCrop);
	};

	const getCroppedImage = (): Promise<File> => {
		if (!(completedCrop && imgRef.current)) {
			throw new Error('Crop or image not available');
		}

		const canvas = document.createElement('canvas');
		const image = imgRef.current;
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext('2d');

		canvas.width = completedCrop.width;
		canvas.height = completedCrop.height;

		ctx?.drawImage(
			image,
			completedCrop.x * scaleX,
			completedCrop.y * scaleY,
			completedCrop.width * scaleX,
			completedCrop.height * scaleY,
			0,
			0,
			completedCrop.width,
			completedCrop.height
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				if (!blob) return;
				resolve(new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' }));
			}, 'image/jpeg');
		});
	};

	const editUser = async () => {
		if (!(uploadedPhoto && completedCrop)) return;

		const croppedImage = await getCroppedImage();
		const reader = new FileReader();
		reader.readAsDataURL(croppedImage);

		reader.onload = () => {
			const photo = reader.result?.toString();
			if (!(photo && user)) {
				toastService.error(t('apis.user.error_upload'));
				return;
			}

			updateUser({
				...user,
				photo
			});
		};
	};

	return (
		<div className='group relative shrink-0'>
			<input
				accept='image/*'
				className='hidden'
				id='uploadImage'
				onChange={handleFileUpload}
				ref={fileInputRef}
				type='file'
			/>

			<label
				className='relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full ring-1 ring-line'
				htmlFor='uploadImage'
				style={{ pointerEvents: isCurrentUser ? 'auto' : 'none' }}
			>
				<Initials name={user.username} size={96} src={isCurrentUser ? currentUser?.photo : user.photo} />

				{isCurrentUser && (
					<span className='absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] text-white opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100'>
						{t('pages.user_profile.change_photo')}
					</span>
				)}
			</label>

			<Modal
				onClose={resetFileInput}
				opened={cropModalOpened}
				size='lg'
				title={<h2 className='font-display text-2xl'>{t('pages.user_profile.edit_avatar')}</h2>}
			>
				<div className='flex flex-col items-center'>
					{uploadedPhoto && (
						<ReactCrop
							aspect={1}
							circularCrop
							crop={crop}
							onChange={(_, percentCrop) => setCrop(percentCrop)}
							onComplete={(c) => setCompletedCrop(c)}
						>
							{/* biome-ignore lint: onLoad is not a user interaction */}
							<img
								alt={t('common.avatar')}
								className='!max-h-[65vh] w-full rounded-md object-contain'
								onLoad={onImageLoad}
								ref={imgRef}
								src={uploadedPhoto}
							/>
						</ReactCrop>
					)}

					<div className='mt-6 flex items-center justify-end gap-2 self-stretch'>
						<button
							className='h-10 rounded-full px-4 text-[14px] text-ink-3 transition-colors hover:bg-hover hover:text-ink disabled:opacity-50'
							disabled={isPending}
							onClick={resetFileInput}
							type='button'
						>
							{t('common.cancel')}
						</button>

						<button
							className='flex h-10 items-center gap-2 rounded-full bg-brand px-5 font-medium text-[14px] text-white transition-opacity hover:opacity-90 disabled:opacity-40'
							disabled={isPending || !completedCrop || completedCrop.width <= 1 || completedCrop.height <= 1}
							onClick={editUser}
							type='button'
						>
							{isPending && <Spinner size={14} />}
							{t('common.save')}
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};
