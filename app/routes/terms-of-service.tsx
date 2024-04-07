import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
	{
		title: 'Privacy Policy',
	},
];

export default function Route() {
	return (
		<div className="mb-8 flex flex-col gap-6">
			<h2 className="mt-10 text-center text-4xl font-bold">Terms of Service</h2>
			<p className="text-balance px-4 text-sm">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis quaerat nam dolore quos
				sit officia exercitationem sequi autem cupiditate inventore expedita perspiciatis recusandae
				pariatur aspernatur doloribus magni aut esse, sunt dicta minima voluptatum ducimus ipsum?
				Qui dolorum, cupiditate animi minus necessitatibus quibusdam nesciunt. Modi autem quas at
				sequi blanditiis! Itaque asperiores labore mollitia dolorem hic omnis delectus, libero, a
				possimus amet sit doloribus iste autem reiciendis similique dicta laudantium est deleniti,
				perferendis nobis ad. Harum quibusdam nemo praesentium accusamus, saepe architecto dicta
				ipsa veniam blanditiis, incidunt nihil autem, molestiae itaque impedit. Obcaecati doloremque
				doloribus quas quibusdam deleniti nostrum repudiandae placeat cupiditate id accusamus error
				amet modi quia perspiciatis dolore corporis saepe, voluptate, a reprehenderit temporibus?
				Doloribus ex qui iste suscipit aut asperiores velit deserunt laudantium consequatur atque
				nam distinctio quas, debitis in non consectetur, beatae illum voluptatem quo iure dicta
				nesciunt maxime molestias! Provident excepturi fugiat tempora deleniti molestias repellendus
				ipsa, sit nemo at aliquam dolorem autem exercitationem iste totam nisi magnam amet minima
				explicabo perspiciatis, a facilis dolorum? Veritatis quaerat maxime iste magni deserunt
				necessitatibus, quam in illum id tempore soluta natus a temporibus excepturi eaque officia
				porro maiores dolore. Impedit, at fugiat! Soluta, laudantium? Sapiente eligendi inventore
				laudantium odit sequi fugit aut dolore labore, quos mollitia ratione ipsa unde obcaecati
				praesentium deleniti qui quis sed culpa facere nemo. Vitae laborum labore est sint incidunt,
				maiores suscipit sit provident architecto adipisci ducimus sunt tempora corrupti dolorem
				quasi beatae magni eos enim vel ad quos. Quis reiciendis deserunt officia alias voluptas
				eos, est animi labore esse temporibus, inventore harum ipsum debitis! Nobis culpa laboriosam
				quo praesentium dolore facilis quos quae eveniet commodi minus explicabo quas beatae ex,
				ullam sunt cum dolor voluptate incidunt enim tempora nulla, quisquam et nemo. Expedita quia
				placeat, repellendus nisi numquam nostrum? Dignissimos ab rerum nobis.
			</p>
		</div>
	);
}
