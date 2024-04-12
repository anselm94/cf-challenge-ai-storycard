import { error } from '@sveltejs/kit';

export const GET = async ({ params, platform }) => {
	const object = await platform?.env.R2.get(params.id);
	if (!object) {
		throw error(404, 'Object not found');
	}
	return new Response(await object.arrayBuffer(), {
		headers: {
			'content-type': object.httpMetadata?.contentType ?? 'image/png'
		}
	});
};
