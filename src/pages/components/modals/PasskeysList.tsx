import { useTranslation } from 'react-i18next';
import { usePasskeys } from '../../../queries';
import { PasskeyItem } from './PasskeyItem';

export const PasskeysList = () => {
	const { t } = useTranslation();
	const { data: passkeys } = usePasskeys();

	if (!passkeys.length) {
		return (
			<div className='rounded-md bg-inset px-6 py-10 text-center'>
				<p className='text-[14px] text-ink-3'>{t('pages.components.modals.passkeys_list.no_passkeys')}</p>
			</div>
		);
	}

	return (
		<ul className='flex flex-col gap-2'>
			{passkeys.map((passkey) => (
				<PasskeyItem key={passkey.credentialId} passkey={passkey} />
			))}
		</ul>
	);
};
