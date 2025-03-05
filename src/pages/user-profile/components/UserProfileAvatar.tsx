import { ActionIcon, Avatar, CheckIcon, Tooltip } from '@mantine/core';
import { IconPhotoEdit, IconX } from '@tabler/icons-react';
import { ChangeEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '../../../redux/selectors';
import { postService } from '../../../services/posts';
import { toastService } from '../../../services/toast';
import { userService } from '../../../services/user';
import { User } from '../../../types';

interface ProfileAvatarProps {
  user: User | null;
  isCurrentUser: boolean;
}

export const UserProfileAvatar = ({ user, isCurrentUser }: ProfileAvatarProps) => {
  const loggedUser = useSelector(selectLoggedUser);

  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      toastService.error('File size exceeds 5MB limit!');
      resetFileInput();
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setUploadedPhoto(selectedFile);
    setUploadedPhotoUrl(objectUrl);
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadedPhoto(null);
    setUploadedPhotoUrl(null);
  };

  const editUser = () => {
    if (!uploadedPhoto) return;

    setImageLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(uploadedPhoto);

    reader.onload = () => {
      const photo = reader.result?.toString().replace('data:', '').replace(/^.+,/, '');

      if (!photo) {
        toastService.error('Failed to upload image');
        return;
      }

      if (!user) return;

      userService
        .editUser({
          ...user,
          photo
        })
        .then(() => {
          resetFileInput();
          toastService.success('Profile image updated successfully');
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
        style={{ pointerEvents: isCurrentUser ? 'auto' : 'none' }}
      >
        <Avatar
          key={user?.username}
          src={uploadedPhotoUrl || (isCurrentUser ? loggedUser?.photo : user?.photo)}
          size={80}
          name={user?.username}
          color='initials'
        >
          {user?.username[0].toUpperCase()}
        </Avatar>

        {!uploadedPhoto && isCurrentUser && (
          <div className='pointer-events-none absolute -bottom-20 left-1/2 flex h-full w-full -translate-x-1/2 items-start justify-center rounded-full bg-black bg-opacity-50 pt-1.5 text-slate-300 transition-all md:group-hover:-bottom-12'>
            <IconPhotoEdit size={16} />
          </div>
        )}
      </label>

      {uploadedPhoto && (
        <>
          <Tooltip withArrow label='Undo'>
            <ActionIcon
              className='absolute bottom-0 left-0 rounded-full'
              variant='default'
              size={20}
              type='button'
              disabled={imageLoading}
              onClick={resetFileInput}
            >
              <IconX size={14} />
            </ActionIcon>
          </Tooltip>

          <Tooltip withArrow label='Update'>
            <ActionIcon
              className='absolute bottom-0 right-0 rounded-full'
              variant='filled'
              color='#099268'
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
