/**
 * Converts a Cloudflare Stream's ReadableStream to an ArrayBuffer.
 * Handles errors using async/await for cleaner flow control.
 *
 * @param readableStream The Cloudflare ReadableStream to convert.
 * @returns Promise that resolves to the ArrayBuffer containing the stream's data.
 */
export async function readableStreamToArrayBuffer(
	readableStream: ReadableStream<Uint8Array>
): Promise<ArrayBuffer> {
	const reader = readableStream.getReader();
	let chunks: Uint8Array[] = [];
	let totalLength = 0;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			if (value) {
				// Additional check for potential undefined chunk values
				chunks.push(value);
				totalLength += value.length;
			}
		}

		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}

		return result.buffer;
	} finally {
		reader.releaseLock();
	}
}
