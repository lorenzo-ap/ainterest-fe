import { useDisclosure } from '@mantine/hooks';
import { format, formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ConfirmModal } from '../../../components';
import { TrashIcon } from '../../../components/ui';
import { useRevokePasskey } from '../../../queries';
import { toastService } from '../../../services';
import type { PasskeyCredential } from '../../../types/passkeys';
import { getLocale } from '../../../utils';

type PasskeyItemProps = {
	passkey: PasskeyCredential;
};

export const PasskeyItem = ({ passkey }: PasskeyItemProps) => {
	const { t, i18n } = useTranslation();
	const locale = getLocale(i18n.language);

	const [opened, { open, close }] = useDisclosure(false);

	const { mutate: revokePasskey, isPending: isRevoking } = useRevokePasskey(passkey.credentialId, {
		onSuccess: () => {
			toastService.success(t('apis.passkeys.success_revoke'));
			close();
		}
	});

	const lastUsed = passkey.lastUsedAt
		? formatDistanceToNow(new Date(passkey.lastUsedAt), { addSuffix: true, locale })
		: t('pages.components.modals.passkey_item.never_used');

	return (
		<li className='group flex items-center justify-between gap-4 rounded-md bg-inset px-4 py-3.5 transition-colors hover:bg-hover'>
			<div className='min-w-0'>
				<p className='truncate font-medium text-[14px] text-ink'>{passkey.name}</p>
				<p className='mt-1 font-mono text-[11px] text-ink-3'>
					{passkey.createdAt && (
						<>
							{format(new Date(passkey.createdAt), 'd MMM yyyy', { locale })}
							<span className='mx-1.5 opacity-50'>·</span>
						</>
					)}
					{lastUsed}
				</p>
			</div>

			<button
				aria-label={t('pages.components.modals.passkey_item.revoke')}
				className='flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-ink-3 transition-colors hover:bg-danger-tint hover:text-danger md:opacity-0 md:group-hover:opacity-100'
				onClick={open}
				type='button'
			>
				<TrashIcon size={16} />
			</button>

			<ConfirmModal
				close={close}
				confirm={revokePasskey}
				isLoading={isRevoking}
				message={t('pages.components.modals.passkey_item.revoke_confirm')}
				opened={opened}
				title={t('pages.components.modals.passkey_item.revoke')}
			/>
		</li>
	);
};
