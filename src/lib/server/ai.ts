import type { StoryPromptInput } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';

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
				content: `You are the greatest storyteller of all time, loved by millions of young children and your ability to weave tales knows no bounds. Your stories, whether rooted in truth or blossoming from the seeds of imagination, are consistently enthralling and captivating. Your task is to write a short ${genre} story of about 100 words, about a ${character} who lives in a ${location}. The story should have a ${tone} tone and revolve around the theme of ${theme}. Also, consider any inputs from the user. You must write the title and story following the below format\n\n## Format:\n<title>\n---\n<story>`
			},
			{
				role: 'user',
				content: `${extraPrompt}. Now, start writing the short story.`
			}
		],
		stream: false
	})) as { response: string };
	let [storyTitle, storyContent] = outStory.response.split('---');
	storyTitle = storyTitle.replace('title', '').replace('Title', '').trim();
	storyContent = storyContent.replace('story', '').replace('Story', '').trim();

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

	const outIllus = await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', {
		prompt: illusImgPrompt,
		num_steps: 4
	});

	return {
		title: storyTitle,
		content: storyContent,
		illustration: outIllus
	};
}
