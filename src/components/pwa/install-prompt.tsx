'use client';

import { ShareIcon, SquarePlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function InstallPrompt() {
	const [open, setOpen] = useState(false);
	const [isSafari, setIsSafari] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const userAgent = window.navigator.userAgent;
		const isSafariBrowser =
			/Safari/.test(userAgent) &&
			!/Chrome|Chromium|CriOS|FxiOS|EdgiOS|Edg|OPR|Opera/.test(userAgent);

		setIsSafari(isSafariBrowser);

		const isInStandaloneMode =
			window.matchMedia('(display-mode: standalone)').matches ||
			// @ts-expect-error safari-specific
			navigator.standalone === true;

		setIsStandalone(isInStandaloneMode);

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setOpen(true); // Open dialog (for all non-installed cases)
		};

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt,
			);
		};
	}, []);

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		deferredPrompt.prompt();

		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			toast.success('App installation accepted');
		} else {
			toast.info('App installation dismissed');
		}

		setDeferredPrompt(null);
		setOpen(false);
	};

	if (isStandalone) return null;

	return (
		<>
			{deferredPrompt ? (
				<Button
					onClick={handleInstallClick}
					variant="outline"
				>
					Install
				</Button>
			) : (
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<DialogTrigger asChild>
						<Button variant="outline">Install</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Install</DialogTitle>
							<DialogDescription>
								Install this app for a better experience on your device.
							</DialogDescription>
						</DialogHeader>

						{isSafari ? (
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>To install this app on Safari:</p>
								<ol className="list-inside list-decimal space-y-1">
									<li>
										Tap the
										<strong className="mx-1 inline-flex items-center">
											Share button
											<ShareIcon
												className="mx-1 inline size-4"
												aria-label="Share icon"
											/>
										</strong>
									</li>
									<li>
										Scroll down and tap
										<strong className="mx-1 inline-flex items-center">
											Add to Home Screen
											<SquarePlusIcon
												className="mx-1 inline size-4"
												aria-label="Square Plus icon"
											/>
										</strong>
									</li>
									<li>
										Tap <strong>Add</strong> in the top-right corner.
									</li>
								</ol>
							</div>
						) : (
							<p className="text-muted-foreground text-sm">
								This app can be installed from your browser menu.
							</p>
						)}
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
