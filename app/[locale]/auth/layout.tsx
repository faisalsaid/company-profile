import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import React from 'react';

const AuthLayout = async (props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params; // <-- Wajib await di Next 15

  return (
    <div>
      <div className="ml-auto w-fit p-4">
        <LocaleSwitcher currentLocale={locale} />
      </div>
      <div className="flex items-center justify-center min-h-svh">
        {props.children}
      </div>
    </div>
  );
};

export default AuthLayout;
