import { useId, useState } from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';

interface AccordionItemProps {
	title: string;
	description: string;
}

export const AccordionItem = ({ title, description }: AccordionItemProps) => {
	const id = useId();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			aria-expanded={isOpen}
			aria-labelledby={`title-${id}`}
			className="w-full max-w-[65ch] px-4 py-8"
		>
			<button
				onClick={() => setIsOpen((val) => !val)}
				className="flex w-full items-center justify-between text-start text-xl font-semibold"
			>
				<header id={`title-${id}`} aria-describedby={`description-${id}`}>
					{title}
				</header>
				<IoChevronDownOutline
					height={24}
					width={24}
					className={`shrink-0 duration-150 ${isOpen && 'rotate-180'}`}
				/>
			</button>
			<div
				aria-hidden={!isOpen}
				className={`grid ${
					isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
				} duration-150`}
			>
				<div className="overflow-hidden">
					<p id={`description-${id}`} className="pt-4">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
};
