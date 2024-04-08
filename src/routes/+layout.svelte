<script lang="ts">
	import '../app.pcss';

	import { AppBar, AppShell, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
</script>

<AppShell
	regionPage="relative"
	slotPageHeader="sticky top-0 z-10"
	slotSidebarLeft="bg-surface-500/5 w-56 p-4"
>
	<svelte:fragment slot="sidebarLeft">
		<div id="sidebar-left" class="hidden lg:block">
			<ListBox>
				<ListBoxItem group="nav" name="medium" value="books"><a href="/">Home</a></ListBoxItem>
				<ListBoxItem group="nav" name="medium" value="movies"><a href="/about">About</a></ListBoxItem>
			</ListBox>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="header">
		<AppBar>Skeleton</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
