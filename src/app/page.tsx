import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Counter } from '@/components/counter';
import { LocaleSwitcher } from '@/components/locale/switcher';
import { PushNotification } from '@/components/notification/push';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { ThemeSwitcher } from '@/components/theme/switcher';

export default async function Home() {
	const t = await getTranslations('Home');

	return (
		<>
			<div className="absolute flex w-screen justify-between gap-2 overflow-scroll p-4">
				<div className="flex gap-2">
					<Counter />
					<PushNotification />
					<InstallPrompt />
				</div>
				<div className="flex gap-2">
					<LocaleSwitcher />
					<ThemeSwitcher />
				</div>
			</div>
			<div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20">
				<main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
					<Image
						className="dark:invert"
						src="/next.svg"
						alt="Next.js logo"
						width={180}
						height={38}
						priority
					/>
					<ol className="list-inside list-decimal text-center font-mono text-sm/6 sm:text-left">
						<li className="mb-2 tracking-[-.01em]">
							{t('main.li.1')}{' '}
							<code className="rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]">
								src/app/page.tsx
							</code>
							.
						</li>
						<li className="tracking-[-.01em]">{t('main.li.2')}</li>
					</ol>

					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<a
							className="bg-foreground text-background flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]"
							href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								className="dark:invert"
								src="/vercel.svg"
								alt="Vercel logomark"
								width={20}
								height={20}
							/>
							{t('main.btn.1')}
						</a>
						<a
							className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
							href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							{t('main.btn.2')}
						</a>
					</div>
				</main>
				<footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4"
						href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							aria-hidden
							src="/file.svg"
							alt="File icon"
							width={16}
							height={16}
						/>
						{t('footer.1')}
					</a>
					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4"
						href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							aria-hidden
							src="/window.svg"
							alt="Window icon"
							width={16}
							height={16}
						/>
						{t('footer.2')}
					</a>
					<a
						className="flex items-center gap-2 hover:underline hover:underline-offset-4"
						href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							aria-hidden
							src="/globe.svg"
							alt="Globe icon"
							width={16}
							height={16}
						/>
						{t('footer.3')} →
					</a>
				</footer>
			</div>
		</>
	);
}
