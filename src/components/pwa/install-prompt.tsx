'use client';

import { PlusIcon, ShareIcon } from 'lucide-react';
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

export function InstallPrompt() {
	const [open, setOpen] = useState(false);
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
	const [showPrompt, setShowPrompt] = useState(false);

	useEffect(() => {
		// Check iOS and standalone mode
		setIsIOS(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
		);
		setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

		// Listen for beforeinstallprompt
		const handler = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e);
			setShowPrompt(true);
		};

		window.addEventListener('beforeinstallprompt', handler as EventListener);

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handler as EventListener,
			);
		};
	}, [open]);

	if (isStandalone) {
		return null; // Already installed
	}

	const handleInstallClick = async () => {
		if (!deferredPrompt) return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const promptEvent = deferredPrompt as any; // cast to access .prompt()

		promptEvent.prompt();

		const { outcome } = await promptEvent.userChoice;
		if (outcome === 'accepted') {
			toast.info('User accepted the install prompt');
			setOpen(false);
		} else {
			toast.info('User dismissed the install prompt');
		}

		setDeferredPrompt(null);
		setShowPrompt(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button variant="outline">Install App</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Install App</DialogTitle>
					<DialogDescription>
						Install this app for a better experience on your device.
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col justify-center space-y-4 sm:block">
					{isIOS ? (
						<div className="text-muted-foreground space-y-2 text-sm">
							<p>To install this app on iOS:</p>
							<ol className="list-inside list-decimal space-y-1">
								<li>
									<strong>
										Tap the
										<ShareIcon
											className="mx-1 inline h-4 w-4"
											aria-label="Share icon"
										/>
									</strong>
									Share button in Safari.
								</li>
								<li>
									Scroll down and tap
									<strong className="mx-1 inline-flex items-center gap-1">
										Add to Home Screen
										<PlusIcon
											className="inline h-4 w-4"
											aria-label="Plus icon"
										/>
									</strong>
									.
								</li>
								<li>
									Confirm by tapping <strong>Add</strong> on the top-right
									corner.
								</li>
							</ol>
						</div>
					) : showPrompt ? (
						<Button onClick={handleInstallClick}>Add to Home Screen</Button>
					) : (
						<p className="text-muted-foreground text-sm">
							You can install this app from your browser menu.
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
