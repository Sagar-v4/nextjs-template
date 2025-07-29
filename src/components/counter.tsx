'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useCounterStore } from '@/store/useCounterStore';

export function Counter() {
	const { counter, increment, decrement, reset } = useCounterStore();

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Open Counter</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Counter</DialogTitle>
					<DialogDescription>
						This counter uses Zustand for state management.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<Button onClick={increment}>+1</Button>
							{counter}
							<Button onClick={decrement}>-1</Button>
						</div>
						<div>
							<Button
								variant="destructive"
								onClick={reset}
							>
								Reset
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
