import { Link } from '@remix-run/react';
import { FiMail } from 'react-icons/fi';
import { LuTwitter } from 'react-icons/lu';

export const Footer = () => {
	return (
		<footer className="flex h-fit w-full flex-wrap items-stretch justify-end gap-6 self-end bg-black/40 px-4 py-8 text-center text-white max-md:flex-col [&>*]:flex-grow [&>section]:shrink-0 [&_a:hover]:underline [&_h4]:text-neutral-400">
			<div className="text-xs">
				<header>&copy; Analytics App 2024. All rights reserved</header>
				<Link to="https://www.flaticon.com/free-icons/polar-bear" title="polar bear icons">
					Polar bear icon created by Freepik - Flaticon
				</Link>
			</div>
			<section>
				<h4 className="mb-2 font-semibold uppercase">Product</h4>
				<ul className="flex flex-col gap-2 text-sm font-normal">
					<li>
						<Link to="/faq" prefetch="intent">
							FAQ
						</Link>
					</li>
					<li>
						<Link to="/pricing" prefetch="intent">
							Pricing
						</Link>
					</li>
					<li>
						<Link to="/changelog" prefetch="intent">
							Changelog
						</Link>
					</li>
					{/* <li>
						<Link to="/feedback" prefetch="intent">
							Feedback
						</Link>
					</li> */}
				</ul>
			</section>
			<section>
				<h4 className="mb-2 font-semibold uppercase">Legal</h4>
				<ul className="flex flex-col gap-2 text-sm font-normal">
					<li>
						<Link to="/privacy-policy" prefetch="intent">
							Privacy Policy
						</Link>
					</li>
					<li>
						<Link to="/terms-of-service" prefetch="intent">
							Terms of Service
						</Link>
					</li>
				</ul>
			</section>
			<section>
				<h4 className="mb-2 font-semibold uppercase">Contact Us</h4>
				<ul className="flex items-center justify-center gap-2 text-center text-sm font-normal [&_li]:w-fit">
					<li className="rounded-full p-2 ring-1 hover:bg-white hover:text-black">
						<Link to="mailto:abc@gmail.com" aria-label="Email">
							<FiMail />
						</Link>
					</li>
					<li className="group box-content rounded-full p-2 ring-1 hover:bg-white hover:text-black">
						<Link to="/" aria-label="Twitter account">
							<LuTwitter />
						</Link>
					</li>
				</ul>
			</section>
		</footer>
	);
};
