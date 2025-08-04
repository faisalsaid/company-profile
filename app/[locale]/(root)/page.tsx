import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <span className="flag-icon flag-icon-id" /> Indonesia
      <span className="flag-icon flag-icon-us" /> USA
      <h1>{t('title')}</h1>;
    </div>
  );
}
