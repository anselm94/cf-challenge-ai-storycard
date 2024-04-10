<script>
	import { goto } from '$app/navigation';
	import Button from 'flowbite-svelte/Button.svelte';
</script>

<svelte:head>
	<title>404 Not Found</title>
	<meta name="description" content="Not Found" />
</svelte:head>

<div class="flex h-full w-full flex-col items-center justify-center space-y-8">
	<h1 class="text-9xl font-bold">404</h1>
	<p class="text-3xl font-light">Not Found</p>
	<Button color="primary" on:click={() => goto('/create')}>Go Back</Button>
</div>
