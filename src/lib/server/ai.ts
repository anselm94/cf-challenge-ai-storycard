import type { LangCode, StoryPromptInput } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';
import { readableStreamToArrayBuffer } from './utils';

export async function generateStory(
	{ genre, character, location, tone, theme, extraPrompt }: StoryPromptInput,
	ai: Ai
) {
	async function generateStoryContent() {
		// @ts-ignore
		const outStory = (await ai.run('@hf/mistralai/mistral-7b-instruct-v0.2', {
			messages: [
				{
					role: 'system',
					content: `You are the greatest storyteller of all time, loved by millions of children and your ability to weave tales knows no bounds. Your stories, whether rooted in truth or blossoming from the seeds of imagination, are consistently enthralling and captivating. Your task is to write a very short ${genre} story of about 100 words, about a character - ${character} who lives in a ${location}. The story should have a ${tone} tone and revolve around the theme of ${theme}. You must write the title and story following the below format\n\n## Format:\n<title>\n---\n<story>`
				},
				{
					role: 'user',
					content: `${extraPrompt}. Remember, the story must be about 100 words in a paragraph. Now, start writing the title and the story content.`
				}
			],
			stream: false
		})) as { response: string };
		let [storyTitle, storyContent] = outStory.response.split('---');
		storyTitle =
			storyTitle?.replaceAll('title', '').replaceAll('Title', '').replaceAll(':', '').replaceAll('"', '').trim() ?? '';
		storyContent =
			storyContent
				?.replaceAll('story', '')
				.replaceAll('Story', '')
				.replaceAll('\n\n', '\n')
				.replaceAll('"', '')
				.trim() ?? '';
		console.log(`Generated a story with title - ${storyTitle}`);
		return {
			title: storyTitle,
			content: storyContent
		};
	}

	async function generateIllustrationPrompt(title: string, content: string) {
		// @ts-ignore
		const outIllusCaption = (await ai.run('@hf/mistralai/mistral-7b-instruct-v0.2', {
			messages: [
				{
					role: 'system',
					content: `You are the greatest illustrator of all times, who drew the world famous cartoons and illustrations of ever living children classics and story books. You are currently tasked to draw one illustration to capture the main scene of the story. Your task is to write a short prompt for AI image generation by referring the sample prompts.\n\n## Sample Image generation prompts\n1. "boy playing at the park happily with his friends in a playground surrounded by lush trees"\n2. "gigantic man lying on the ground tied with ropes by tiny little men from Lilliput\n\n# Story:\nTitle: ${title}\n${content}`
				},
				{
					role: 'user',
					content: 'Now, you start writing the image prompt.'
				}
			]
		})) as { response: string };
		const illusImgPrompt = outIllusCaption.response.replaceAll('"', '').trim();
		console.log(`Generated an illustration prompt - ${illusImgPrompt} for story - ${title}`);
		return {
			imgPrompt: illusImgPrompt
		};
	}

	async function moderateStoryContent(
		title: string,
		content: string
	): Promise<{ title: string; content: string; safetyClassification: 'safe' | 'unsafe' }> {
		const { response } = (await ai.run('@hf/thebloke/llamaguard-7b-awq', {
			prompt: `<s>[INST] You are an expert Content Moderator to filter story content for safety. Your task is to determine the safety level of the story content for the children. Provide your safety assessment\n- First line must read 'safe' or 'unsafe'.\n- If unsafe, a second line must include a comma-separated list of violated categories.\n\n<BEGIN UNSAFE CONTENT CATEGORIES>\n1: sexual content\n2: suggestive content\n3:nudity\n4:horror\n5:gore\n6:adult theme content.\n<END UNSAFE CONTENT CATEGORIES>\n\n<BEGIN CONVERSATION>\n\nStory Title: ${title}, Story Content: ${content}\n<END CONVERSATION}\n[/INST]`,
			raw: true
		})) as { response: string };
		console.log(`Moderated the image as - ${response}`);

		return {
			title,
			content,
			safetyClassification: response.includes('unsafe') ? 'unsafe' : 'safe'
		};
	}

	async function moderateStoryIllustration(
		image: ArrayBuffer,
		imgPrompt: string
	): Promise<{ image: ArrayBuffer; imgPrompt: string; safetyClassification: 'safe' | 'unsafe' }> {
		const { description } = await ai.run('@cf/unum/uform-gen2-qwen-500m', {
			prompt: 'write a precise description of the image',
			image: Array.from(new Uint8Array(image))
		});
		console.log(`Generated an image description - ${description}`);

		const { response } = (await ai.run('@hf/thebloke/llamaguard-7b-awq', {
			prompt: `<s>[INST] You are an expert Content Moderator to filter out images based on textual description of the image. Your task is to determine the safety level of the images for the children based on the detailed text captions provided. Provide your safety assessment\n- First line must read 'safe' or 'unsafe'.\n- If unsafe, a second line must include a comma-separated list of violated categories.\n\n<BEGIN UNSAFE CONTENT CATEGORIES>\n1: sexual content\n2: suggestive content\n3:nudity\n4:horror\n5:gore\n6:adult theme content.\n<END UNSAFE CONTENT CATEGORIES>\n\n<BEGIN CONVERSATION>\n\nImage description:\n${description}\n<END CONVERSATION}\n[/INST]`,
			raw: true
		})) as { response: string };
		console.log(`Moderated the image as - ${response}`);

		return {
			image,
			imgPrompt,
			safetyClassification: response.includes('unsafe') ? 'unsafe' : 'safe'
		};
	}

	// Story content generation & moderation - pipeline
	const { title, content } = await generateStoryContent();

	// Illustration generation & moderation - pipeline
	const pipelineIllustration = generateIllustrationPrompt(title, content)
		.then(({ imgPrompt }) =>
			generateImage(
				{
					authorStyle: 'Fred Calleri',
					illusImgPrompt: imgPrompt
				},
				ai
			)
		)
		.then(({ imgPrompt, illustration }) => moderateStoryIllustration(illustration, imgPrompt));

	// classification
	const [
		{ safetyClassification: textSafety },
		{ image: illustration, imgPrompt, safetyClassification: illusSafety }
	] = await Promise.all([moderateStoryContent(title, content), pipelineIllustration]);

	const res: {
		title: string;
		content: string;
		imagePrompt: string;
		illustration: ArrayBuffer;
		contentFilter: {
			text: 'safe' | 'unsafe';
			illustration: 'safe' | 'unsafe';
		};
	} = {
		title: title,
		content: content,
		imagePrompt: imgPrompt,
		illustration: illustration,
		contentFilter: {
			text: textSafety,
			illustration: illusSafety
		}
	};

	return res;
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
		imgPrompt: illusImgPrompt,
		illustration: outIllusBuffer
	};
}
