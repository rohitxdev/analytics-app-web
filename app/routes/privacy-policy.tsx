import { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
	{
		title: 'Privacy Policy',
	},
];

export default function Route() {
	return (
		<div className="mb-8 flex flex-col gap-6">
			<h2 className="mt-10 text-center text-4xl font-bold">Privacy Policy</h2>
			<p className="text-balance px-4 text-sm">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, corporis tenetur at numquam
				harum voluptas nostrum nulla rem atque adipisci cum dicta, ullam, commodi asperiores!
				Obcaecati molestias neque consequatur doloremque temporibus velit illo inventore sapiente.
				Earum autem iste nemo magni excepturi sapiente temporibus voluptates repellat atque facilis
				velit provident expedita minima, architecto enim saepe! Inventore at optio ab odit.
				Provident porro magni placeat perferendis distinctio corrupti harum iure non a, voluptate
				qui laudantium vero quam! Quas fugit minus reprehenderit laudantium esse eveniet error
				reiciendis saepe modi libero eaque porro beatae illo molestiae possimus iure, adipisci
				obcaecati dolore quidem veniam expedita delectus dolores? Molestias dolores iure soluta
				veniam excepturi atque esse nostrum autem culpa, odio, distinctio deleniti quae explicabo
				quo necessitatibus quia provident debitis eveniet laborum optio ullam quas. Recusandae,
				eius! Optio temporibus doloremque perspiciatis magnam quaerat modi ducimus est ea sint amet
				quas, inventore accusamus, maiores laudantium placeat corrupti tenetur nostrum. Veniam magni
				voluptas corporis pariatur beatae quasi nisi fuga minus assumenda, quia accusamus unde
				labore hic cupiditate aliquid quo, eius id odio distinctio inventore illo sint, deleniti
				eveniet. Repellat odit, reprehenderit nam maiores, magnam nihil ipsa facilis vitae quaerat
				nostrum earum accusantium enim voluptate laudantium dolores porro pariatur deserunt labore
				aut ut perferendis. Autem adipisci quis ea odio vel esse assumenda vero exercitationem
				deserunt nam soluta non, inventore quam nostrum id rerum fugit dolorem velit modi quibusdam
				qui earum ipsa tenetur. Perspiciatis nam quia commodi maiores quibusdam doloribus, culpa
				asperiores laborum, ratione necessitatibus ullam neque a. Numquam maiores harum ex
				laudantium fuga possimus, nemo itaque officiis. Quibusdam molestiae rem illum nobis maxime
				nostrum ducimus ex atque quos quod qui accusamus autem maiores, iure iste aspernatur, dolore
				ut! Asperiores, reiciendis velit voluptate incidunt odit est aspernatur similique provident
				vero sapiente quas aliquam? Reprehenderit id eum sint autem iste nemo libero!
			</p>
		</div>
	);
}
