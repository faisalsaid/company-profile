'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  {
    value: 'id',
    label: 'ID',
    icon: <span className="flag-icon flag-icon-id rounded-[4px]" />,
  },
  {
    value: 'en',
    label: 'EN',
    icon: <span className="flag-icon flag-icon-us rounded-[4px]" />,
  },
];

interface LocaleSwitcherProps {
  currentLocale?: string; // optional
}

export function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const fallbackLocale = useLocale();

  const activeLocale = currentLocale || fallbackLocale;

  const handleChange = (value: string) => {
    // Replace locale di URL
    const segments = pathname.split('/');
    segments[1] = value; // Ganti locale di segmen pertama
    router.push(segments.join('/'));
  };

  const selectedLang = languages.find((lang) => lang.value === activeLocale);

  return (
    <Select onValueChange={handleChange} defaultValue={activeLocale}>
      <SelectTrigger>
        <SelectValue placeholder="Select language">
          <div className="flex items-center gap-2">
            {selectedLang?.icon}
            <span>{selectedLang?.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <div className="flex items-center gap-2">
              {lang.icon}
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
