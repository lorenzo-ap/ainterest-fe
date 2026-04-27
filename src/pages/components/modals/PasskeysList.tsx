import { Divider, Text } from '@mantine/core';
import { IconFingerprintScan } from '@tabler/icons-react';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { usePasskeys } from '../../../queries';
import { PasskeyItem } from './PasskeyItem';

export const PasskeysList = () => {
	const { t } = useTranslation();
	const { data: passkeys } = usePasskeys();

	if (!passkeys.length) {
		return (
			<div className='overflow-hidden rounded-xl border border-color'>
				<div className='flex flex-col items-center justify-center bg-white/[0.01] px-4 py-4'>
					<IconFingerprintScan className='mb-2 opacity-20' size={48} stroke={1.5} />
					<Text c='dimmed' size='sm'>
						{t('pages.components.modals.passkeys_list.no_passkeys')}
					</Text>
				</div>
			</div>
		);
	}

	return (
		<div className='overflow-hidden rounded-xl border border-color'>
			{passkeys.map((pk, index) => (
				<Fragment key={pk.credentialId}>
					<PasskeyItem passkey={pk} />
					{index < passkeys.length - 1 && <Divider />}
				</Fragment>
			))}
		</div>
	);
};
