// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="@cloudflare/workers-types" />

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				KV: KVNamespace;
			};
		}
	}
}

export {};
