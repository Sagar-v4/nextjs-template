'use client';

import { LaptopMinimalIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const themes = [
	{ value: 'light', label: 'Light', icon: SunIcon },
	{ value: 'dark', label: 'Dark', icon: MoonIcon },
	{ value: 'system', label: 'System', icon: LaptopMinimalIcon },
] as const;

// export type Theme = (typeof themes)[number]['value'];

interface Props {
	className?: string;
}

export function ThemeSwitcher({ className }: Props) {
	const { setTheme, theme } = useTheme();
	const [, startTransition] = useTransition();
	const [mounted, setMounted] = useState(false);
	const t = useTranslations('ThemeSwitcher');

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const CurrentIcon =
		themes.find(({ value }) => value === theme)?.icon || LaptopMinimalIcon;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={cn('flex items-center', className)}
				>
					<CurrentIcon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent
					className="min-w-[8rem] space-y-1 shadow-md"
					align="end"
				>
					{themes.map(({ value, label, icon: Icon }) => (
						<DropdownMenuItem
							key={value}
							className={cn('h-8 w-full justify-start', {
								'bg-muted': theme === value,
							})}
							onClick={() => startTransition(() => setTheme(value))}
						>
							<Icon className="size-4" />
							<span>{t(label)}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
