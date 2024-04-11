import type { StoryData } from '$lib/types/types';
import { json } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
type PostData = {
	type: 'create-story';
};

type CreateStoryPostData = PostData & {
	genre: string;
	character: string;
	location: string;
	tone: string;
	theme: string;
};

export const POST = async ({ request, platform }) => {
	const data: PostData = await request.json();

	switch (data.type) {
		case 'create-story': {
			const a = await createStory(data as CreateStoryPostData, platform!.env.KV);
			return json({ storyId: a.storyId });
		}
		default:
			break;
	}

	return json({ success: true });
};

async function createStory(
	{ genre, character, location, tone, theme }: CreateStoryPostData,
	KV: KVNamespace
) {
	const storyId = randomUUID();

	// TODO generate story, title, illustration caption, illustration
	await new Promise((resolve) => setTimeout(resolve, 5000));
	const title = `Story Card - ${genre} - ${character} - ${location} - ${tone} - ${theme}`;
	console.log(title);

	const storyData: StoryData = {
		id: storyId,
		text: {
			en: {
				title: '',
				content: ''
			}
		},
		illustration: {
			selectedStyle: 'none',
			styles: {
				none: {
					url: ''
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
