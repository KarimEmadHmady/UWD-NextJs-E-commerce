import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/components/common/Navbar/Navbar';
import ReduxProvider from '@/redux/ReduxProvider';
import NotificationContainer from '@/components/common/NotificationContainer';
import GlobalLoadingOverlay from '@/components/common/GlobalLoadingOverlay';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          <GlobalLoadingOverlay />
          <NotificationContainer />
          <NextIntlClientProvider>
            <Navbar />
            {children}
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}