import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { RegisterServiceWorker } from '@/components/register-sw';
import { ThemeProvider } from '@/components/theme/provider';
import { Toaster } from '@/components/ui/sonner';
import { geistMono, geistSans } from '@/lib/fonts';
import '@/styles/globals.css';

export { metadata, viewport } from '@/meta/root';

interface Props {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: Readonly<Props>) {
	const locale = await getLocale();
	return (
		<html
			lang={locale}
			suppressHydrationWarning
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NextIntlClientProvider>
					<RegisterServiceWorker />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster richColors />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
