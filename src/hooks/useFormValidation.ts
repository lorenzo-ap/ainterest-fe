import type { UseFormReturnType } from '@mantine/form';
import type { i18n } from 'i18next';
import { useEffect } from 'react';

export const useFormValidation = <TValues>(form: UseFormReturnType<TValues>, i18n: i18n) => {
	// biome-ignore lint: Intentional re-validation on language change
	useEffect(() => {
		if (!Object.keys(form.errors).length) return;
		form.validate();
	}, [i18n.language]);
};
