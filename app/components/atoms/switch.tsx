import { Switch as AriaSwitch, SwitchProps } from 'react-aria-components';

export const Switch = ({
	className,
	...props
}: SwitchProps & React.RefAttributes<HTMLLabelElement>) => {
	return (
		<AriaSwitch className={[className, 'inline-block'].join(' ')} {...props}>
			{({ isSelected }) => (
				<div
					className={`box-content w-11 cursor-pointer rounded-full border border-white/20 bg-black duration-100 ${
						isSelected && 'bg-primary/90'
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
