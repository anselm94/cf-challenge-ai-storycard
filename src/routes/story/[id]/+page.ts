import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = function ({ params }) {
	if (params.id !== '123') {
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
		]
	};
};
