<script lang="ts">
	import NavBar from '$lib/client/components/NavBar.svelte';
	import SideBar from '$lib/client/components/Sidebar.svelte';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import '@fontsource/abril-fatface';
	import '@fontsource/inter';
	import '@fontsource/poppins';
	import '@fontsource/chewy';
	import { AppShell, storePopup } from '@skeletonlabs/skeleton';
	import '../app.pcss';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<AppShell
	regionPage="relative"
	slotPageHeader="sticky top-0 z-10"
	slotSidebarLeft="hidden lg:block bg-surface-500/5 w-56 p-4"
>
	<svelte:fragment slot="header">
		<NavBar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBar />
	</svelte:fragment>
	<slot />
</AppShell>
