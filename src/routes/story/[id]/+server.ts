import { generateImage, translateLanguageStory } from '$lib/server/ai';
import type { LangCode, IllustrationStyle, StoryData } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';
import { json } from '@sveltejs/kit';

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
			await translateStory(
				params.id,
				data as TranslatePostData,
				platform!.env.KV,
				platform!.env.AI
			);
			break;
		case 'update-text':
			await updateText(params.id, data as UpdateTextPostData, platform!.env.KV);
			break;
		case 'update-illus-style': {
			const res = await updateIllustrationStyle(
				params.id,
				data as UpdateIllusStylePostData,
				platform!.env.KV,
				platform!.env.R2,
				platform!.env.AI
			);
			return json(res);
		}
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
	await KV.put(key, JSON.stringify(storyData), { expirationTtl: 60 * 60 * 24 });
}

async function updateIllustrationStyle(
	storyId: string,
	{ illustrationStyle }: UpdateIllusStylePostData,
	KV: KVNamespace,
	R2: R2Bucket,
	AI: unknown
) {
	const key = `story#${storyId}`;
	const storyData = await KV.get<StoryData>(key, 'json');

	if (storyData) {
		storyData.illustration.selectedStyle = illustrationStyle;

		// generate image and set url only if style is not available already
		if (!Object.keys(storyData.illustration.styles).includes(illustrationStyle)) {
			const { illustration } = await generateImage(
				{ authorStyle: illustrationStyle, illusImgPrompt: storyData.illustration.imagePrompt },
				new Ai(AI)
			);
			const objectKey = `img-${storyId}-${illustrationStyle.toLocaleLowerCase().replaceAll(' ', '-')}`;
			await R2.put(objectKey, illustration, {
				httpMetadata: {
					contentType: 'image/png'
				}
			});
			storyData.illustration.styles[illustrationStyle] = {
				url: `/img/${objectKey}`
			};
			await KV.put(key, JSON.stringify(storyData), { expirationTtl: 60 * 60 * 24 });
		}
		return {
			illustrationUrl: storyData.illustration.styles[illustrationStyle]!.url
		};
	}
}

async function translateStory(
	storyId: string,
	{ language }: TranslatePostData,
	KV: KVNamespace,
	AI: unknown
) {
	const key = `story#${storyId}`;

	const storyData = await KV.get<StoryData>(key, 'json');

	if (storyData) {
		const { title, content } = await translateLanguageStory(
			{
				storyTitle: storyData.text['en']!.title,
				storyContent: storyData.text['en']!.content,
				target_lang: language
			},
			new Ai(AI)
		);
		storyData.text[language as LangCode] = {
			title: title!,
			content: content!
		};
	}

	await KV.put(key, JSON.stringify(storyData), { expirationTtl: 60 * 60 * 24 });
}
