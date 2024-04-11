import { json } from '@sveltejs/kit';
import type { IllustrationStyle, LangCode, StoryData } from './+page.server.js';

type PostData = {
	type: 'translate' | 'update-text' | 'update-illus-style';
};

type TranslatePostData = PostData & {
	language: LangCode;
};

type UpdateTextPostData = PostData & {
	language: LangCode;
	storyTitle: string;
	storyContent: string;
};

type UpdateIllusStylePostData = PostData & {
	illustrationStyle: IllustrationStyle;
};

export const POST = async ({ params, request, platform }) => {
	const data: PostData = await request.json();

	switch (data.type) {
		case 'translate':
			await translateStory(params.id, data as TranslatePostData, platform!.env.KV);
			break;
		case 'update-text':
			await updateText(params.id, data as UpdateTextPostData, platform!.env.KV);
			break;
		case 'update-illus-style':
			await updateIllustrationStyle(params.id, data as UpdateIllusStylePostData, platform!.env.KV);
			break;
		default:
			break;
	}

	return json({ success: true });
};

async function updateText(
	storyId: string,
	{ language, storyTitle, storyContent }: UpdateTextPostData,
	KV: KVNamespace
) {
	const key = `story#${storyId}`;
	const storyData = await KV.get<StoryData>(key, 'json');
	if (storyData) {
		storyData.text[language as LangCode] = {
			title: storyTitle,
			content: storyContent
		};
	}
	console.log(storyTitle, storyContent);
	await KV.put(key, JSON.stringify(storyData));
}

async function updateIllustrationStyle(
	storyId: string,
	{ illustrationStyle }: UpdateIllusStylePostData,
	KV: KVNamespace
) {
	const key = `story#${storyId}`;
	const storyData = await KV.get<StoryData>(key, 'json');

	if (storyData) {
		storyData.illustration.selectedStyle = illustrationStyle;

		// generate image and set url only if style is not available already
		if (!Object.keys(storyData.illustration.styles).includes(illustrationStyle)) {
			storyData.illustration.styles[illustrationStyle] = {
				url: storyData.illustration.styles.none.url // TODO generate image
			};
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
	await KV.put(key, JSON.stringify(storyData));
}

async function translateStory(storyId: string, { language }: TranslatePostData, KV: KVNamespace) {
	const key = `story#${storyId}`;

	const storyData = await KV.get<StoryData>(key, 'json');

	if (storyData) {
		storyData.text[language as LangCode] = {
			title: storyData.text['en'].title, // TODO translate
			content: storyData.text['en'].content // TODO translate
		};
		await new Promise((resolve) => setTimeout(resolve, 5000));
	}

	await KV.put(key, JSON.stringify(storyData));
}
