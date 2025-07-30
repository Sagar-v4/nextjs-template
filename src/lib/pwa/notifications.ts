import { toast } from 'sonner';

export type NotificationPermissionStatus =
	| NotificationPermission
	| 'unsupported';

export function checkNotificationPermission(): NotificationPermissionStatus {
	if (typeof Notification === 'undefined') {
		return 'unsupported';
	}
	return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
	if (typeof Notification === 'undefined') {
		toast.error('Notifications are not supported in this browser.');
		return false;
	}

	if (Notification.permission === 'granted') {
		return true;
	}

	if (Notification.permission === 'denied') {
		toast.warning(
			'Notifications have been blocked. Enable them in your browser settings.',
		);
		return false;
	}

	const result = await Notification.requestPermission();

	if (result === 'granted') {
		toast.success('Notification permission granted.');
		return true;
	} else if (result === 'denied') {
		toast.warning('Notification permission denied.');
		return false;
	} else {
		toast.info('Notification permission dismissed.');
		return false;
	}
}
