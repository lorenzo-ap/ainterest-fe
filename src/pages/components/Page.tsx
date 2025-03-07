import { PropsWithChildren, useEffect } from 'react';

interface PageProps extends PropsWithChildren {
  title: string;
}

export const Page = (props: PageProps) => {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return props.children;
};
