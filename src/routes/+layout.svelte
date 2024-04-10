<script lang="ts">
	import '@fontsource/chewy';
	import '@fontsource/poppins';
	import Button from 'flowbite-svelte/Button.svelte';
	import NavBrand from 'flowbite-svelte/NavBrand.svelte';
	import NavContainer from 'flowbite-svelte/NavContainer.svelte';
	import Navbar from 'flowbite-svelte/Navbar.svelte';
	import Breadcrumb from 'flowbite-svelte/Breadcrumb.svelte';
	import BreadcrumbItem from 'flowbite-svelte/BreadcrumbItem.svelte';
	import '../app.pcss';
	import { page } from '$app/stores';
</script>

<div class="h-full w-full">
	<Navbar class="">
		<NavContainer class="rounded-lg border px-5 py-2 dark:bg-gray-600">
			<NavBrand href="/">
				<!-- <img
					src="/images/flowbite-svelte-icon-logo.svg"
					class="me-3 h-6 sm:h-9"
					alt="Flowbite Logo"
				/> -->
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
					>Story Card</span
				>
			</NavBrand>
			<div class="flex md:order-2">
				<Button color="dark" size="sm" href="/create">Create a Story Card</Button>
			</div>
		</NavContainer>
	</Navbar>
	<div class="container mx-auto p-8">
		<div class="my-4">
			<Breadcrumb aria-label="Default breadcrumb example">
				{#each $page.data.nav as nav}
					<BreadcrumbItem href={nav.href} home={nav.href === '/'}>{nav.title}</BreadcrumbItem>
				{/each}
			</Breadcrumb>
		</div>
		<slot />
	</div>
</div>
