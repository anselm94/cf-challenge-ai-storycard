import type { PageServerLoad } from './$types';

export const load: PageServerLoad = function () {
	return {
		nav: [
			{
				title: 'Home',
				href: '/'
			},
			{
				title: 'Create',
				href: '/create'
			}
		]
	};
};
