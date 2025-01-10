import { ActionIcon, Avatar, CheckIcon, Tooltip } from '@mantine/core';
import { IconPhotoEdit, IconX } from '@tabler/icons-react';
import { ChangeEvent, useState } from 'react';
import { postService } from '../../../../services/post';
import { toastService } from '../../../../services/toast';
import { userService } from '../../../../services/user';
import { User } from '../../../../types/user.interface';

interface ProfileAvatarProps {
  user: User | null;
  stateUser: User;
  isCurrentUser: boolean;
}

const ProfileAvatar = ({ user, stateUser, isCurrentUser }: ProfileAvatarProps) => {
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);

    setUploadedPhoto(selectedFile);
    setUploadedPhotoUrl(objectUrl);
  };

  const editUser = () => {
    if (!uploadedPhoto) return;

    setImageLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(uploadedPhoto);

    reader.onload = () => {
      const base64String = reader.result?.toString().replace('data:', '').replace(/^.+,/, '');

      userService
        .editUser({
          ...stateUser,
          photo: base64String || stateUser.photo
        })
        .then(() => {
          setUploadedPhoto(null);
          setUploadedPhotoUrl(null);

          toastService.success('Profile image updated successfully');

          postService.getPosts();
        })
        .finally(() => {
          setImageLoading(false);
        });
    };
  };

  return (
    <div className='group relative rounded-full border border-slate-600'>
      <input id='uploadImage' className='hidden' type='file' onChange={handleFileUpload} accept='image/*' />

      <label
        className='relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full'
        htmlFor='uploadImage'
        style={{ pointerEvents: isCurrentUser ? 'auto' : 'none' }}
      >
        <Avatar
          key={stateUser.username}
          src={uploadedPhotoUrl || (isCurrentUser ? user?.photo : stateUser.photo)}
          size={80}
          name={stateUser.username}
          color='initials'
        >
          {stateUser.username[0].toUpperCase()}
        </Avatar>

        {!uploadedPhoto && isCurrentUser && (
          <div className='pointer-events-none absolute -bottom-20 left-1/2 flex h-full w-full -translate-x-1/2 items-start justify-center rounded-full bg-black bg-opacity-50 pt-1.5 transition-all group-hover:-bottom-12'>
            <IconPhotoEdit size={16} />
          </div>
        )}
      </label>

      {uploadedPhoto && (
        <>
          <Tooltip withArrow label='Remove image'>
            <ActionIcon
              className='absolute bottom-0 left-0 rounded-full'
              variant='default'
              size={20}
              type='button'
              onClick={() => {
                setUploadedPhoto(null);
                setUploadedPhotoUrl(null);
              }}
            >
              <IconX size={14} />
            </ActionIcon>
          </Tooltip>

          <Tooltip withArrow label='Save image'>
            <ActionIcon
              className='absolute bottom-0 right-0 rounded-full'
              variant='default'
              size={20}
              type='button'
              loading={imageLoading}
              onClick={editUser}
            >
              <CheckIcon size={10} />
            </ActionIcon>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;
