'use client';

import { useEffect, useState } from 'react';
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
	sendNotification,
	subscribeUser,
	unsubscribeUser,
} from '@/app/actions';

function urlBase64ToUint8Array(base64String: string) {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null,
	);
	const [message, setMessage] = useState('');

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register('/sw.js', {
			scope: '/',
			updateViaCache: 'none',
		});
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
	}

	async function subscribeToPush() {
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
	}

	async function unsubscribeFromPush() {
		await subscription?.unsubscribe();
		setSubscription(null);
		await unsubscribeUser();
	}

	async function sendTestNotification() {
		if (subscription) {
			await sendNotification(message);
			setMessage('');
		}
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
										<Button
											type="submit"
											onClick={sendTestNotification}
										>
											Send Test
										</Button>
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
									<p>You are not subscribed to push notifications.</p>
									<Button onClick={subscribeToPush}>Subscribe</Button>
								</>
							)}
						</div>
					</>
				) : (
					<>
						<DialogHeader>
							<DialogTitle>Push Notifications</DialogTitle>
							<DialogDescription>
								Your browser does not support push notifications.
							</DialogDescription>
						</DialogHeader>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
