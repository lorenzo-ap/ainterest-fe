import { ActionIcon, Divider, Text, Tooltip } from '@mantine/core';
import { IconFingerprint, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { usePasskeys } from '../../../queries';

type RevokeTarget = {
	credentialId: string;
	createdAt: string;
};

type PasskeysListProps = {
	onRevoke: (passkey: RevokeTarget) => void;
};

export const PasskeysList = ({ onRevoke }: PasskeysListProps) => {
	const { t } = useTranslation();
	const { data: passkeys } = usePasskeys();

	if (passkeys.length === 0) {
		return (
			<div className='overflow-hidden rounded-xl border border-color'>
				<div className='flex flex-col items-center justify-center bg-white/[0.01] px-4 py-8'>
					<IconFingerprint className='mb-2 opacity-20' size={32} stroke={1.5} />
					<Text c='dimmed' size='sm'>
						{t('pages.passkeys.no_passkeys')}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<div className='overflow-hidden rounded-xl border border-color'>
			{passkeys.map((pk, index) => (
				<Fragment key={pk.credentialId || crypto.randomUUID()}>
					<div className='group flex items-center justify-between bg-white/[0.01] p-3.5 transition-colors hover:bg-white/[0.03]'>
						<div className='flex items-center gap-3'>
							<div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400'>
								<IconFingerprint size={18} stroke={1.5} />
							</div>
							<div className='flex flex-col'>
								<Text className='font-medium' size='sm'>
									{pk.name} • <span className='font-mono opacity-50'>{pk.credentialId?.slice(0, 8) || 'Unknown'}</span>
								</Text>
								<Text c='dimmed' size='xs'>
									{t('pages.passkeys.created_at')}: {pk.createdAt ? format(new Date(pk.createdAt), 'PP') : '-'}
								</Text>
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<div className='flex flex-col items-end max-sm:hidden'>
								<Text c='dimmed' className='font-bold uppercase tracking-widest' size='10px'>
									{t('pages.passkeys.last_used')}
								</Text>
								<Text size='xs'>{pk.lastUsedAt ? format(new Date(pk.lastUsedAt), 'PP') : '-'}</Text>
							</div>
							<Tooltip label={t('pages.passkeys.revoke')} withArrow>
								<ActionIcon
									className='opacity-0 transition-opacity group-hover:opacity-100'
									color='red'
									onClick={() => onRevoke(pk)}
									size='md'
									variant='light'
								>
									<IconTrash size={16} stroke={1.5} />
								</ActionIcon>
							</Tooltip>
						</div>
					</div>
					{index < passkeys.length - 1 && <Divider />}
				</Fragment>
			))}
		</div>
	);
};
