'use client';

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
import { Input } from '@/components/ui/input';
import {
	checkNotificationPermission,
	NotificationPermissionStatus,
	requestNotificationPermission,
} from '@/lib/pwa/notifications';
import { getSWRegistration } from '@/lib/pwa/sw'; // ✅ use centralized logic
import { urlBase64ToUint8Array } from '@/lib/pwa/utils';
import {
	sendNotification,
	subscribeUser,
	unsubscribeUser,
} from '@/actions/push-notifications';

export function TestPushNotification() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null,
	);
	const [message, setMessage] = useState('');
	const [permission, setPermission] =
		useState<NotificationPermissionStatus>('default');

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
			setPermission(checkNotificationPermission());
			initPushState();
		}
	}, []);

	async function initPushState() {
		const registration = await getSWRegistration();
		if (!registration) return;

		const existingSub = await registration.pushManager.getSubscription();
		setSubscription(existingSub);
	}

	async function subscribeToPush() {
		const granted = await requestNotificationPermission();
		setPermission(checkNotificationPermission());

		if (!granted) {
			toast.warning('Push subscription requires notification permission.');
			return;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const sub = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(
					process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
				),
			});
			setSubscription(sub);
			const serializedSub = JSON.parse(JSON.stringify(sub));
			await subscribeUser(serializedSub);
			toast.success('Subscribed to push notifications.');
		} catch (err) {
			console.error('Push subscription failed:', err);
			toast.error('Failed to subscribe.');
		}
	}

	async function unsubscribeFromPush() {
		try {
			await subscription?.unsubscribe();
			setSubscription(null);
			await unsubscribeUser();
			toast.success('Unsubscribed from push notifications.');
		} catch (err) {
			console.error('Unsubscribe failed:', err);
			toast.error('Failed to unsubscribe.');
		}
	}

	async function sendTestNotification() {
		if (!subscription) return;
		await sendNotification(message);
		toast.success('Notification sent.');
		setMessage('');
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Manage Notifications</Button>
			</DialogTrigger>

			<DialogContent className="max-w-md">
				{isSupported ? (
					<>
						<DialogHeader>
							<DialogTitle>Push Notifications</DialogTitle>
						</DialogHeader>

						<div className="space-y-4">
							{subscription ? (
								<>
									<p>You are subscribed to push notifications.</p>
									<Input
										type="text"
										placeholder="Enter notification message"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
									<div className="flex flex-row-reverse justify-between">
										<Button onClick={sendTestNotification}>Send Test</Button>
										<Button
											variant="destructive"
											onClick={unsubscribeFromPush}
										>
											Unsubscribe
										</Button>
									</div>
								</>
							) : (
								<>
									{permission === 'denied' ? (
										<p className="text-sm text-red-500">
											Notifications are blocked. Enable them in your browser
											settings.
										</p>
									) : (
										<>
											<p>You are not subscribed to push notifications.</p>
											<Button onClick={subscribeToPush}>Subscribe</Button>
										</>
									)}
								</>
							)}
						</div>
					</>
				) : (
					<DialogHeader>
						<DialogTitle>Push Notifications</DialogTitle>
						<DialogDescription>
							Your browser does not support push notifications.
						</DialogDescription>
					</DialogHeader>
				)}
			</DialogContent>
		</Dialog>
	);
}
