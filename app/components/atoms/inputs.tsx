import { ComponentProps } from 'react';
import { Switch as AriaSwitch, ToggleButton as AriaToggleButton } from 'react-aria-components';

interface ToggleButtonProps extends ComponentProps<typeof AriaToggleButton> {}

export const ToggleButton = ({ children, className, ...rest }: ToggleButtonProps) => {
	return (
		<AriaToggleButton
			{...rest}
			className={({ isSelected }) =>
				`relative flex aspect-square items-center justify-center p-2 outline-none before:absolute before:size-full before:rounded-md before:bg-white/20 before:duration-75 before:content-[''] ${isSelected ? 'before:scale-100' : 'before:scale-0'} ${className}`
			}
		>
			{children}
		</AriaToggleButton>
	);
};

interface SwitchProps extends ComponentProps<typeof AriaSwitch> {}

export const Switch = ({ className, ...props }: SwitchProps) => {
	return (
		<AriaSwitch className={`inline-block ${className}`} {...props}>
			{({ isSelected }) => (
				<div
					className={`box-content w-11 cursor-pointer rounded-full border border-white/20 bg-black duration-100 ${
						isSelected && 'bg-indigo-600'
					} `}
				>
					<div
						className={`size-6 scale-90 rounded-full bg-white duration-100 ${
							isSelected && 'translate-x-5'
						}`}
					></div>
				</div>
			)}
		</AriaSwitch>
	);
};
