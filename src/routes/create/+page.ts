import type { PageLoad } from './$types';

export const load: PageLoad = function () {
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
