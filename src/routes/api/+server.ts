import { Ai } from '@cloudflare/ai';
import { json } from '@sveltejs/kit';

export const POST = async function ({ platform, request }) {
	const data = await request.json<{ url: string; prompt: string }>();
	const response = await fetch(data.url, {
		method: 'GET'
	});
	const ai = new Ai(platform?.env.AI);

	const res = await ai.run('@cf/unum/uform-gen2-qwen-500m', {
		prompt: data.prompt,
		image: Array.from(new Uint8Array(await response.arrayBuffer()))
	});

	return json({ description: res.description });
};
