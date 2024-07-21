import { PropsWithChildren, useEffect } from 'react';

interface PageProps extends PropsWithChildren {
  title: string;
}

const Page = ({ title, children }: PageProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return children;
};

export default Page;
