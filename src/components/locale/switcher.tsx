'use client';

import { LanguagesIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useTransition } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Locale, locales } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';

interface Props {
	className?: string;
}

export function LocaleSwitcher({ className }: Props) {
	const locale = useLocale();
	const [isPending, startTransition] = useTransition();
	const t = useTranslations('LocaleSwitcher');

	function onChange(value: string) {
		const locale = value as Locale;
		startTransition(() => {
			setUserLocale(locale);
		});
	}

	const items = useMemo(
		() =>
			locales.map((locale) => {
				return {
					value: locale,
					label: t(locale),
				};
			}),
		[t],
	);

	return (
		<Select
			defaultValue={locale}
			onValueChange={onChange}
		>
			<SelectTrigger
				disabled={isPending}
				className={cn(className)}
			>
				<LanguagesIcon className="text-none size-4" />
			</SelectTrigger>
			<SelectContent
				align="end"
				className="min-w-[8rem] shadow-md"
				position="popper"
			>
				{items.map(({ label, value }) => (
					<SelectItem
						key={value}
						value={value}
					>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
