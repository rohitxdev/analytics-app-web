import { AccordionItem } from '~/components/atoms/accordion-item';

export default function Route() {
	return (
		<div className="mb-8 grid content-start justify-items-center gap-12">
			<h1 className="mt-10 text-4xl font-bold">FAQ</h1>
			<div className="flex flex-col items-center gap-4">
				<ul className="flex flex-col divide-y divide-white px-4">
					<AccordionItem
						title="What is the pricing?"
						description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, minus eveniet? Sequi adipisci id, alias optio corporis voluptatibus nisi possimus eaque maiores necessitatibus non animi fugit perspiciatis pariatur repellat accusantium?"
					/>

					<AccordionItem
						title="How long is the data stored?"
						description="The analytical data is stored on our servers for 5 years but you can export the data anytime"
					/>
					<AccordionItem
						title="How would I get notified if my website goes down?"
						description="You can choose to have email, SMS, and even Slack/Discord notifications"
					/>
					<AccordionItem title="What's your favourite anime?" description="Attack on Titan" />
				</ul>
			</div>
		</div>
	);
}
