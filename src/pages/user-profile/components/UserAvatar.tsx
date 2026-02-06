import 'react-image-crop/dist/ReactCrop.css';

import { Avatar, Button, Modal } from '@mantine/core';
import { IconPhotoEdit } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, type SyntheticEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { postKeys, useCurrentUser, useUpdateCurrentUser } from '../../../queries';
import { toastService } from '../../../services';
import type { UserModel } from '../../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DATA_URL_PREFIX_REGEX = /^.+,/;

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

	const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
	const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

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
		setUploadedPhoto(selectedFile);
		setUploadedPhotoUrl(objectUrl);
		setCropModalOpen(true);
	};

	const resetFileInput = () => {
		setCropModalOpen(false);
		setTimeout(() => {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			setUploadedPhoto(null);
			setUploadedPhotoUrl(null);
			setCrop(undefined);
			setCompletedCrop(null);
		}, 150);
	};

	const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		const crop = centerCrop(
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
		setCrop(crop);
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
			const photo = reader.result?.toString().replace('data:', '').replace(DATA_URL_PREFIX_REGEX, '');
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
		<div className='group relative rounded-full border border-slate-600'>
			<input
				accept='image/*'
				className='hidden'
				id='uploadImage'
				onChange={handleFileUpload}
				ref={fileInputRef}
				type='file'
			/>

			<label
				className='relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full'
				htmlFor='uploadImage'
				style={{ pointerEvents: isCurrentUser ? 'auto' : 'none' }}
			>
				<Avatar
					color='initials'
					key={user.username}
					name={user.username}
					size={80}
					src={isCurrentUser ? currentUser?.photo : user.photo}
				>
					{user.username[0].toUpperCase()}
				</Avatar>

				{!uploadedPhoto && isCurrentUser && (
					<div className='pointer-events-none absolute -bottom-20 left-1/2 flex h-full w-full -translate-x-1/2 items-start justify-center rounded-full bg-black bg-opacity-50 pt-1.5 text-slate-300 transition-all md:group-hover:-bottom-12'>
						<IconPhotoEdit size={16} />
					</div>
				)}
			</label>

			<Modal centered onClose={resetFileInput} opened={cropModalOpen} size='lg' withCloseButton={false}>
				<div className='flex flex-col items-center'>
					{uploadedPhotoUrl && (
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
								className='!max-h-[70vh] w-full object-contain'
								onLoad={onImageLoad}
								ref={imgRef}
								src={uploadedPhotoUrl}
							/>
						</ReactCrop>
					)}

					<div className='mt-3 flex items-center justify-end gap-x-3 self-end'>
						<Button color='red' disabled={isPending} onClick={resetFileInput} variant='subtle'>
							{t('common.cancel')}
						</Button>

						<Button
							color='teal'
							disabled={!completedCrop || completedCrop.width <= 1 || completedCrop.height <= 1}
							loading={isPending}
							onClick={editUser}
						>
							{t('common.save')}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};
