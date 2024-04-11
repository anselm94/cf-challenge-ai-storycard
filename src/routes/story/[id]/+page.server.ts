import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export type LangCode = 'en' | 'de' | 'es';
export type IllustrationStyle = 'none' | 'artistic' | 'comic';
export type StoryData = {
	id: string;
	text: Record<
		LangCode,
		{
			title: string;
			content: string;
		}
	>;
	illustration: {
		selectedStyle: IllustrationStyle;
		styles: Record<IllustrationStyle, { url: string }>;
	};
};

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
