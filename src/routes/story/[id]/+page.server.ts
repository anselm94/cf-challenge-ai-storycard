import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { StoryData } from '$lib/types/types';

export const load: PageServerLoad = async function ({ platform, params }) {
	const key = `story#${params.id}`;

	const data = await platform?.env.KV.get<StoryData>(key, 'json');
	if (!data) {
		error(404, 'Not found');
	}
	return {
		nav: [
			{
				title: 'Home',
				href: '/'
			},
			{
				title: 'Story',
				href: '/story'
			}
		],
		data
	};
};
