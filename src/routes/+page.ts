import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = function () {
	redirect(301, '/create');
	// return {
	// 	nav: [
	// 		{
	// 			title: 'Home',
	// 			href: '/'
	// 		}
	// 	]
	// };
};
