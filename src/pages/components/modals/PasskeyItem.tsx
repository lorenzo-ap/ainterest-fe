import { ActionIcon, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFingerprintScan, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../components';
import { useRevokePasskey } from '../../../queries';
import { toastService } from '../../../services';
import type { PasskeyCredential } from '../../../types/passkeys';

type PasskeyItemProps = {
	passkey: PasskeyCredential;
};

export const PasskeyItem = ({ passkey }: PasskeyItemProps) => {
	const { t } = useTranslation();

	const [opened, { open, close }] = useDisclosure(false);

	const { mutate: revokePasskey, isPending: isRevoking } = useRevokePasskey(passkey.credentialId, {
		onSuccess: () => {
			toastService.success(t('apis.passkeys.success_revoke'));
			close();
		}
	});

	return (
		<>
			<div className='group flex items-center justify-between bg-white/[0.01] p-3.5 transition-colors hover:bg-white/[0.03]'>
				<div className='flex items-center gap-3'>
					<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400'>
						<IconFingerprintScan size={24} stroke={1.5} />
					</div>
					<div className='flex flex-col'>
						<Text className='font-medium' size='sm'>
							{passkey.name} •{' '}
							<span className='font-mono opacity-50'>{passkey.credentialId?.slice(0, 8) || 'Unknown'}</span>
						</Text>
						<Text c='dimmed' size='xs'>
							{t('pages.components.modals.passkey_item.created_at')}:{' '}
							{passkey.createdAt ? format(new Date(passkey.createdAt), 'PP') : '-'}
						</Text>
					</div>
				</div>

				<div className='flex items-center gap-4'>
					<div className='flex flex-col items-end max-sm:hidden'>
						<Text c='dimmed' className='font-bold uppercase tracking-widest' size='10px'>
							{t('pages.components.modals.passkey_item.last_used')}
						</Text>
						<Text size='xs'>{passkey.lastUsedAt ? format(new Date(passkey.lastUsedAt), 'PP') : '-'}</Text>
					</div>
					<Tooltip label={t('pages.components.modals.passkey_item.revoke')} withArrow>
						<ActionIcon
							className='opacity-0 transition-opacity group-hover:opacity-100'
							color='red'
							onClick={open}
							size='md'
							variant='light'
						>
							<IconTrash size={16} stroke={1.5} />
						</ActionIcon>
					</Tooltip>
				</div>
			</div>

			<ConfirmModal
				close={close}
				confirm={revokePasskey}
				isLoading={isRevoking}
				message={t('pages.components.modals.passkey_item.revoke_confirm')}
				opened={opened}
				title={t('pages.components.modals.passkey_item.revoke')}
			/>
		</>
	);
};
