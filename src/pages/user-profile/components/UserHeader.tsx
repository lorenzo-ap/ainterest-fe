import { Badge, Button, Skeleton, Text, Title } from '@mantine/core';
import { IconArrowRight, IconPhotoAi } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCurrentUser, useUserByUsername } from '../../../queries';
import { UserRole } from '../../../types';
import { UserAvatar } from '.';

export const UserHeaderSkeleton = () => (
	<div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
		<div className='flex items-center gap-x-3'>
			<Skeleton circle height={82} />

			<div className='space-y-2'>
				<Skeleton height={24} radius='sm' width={150} />
				<Skeleton height={16} radius='sm' width={200} />
			</div>
		</div>
	</div>
);

type UserHeaderProps = {
	username: string;
};

export const UserHeader = ({ username }: UserHeaderProps) => {
	const { t } = useTranslation();

	const { data: currentUser } = useCurrentUser();
	const { data: user } = useUserByUsername(username);

	const isCurrentUser = currentUser?.username === username;

	useEffect(() => {
		document.title = username;
	}, [username]);

	return (
		<div className='mb-5 flex flex-wrap items-center justify-between gap-y-5'>
			<div className='flex items-center gap-x-3'>
				<UserAvatar isCurrentUser={isCurrentUser} user={user} />

				<div>
					<div className='flex items-center gap-2'>
						<Title>{user.username}</Title>

						{user.role === UserRole.ADMIN && (
							<Badge className='font-semibold uppercase' color='violet' radius='xl' size='md' variant='light'>
								Admin
							</Badge>
						)}
					</div>

					<Text opacity={0.5}>{user.email}</Text>
				</div>
			</div>

			{isCurrentUser && (
				<div className='flex gap-x-3 max-md:w-full'>
					<Button
						className='transition-opacity duration-75 hover:opacity-90 max-md:w-full'
						component={Link}
						gradient={{ from: 'violet', to: 'blue', deg: 90 }}
						leftSection={<IconPhotoAi size={20} />}
						rightSection={<IconArrowRight size={20} />}
						size='lg'
						to='/generate-image'
						variant='gradient'
					>
						{t('pages.user_profile.generate_image')}
					</Button>
				</div>
			)}
		</div>
	);
};
