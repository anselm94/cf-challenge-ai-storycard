import { generateStory } from '$lib/server/ai';
import type { StoryData, StoryPromptInput } from '$lib/types/types';
import { Ai } from '@cloudflare/ai';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
type PostData = {
	type: 'create-story';
};

type CreateStoryPostData = PostData & StoryPromptInput;

export const POST = async ({ request, platform }) => {
	const data: PostData = await request.json();

	switch (data.type) {
		case 'create-story': {
			const a = await createStory(
				data as CreateStoryPostData,
				platform!.env.KV,
				platform!.env.R2,
				platform!.env.AI
			);
			return json({ storyId: a.storyId });
		}
		default:
			break;
	}

	return json({ success: true });
};

async function createStory(
	{ genre, character, location, tone, theme }: CreateStoryPostData,
	KV: KVNamespace,
	R2: R2Bucket,
	AI: unknown
) {
	const storyId = randomUUID();

	const { title, content, illustration } = await generateStory(
		{ genre, character, location, tone, theme, extraPrompt: '' },
		new Ai(AI)
	);

	const objectKey = `img-${storyId}`;
	await R2.put(objectKey, illustration.buffer, {
		httpMetadata: {
			contentType: 'image/png'
		}
	});

	const storyData: StoryData = {
		id: storyId,
		text: {
			en: {
				title: title,
				content: content
			}
		},
		illustration: {
			selectedStyle: 'none',
			styles: {
				none: {
					url: `https://pub-edb1f3e64c864cb685897db171870652.r2.dev/${objectKey}`
				}
			}
		}
	};
	await KV.put(`story#${storyId}`, JSON.stringify(storyData), {
		expirationTtl: 24 * 60 * 60 // 1 day expiration
	});
	return {
		storyId: storyId
	};
}
