import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import React from 'react';

const AuthLayout = async (props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params; // <-- Wajib await di Next 15

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="ml-auto w-fit p-4">
        <LocaleSwitcher currentLocale={locale} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        {props.children}
      </div>
    </div>
  );
};

export default AuthLayout;
