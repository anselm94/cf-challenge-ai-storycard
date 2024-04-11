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

	await platform?.env.KV?.put(
		key,
		JSON.stringify({
			id: 'c920decf-077e-43a5-90f5-0bf2ab32fa8c',
			text: {
				en: {
					title: 'The Girl and the Magic Aquarium',
					content:
						'Once upon a time, in a quaint little seaside town, lived a curious girl named Mia. One sunny afternoon, she visited the local aquarium for the very first time. As she approached the vast tank filled with colorful fish, her eyes widened in awe. The rainbow-hued angelfish danced gracefully, while the playful clownfish hid among the coral. Mia was mesmerized by the gentle sway of the sea anemone and the graceful glide of the stingrays. She spent hours watching the underwater ballet, her heart filled with wonder and delight. The magic of the aquarium had cast its spell on Mia, igniting a lifelong love for the ocean and its wondrous inhabitants.'
				},
				de: {
					title: 'Das Mädchen und das magische Aquarium',
					content:
						'Es war einmal, in einer malerischen kleinen Küstenstadt, ein neugieriges Mädchen namens Mia. An einem sonnigen Nachmittag besuchte sie zum ersten Mal das örtliche Aquarium. Als sie sich dem riesigen Becken voller bunter Fische näherte, weiteten sich ihre Augen vor Ehrfurcht. Der regenbogenfarbene Kaiserfisch tanzte anmutig, während sich der verspielte Clownfisch zwischen den Korallen versteckte. Mia war fasziniert vom sanften Wiegen der Seeanemone und dem anmutigen Gleiten der Stachelrochen. Sie verbrachte Stunden damit, sich das Unterwasserballett anzuschauen, ihr Herz war voller Staunen und Freude. Die Magie des Aquariums hatte Mia in ihren Bann gezogen und eine lebenslange Liebe zum Meer und seinen wundersamen Bewohnern entfacht.'
				}
			},
			illustration: {
				selectedStyle: 'comic',
				styles: {
					none: {
						url: 'https://pub-edb1f3e64c864cb685897db171870652.r2.dev/img-7d4feed2-2826-4d85-90f7-37e99078108f.png'
					},
					comic: {
						url: 'https://pub-edb1f3e64c864cb685897db171870652.r2.dev/img-7d4feed2-2826-4d85-90f7-37e99078108f.png'
					}
				}
			}
		})
	);

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
