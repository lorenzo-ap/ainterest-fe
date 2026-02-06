import { ActionIcon, Modal } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

type PostImageModalProps = {
	opened: boolean;
	image: string;
	alt: string;
	close: () => void;
};

export const PostImageModal = (props: PostImageModalProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			centered
			onClose={props.close}
			opened={props.opened}
			padding={0}
			radius='md'
			size='xl'
			withCloseButton={false}
		>
			<ActionIcon
				aria-label={t('common.close')}
				className='absolute top-4 right-4'
				onClick={props.close}
				size={24}
				variant='default'
			>
				<IconX size={22} />
			</ActionIcon>

			<img alt={props.alt} className='w-full' src={props.image} />
		</Modal>
	);
};
