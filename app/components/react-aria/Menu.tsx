import { Check } from 'lucide-react';
import {
	composeRenderProps,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuItemProps,
	MenuProps as AriaMenuProps,
	Separator,
	SeparatorProps,
} from 'react-aria-components';

import { dropdownItemStyles, DropdownSection, DropdownSectionProps } from './ListBox';
import { Popover, PopoverProps } from './Popover';

interface MenuProps<T> extends AriaMenuProps<T> {
	placement?: PopoverProps['placement'];
}

export function Menu<T extends object>(props: MenuProps<T>) {
	return (
		<Popover placement={props.placement} className="min-w-[150px]">
			<AriaMenu
				{...props}
				className="max-h-[inherit] overflow-auto p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_.75rem)]"
			/>
		</Popover>
	);
}

export function MenuItem(props: MenuItemProps) {
	return (
		<AriaMenuItem {...props} className={dropdownItemStyles}>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected }) => (
				<>
					{selectionMode !== 'none' && (
						<span className="flex w-4 items-center">
							{isSelected && <Check aria-hidden className="h-4 w-4" />}
						</span>
					)}
					<span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-semibold">
						{children}
					</span>
				</>
			))}
		</AriaMenuItem>
	);
}

export function MenuSeparator(props: SeparatorProps) {
	return (
		<Separator {...props} className="mx-3 my-1 border-b border-gray-300 dark:border-zinc-700" />
	);
}

export function MenuSection<T extends object>(props: DropdownSectionProps<T>) {
	return <DropdownSection {...props} />;
}
