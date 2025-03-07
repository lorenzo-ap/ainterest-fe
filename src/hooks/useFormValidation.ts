import { UseFormReturnType } from '@mantine/form';
import { i18n } from 'i18next';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormValidation = (form: UseFormReturnType<any>, i18n: i18n) => {
  useEffect(() => {
    if (!Object.keys(form.errors).length) return;
    form.validate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);
};
