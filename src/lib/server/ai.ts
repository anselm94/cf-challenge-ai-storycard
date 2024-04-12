import type { LangCode, StoryPromptInput } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';
import { readableStreamToArrayBuffer } from './utils';

const ILLUSTRATION_AUTHORS = [
	'Corry Loftis',
	'Fred Calleri',
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
				content: `You are the greatest storyteller of all time, loved by millions of young children and your ability to weave tales knows no bounds. Your stories, whether rooted in truth or blossoming from the seeds of imagination, are consistently enthralling and captivating. Your task is to write a short ${genre} story of less than 100 words in a paragraph, about a character - ${character} who lives in a ${location}. The story should have a ${tone} tone and revolve around the theme of ${theme}. You must write the title and story following the below format\n\n## Format:\n<title>\n---\n<story>`
			},
			{
				role: 'user',
				content: `${extraPrompt}. Now, start writing the short story.`
			}
		],
		stream: false
	})) as { response: string };
	let [storyTitle, storyContent] = outStory.response.split('---');
	storyTitle = storyTitle.replace('title', '').replace('Title', '').replace(':', '').trim();
	storyContent = storyContent.replace('story', '').replace('Story', '').trim();
	console.log(`Generated a story with title - ${storyTitle}`);

	// Illustration prompt generation
	const randomIllusAuthor =
		ILLUSTRATION_AUTHORS[Math.floor(Math.random() * ILLUSTRATION_AUTHORS.length)];
	const outIllusCaption = (await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', {
		messages: [
			{
				role: 'system',
				content: `You are the greatest illustrator of all times, who drew the world famous cartoons and illustrations of ever living children classics and story books. You are currently tasked to draw one illustration in the style of author - ${randomIllusAuthor}' to capture the main scene of the story. Your task is to write a short prompt for AI image generation using the sample prompts.\n\nThe AI text to image prompt you write must follow the below format:\n"children book illustration by <author> of <scene>"\n\n## Sample Text to Image generation prompts\n1. "children book illustration by Cory Loftis of boy playing at the park happily with his friends in a playground surrounded by lush trees"\n2. "children book illustration by Fred Calleri of a gigantic man lying on the ground tied with ropes by tiny little men from Lilliput\n\n# Story:\nTitle: ${storyTitle}\n${storyContent}`
			},
			{
				role: 'user',
				content: 'Now, you start writing the text to image prompt.'
			}
		]
	})) as { response: string };
	const illusImgPrompt = outIllusCaption.response.replace('"', '').trim();
	console.log(`Generated an illustration prompt - ${illusImgPrompt} for story - ${storyTitle}`);

	// Illustration generation
	const outIllus = (await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', {
		prompt: illusImgPrompt
	})) as unknown as ReadableStream<Uint8Array>;

	// needed to buffer the stream, since R2 storage needs size of the stream before hand
	const outIllusBuffer = await readableStreamToArrayBuffer(outIllus);
	console.log(`Generated an illustration of size - ${outIllus} bytes for story - ${storyTitle}`);

	return {
		title: storyTitle,
		content: storyContent,
		illustration: outIllusBuffer
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
