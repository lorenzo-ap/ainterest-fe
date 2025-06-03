import { ActionIcon, Avatar, Loader, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowsMaximize,
  IconCircleXFilled,
  IconHeart,
  IconHeartFilled,
  IconInfoCircle,
  IconPhotoDown,
  IconTrash
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectLoggedUser } from '../redux/selectors';
import { postService } from '../services/posts';
import { toastService } from '../services/toast';
import { Post, UserRole } from '../types';
import { downloadImage, generateIdFromString } from '../utils';
import { PostImageModal } from './PostImageModal';

export const PostCard = (props: Post) => {
  const { t } = useTranslation();
  const location = useLocation();
  const loggedUser = useSelector(selectLoggedUser);

  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletePostLoading, setDeletePostLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [profileUsername, setProfileUsername] = useState<string>('');
  const [postImageModalOpened, { open: openPostImageModal, close: closePostImageModal }] = useDisclosure(false);

  useEffect(() => {
    setProfileUsername(location.pathname.split('/').reverse()[0]);
  }, [location.pathname]);

  const deletePost = (postId: string) => {
    setDeletePostLoading(true);

    postService.deletePost(postId).finally(() => {
      setDeletePostLoading(false);
      toastService.success(t('apis.post.delete'));
    });
  };

  return (
    <>
      <div
        className='border-color card group relative aspect-square overflow-y-hidden rounded-xl border shadow-card'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='relative h-full w-full'>
          {loading && (
            <div className='absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-black/15'>
              <Loader color='white' size='xl' />
            </div>
          )}

          {!loading && (
            <div
              className={`${showInfo ? 'opacity-100' : 'md:group-hover:opacity-100'} absolute inset-0 z-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-700`}
            />
          )}

          <img
            className={`h-auto w-full rounded-xl object-cover ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            src={props.photo}
            alt={props.prompt}
            loading='lazy'
            onLoad={() => {
              setLoading(false);
            }}
          />
        </div>

        {!loading && (
          <>
            <ActionIcon
              className='absolute right-3 top-3 z-10 md:hidden'
              variant='transparent'
              size={40}
              onClick={() => {
                setShowInfo((prev) => !prev);
              }}
              aria-label={t('a11y.toggle_info')}
              tabIndex={showInfo ? 0 : -1}
            >
              {showInfo ? (
                <IconCircleXFilled className='text-slate-300' size={40} />
              ) : (
                <IconInfoCircle className='text-slate-300' size={40} />
              )}
            </ActionIcon>

            <div
              className={`absolute flex max-h-[75%] flex-col md:-bottom-full md:group-hover:bottom-0 ${showInfo ? '-bottom-0' : '-bottom-full'} left-0 right-0 m-2 rounded-md bg-[#10131F] p-4 transition-all duration-500`}
            >
              <div className='flex flex-col items-start justify-between gap-y-1.5'>
                <div className='flex items-center justify-between self-stretch'>
                  <Text className='text-xs text-slate-300'>
                    {new Date(props.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: false
                    })}
                  </Text>

                  <div className='flex gap-1'>
                    <Tooltip label={t('components.post_card.maximize_image')} withArrow>
                      <ActionIcon
                        className='max-md:hidden'
                        variant='transparent'
                        size={18}
                        onClick={openPostImageModal}
                        aria-label={t('components.post_card.maximize_image')}
                        tabIndex={isHovered || showInfo ? 0 : -1}
                      >
                        <IconArrowsMaximize className='text-slate-400' size={18} />
                      </ActionIcon>
                    </Tooltip>

                    <Tooltip label={t('components.post_card.download_image')} withArrow>
                      <ActionIcon
                        variant='transparent'
                        p={0}
                        size={18}
                        onClick={() => {
                          downloadImage(generateIdFromString(props.prompt), props.photo, props.user.username);
                        }}
                        aria-label={t('components.post_card.download_image')}
                        tabIndex={isHovered || showInfo ? 0 : -1}
                      >
                        <IconPhotoDown className='text-slate-400' size={18} />
                      </ActionIcon>
                    </Tooltip>

                    {(loggedUser?.role === UserRole.ADMIN || props.user._id === loggedUser?._id) && (
                      <Tooltip label={t('components.post_card.delete_post')} withArrow>
                        <ActionIcon
                          variant='transparent'
                          p={0}
                          size={18}
                          loading={deletePostLoading}
                          loaderProps={{ color: 'white' }}
                          onClick={() => {
                            deletePost(props._id);
                          }}
                          aria-label={t('components.post_card.delete_post')}
                          tabIndex={isHovered || showInfo ? 0 : -1}
                        >
                          <IconTrash className='text-red-400' size={18} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </div>
                </div>

                <Text
                  className='prompt max-h-[100px] overflow-y-scroll pr-0.5 text-white max-lg:text-sm'
                  tabIndex={isHovered || showInfo ? 0 : -1}
                >
                  {props.prompt}
                </Text>
              </div>

              <div className='mt-2.5 flex items-center justify-between'>
                <Link
                  className='flex items-center gap-x-1.5 hover:opacity-85'
                  to={`/account/${props.user.username}`}
                  state={props.user}
                  style={{ pointerEvents: profileUsername === props.user.username ? 'none' : 'auto' }}
                  tabIndex={isHovered || showInfo ? 0 : -1}
                >
                  <Avatar
                    key={props.user.username}
                    src={props.user.photo}
                    name={props.user.username}
                    color='initials'
                    size={30}
                  >
                    {props.user.username[0].toUpperCase()}
                  </Avatar>
                  <Text className='text-sm text-white'>{props.user.username}</Text>
                </Link>

                <div className='flex items-center gap-x-2'>
                  <div className='flex items-center gap-x-1'>
                    <ActionIcon
                      variant='transparent'
                      onClick={() => {
                        postService.reactToPost(props._id, loggedUser?._id || '');
                      }}
                      aria-label={t(
                        props.likes.includes(loggedUser?._id ?? '')
                          ? 'components.post_card.unlike_post'
                          : 'components.post_card.like_post'
                      )}
                      className={!loggedUser ? 'pointer-events-none' : ''}
                      tabIndex={isHovered || showInfo ? 0 : -1}
                    >
                      {props.likes.includes(loggedUser?._id ?? '') ? (
                        <IconHeartFilled className='text-slate-300' size={24} color='firebrick' />
                      ) : (
                        <IconHeart className='text-slate-300' size={24} />
                      )}
                    </ActionIcon>

                    {props.likes.length > 0 && <Text className='text-sm text-white'>{props.likes.length}</Text>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <PostImageModal
        opened={postImageModalOpened}
        image={props.photo}
        alt={props.prompt}
        close={closePostImageModal}
      />
    </>
  );
};
