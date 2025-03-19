import { Avatar, Button, Modal } from '@mantine/core';
import { IconPhotoEdit } from '@tabler/icons-react';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../../../redux/selectors';
import { postService } from '../../../services/posts';
import { toastService } from '../../../services/toast';
import { userService } from '../../../services/user';
import { User } from '../../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UserProfileAvatarProps {
  user: User | null;
  isCurrentUser: boolean;
}

export const UserProfileAvatar = (props: UserProfileAvatarProps) => {
  const { t } = useTranslation();
  const loggedUser = useSelector(selectLoggedUser);

  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
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

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
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

  const getCroppedImage = async (): Promise<File> => {
    if (!completedCrop || !imgRef.current) {
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
    if (!uploadedPhoto || !completedCrop) return;

    setImageLoading(true);

    const croppedImage = await getCroppedImage();
    const reader = new FileReader();
    reader.readAsDataURL(croppedImage);

    reader.onload = () => {
      const photo = reader.result?.toString().replace('data:', '').replace(/^.+,/, '');
      if (!photo || !props.user) {
        toastService.error(t('apis.user.error_upload'));
        return;
      }

      const user = props.user;
      userService
        .editUser({
          ...user,
          photo
        })
        .then(() => {
          resetFileInput();
          toastService.success(t('apis.user.update'));
          postService.setPosts();
          postService.setUserPosts(user._id);
        })
        .finally(() => {
          setImageLoading(false);
        });
    };
  };

  return (
    <div className='group relative rounded-full border border-slate-600'>
      <input
        id='uploadImage'
        className='hidden'
        type='file'
        onChange={handleFileUpload}
        accept='image/*'
        ref={fileInputRef}
      />

      <label
        className='relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full'
        htmlFor='uploadImage'
        style={{ pointerEvents: props.isCurrentUser ? 'auto' : 'none' }}
      >
        <Avatar
          key={props.user?.username}
          src={props.isCurrentUser ? loggedUser?.photo : props.user?.photo}
          size={80}
          name={props.user?.username}
          color='initials'
        >
          {props.user?.username[0].toUpperCase()}
        </Avatar>

        {!uploadedPhoto && props.isCurrentUser && (
          <div className='pointer-events-none absolute -bottom-20 left-1/2 flex h-full w-full -translate-x-1/2 items-start justify-center rounded-full bg-black bg-opacity-50 pt-1.5 text-slate-300 transition-all md:group-hover:-bottom-12'>
            <IconPhotoEdit size={16} />
          </div>
        )}
      </label>

      <Modal opened={cropModalOpen} onClose={resetFileInput} withCloseButton={false} size='lg' centered>
        {uploadedPhotoUrl && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              ref={imgRef}
              src={uploadedPhotoUrl}
              alt={t('common.avatar')}
              onLoad={onImageLoad}
              className='max-h-[70vh] w-full object-contain'
            />
          </ReactCrop>
        )}

        <div className='mt-3 flex items-center justify-end gap-x-3'>
          <Button variant='subtle' color='red' onClick={resetFileInput} disabled={imageLoading}>
            {t('common.cancel')}
          </Button>

          <Button
            color='teal'
            onClick={editUser}
            loading={imageLoading}
            disabled={!completedCrop || completedCrop.width <= 1 || completedCrop.height <= 1}
          >
            {t('common.save')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
