import { LoaderFunctionArgs } from '@remix-run/node';

export const loader = (args: LoaderFunctionArgs) => {
	const date = new Date();
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${args.request.headers.get('Host') ?? args.request.headers.get('Origin')}/foo.html</loc>
    <lastmod>${`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}</lastmod>
  </url>
</urlset>`,
		{
			headers: { 'Content-Type': 'text/xml' },
		},
	);
};
