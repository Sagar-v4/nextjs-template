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
import { requestNotificationPermission } from '@/permissions/notifications';

export function PushNotification() {
	const [count, setCount] = useState(0);
	const [message, setMessage] = useState('');
	const [isNotificationSupported, setIsNotificationSupported] = useState(false);

	useEffect(() => {
		const onLoad = () => {
			const reqNotification = requestNotificationPermission();
			if (!reqNotification) return;
			setIsNotificationSupported(true);
		};

		onLoad();
	}, []);

	useEffect(() => {
		if (isNotificationSupported) {
			navigator?.setAppBadge(count);
		}
	}, [count, isNotificationSupported]);

	const sendTestNotification = async () => {
		if (!message.trim()) {
			toast.warning('Please enter a message to send.');
			return;
		}

		try {
			const registration = await navigator.serviceWorker?.ready;
			if (!registration) {
				toast.error('Registration not found!.');
				return;
			}
			const result = await fetch('https://randomuser.me/api/?inc=name,picture')
				.then((response) => response.json())
				.then((data) => data.results[0]);

			const title = `${result.name.first} ${result.name.last}`;
			const options: NotificationOptions = {
				body: `${message}`,
				icon: result.picture.thumbnail,
				// actions: [
				// 	{
				// 		action: 'open',
				// 		title: 'Open the app',
				// 	},
				// ],
			};

			toast.success('Notification sent.');
			await registration.showNotification(title, options);

			setMessage('');
			setCount(count + 1);
		} catch (err) {
			toast.error('Failed to send notification.', {
				description: String(err),
			});
		}
	};

	const clearNotifications = async () => {
		// clear app badge
		navigator.clearAppBadge();
		setCount(0);

		// close notifcations (where supported)
		const registration = await navigator.serviceWorker.ready;
		await registration?.getNotifications().then((notifications) => {
			notifications.forEach((notification) => notification.close());
		});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Manage Notifications</Button>
			</DialogTrigger>

			<DialogContent>
				{isNotificationSupported ? (
					<>
						<DialogHeader>
							<DialogTitle>Push Notifications</DialogTitle>
						</DialogHeader>

						<DialogDescription>
							Your browser support push notifications.
						</DialogDescription>
						<Input
							type="text"
							placeholder="Enter notification message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<div className="flex justify-between">
							<Button
								variant="outline"
								onClick={clearNotifications}
							>
								Clear Notifications
							</Button>
							<Button onClick={sendTestNotification}>Send</Button>
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
