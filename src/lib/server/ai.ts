import type { LangCode, StoryPromptInput } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';
import { readableStreamToArrayBuffer } from './utils';

const ILLUSTRATION_AUTHORS = [
	'Corry Loftis',
	'James Gilleard',
	'Jerry Pinkney',
	'Jim Toomey',
	'Jon Klassen',
	'Lois Van Baarle',
	'Martin Rowson',
	'Mary Blair',
	'Michal Lisowski',
	'Oriol Vidal',
	'Pascal Campion',
	'Peter de Seve',
	'Possy Simmonds',
	'Sam Bosma',
	'Tatsuro Kiuchi'
];

export async function generateStory(
	{ genre, character, location, tone, theme, extraPrompt }: StoryPromptInput,
	ai: Ai
) {
	// Story generation
	const outStory = (await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', {
		messages: [
			{
				role: 'system',
				content: `You are the greatest storyteller of all time, loved by millions of children and your ability to weave tales knows no bounds. Your stories, whether rooted in truth or blossoming from the seeds of imagination, are consistently enthralling and captivating. Your task is to write a very short ${genre} story of less than 100 words, about a character - ${character} who lives in a ${location}. The story should have a ${tone} tone and revolve around the theme of ${theme}. You must write the title and story following the below format\n\n## Format:\n<title>\n---\n<story>`
			},
			{
				role: 'user',
				content: `${extraPrompt}. Remember, the story must be less than 100 words. Now, start writing with title and story content.`
			}
		],
		stream: false
	})) as { response: string };
	let [storyTitle, storyContent] = outStory.response.split('---');
	storyTitle = storyTitle?.replaceAll('title', '').replaceAll('Title', '').replaceAll(':', '').trim() ?? '';
	storyContent = storyContent?.replaceAll('story', '').replaceAll('Story', '').trim() ?? '';
	console.log(`Generated a story with title - ${storyTitle}`);

	// Illustration prompt generation
	const outIllusCaption = (await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', {
		messages: [
			{
				role: 'system',
				content: `You are the greatest illustrator of all times, who drew the world famous cartoons and illustrations of ever living children classics and story books. You are currently tasked to draw one illustration to capture the main scene of the story. Your task is to write a short prompt for AI image generation by referring the sample prompts.\n\n## Sample Image generation prompts\n1. "boy playing at the park happily with his friends in a playground surrounded by lush trees"\n2. "gigantic man lying on the ground tied with ropes by tiny little men from Lilliput\n\n# Story:\nTitle: ${storyTitle}\n${storyContent}`
			},
			{
				role: 'user',
				content: 'Now, you start writing the image prompt.'
			}
		]
	})) as { response: string };
	const illusImgPrompt = outIllusCaption.response.replaceAll('"', '').trim();
	console.log(`Generated an illustration prompt - ${illusImgPrompt} for story - ${storyTitle}`);

	// generate image
	const { illustration: outIllus } = await generateImage(
		{
			authorStyle: 'Fred Calleri',
			illusImgPrompt
		},
		ai
	);

	return {
		title: storyTitle,
		content: storyContent,
		imagePrompt: illusImgPrompt,
		illustration: outIllus
	};
}

export async function translateLanguageStory(
	{
		storyTitle,
		storyContent,
		target_lang
	}: { storyTitle: string; storyContent: string; target_lang: LangCode },
	ai: Ai
) {
	// create two translation request, instead of one, as it's unreliable
	const outTranslatedTitle = await ai.run('@cf/meta/m2m100-1.2b', {
		source_lang: 'en',
		target_lang: target_lang,
		text: `${storyTitle}`
	});
	const outTranslatedContent = await ai.run('@cf/meta/m2m100-1.2b', {
		source_lang: 'en',
		target_lang: target_lang,
		text: `${storyContent}`
	});
	return {
		title: outTranslatedTitle.translated_text,
		content: outTranslatedContent.translated_text
	};
}

export async function generateImage(
	{ illusImgPrompt, authorStyle }: { illusImgPrompt: string; authorStyle: string },
	ai: Ai
) {
	// Illustration generation
	const outIllus = (await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
		prompt: `children book illustration by ${authorStyle} of ${illusImgPrompt}`
	})) as unknown as ReadableStream<Uint8Array>;

	// needed to buffer the stream, since R2 storage needs size of the stream before hand
	const outIllusBuffer = await readableStreamToArrayBuffer(outIllus);
	console.log(`Generated an illustration of size - ${outIllusBuffer.byteLength} bytes`);

	return {
		illustration: outIllusBuffer
	};
}
