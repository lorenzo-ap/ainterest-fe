import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GallerySkeleton, QueryBoundary } from '../../components';
import { ProfileGallery, ProfileHeader, ProfileHeaderSkeleton } from './components';

export const UserProfilePage = () => {
	const params = useParams<{ username: string }>();
	const navigate = useNavigate();

	// biome-ignore lint: Intentional scroll to top when profile page changes
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [params.username]);

	if (!params.username) {
		navigate('/');
		return;
	}

	return (
		<QueryBoundary
			key={params.username}
			loading={
				<>
					<ProfileHeaderSkeleton />
					<div className='mx-auto max-w-gallery px-5 pt-6 pb-24 sm:px-8'>
						<GallerySkeleton />
					</div>
				</>
			}
		>
			<ProfileHeader username={params.username} />
			<ProfileGallery username={params.username} />
		</QueryBoundary>
	);
};
