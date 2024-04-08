<script lang="ts">
	import logo from '$lib/images/logo.png';
	import { AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	const popupUser: PopupSettings = {
		event: 'click',
		target: 'popup-user',
		placement: 'bottom'
	};
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<img src={logo} class="w-12" alt="logo" />
	</svelte:fragment>
	<h3 class="h3">Story Card</h3>
	<svelte:fragment slot="trail">
		<img
			src="https://i.pravatar.cc/"
			class="border-surface-300-600-token w-12 cursor-pointer rounded-full border-4 hover:!border-primary-500"
			alt="avatar"
			use:popup={popupUser}
		/>
	</svelte:fragment>

	<div class="card w-72 p-4 shadow-xl" data-popup="popup-user">
        <p class="text-start pb-4">user@example.com</p>
        <button class="btn btn-sm variant-ghost-surface w-full">Logout</button>
		<div class="bg-surface-100-800-token arrow" />
	</div>
</AppBar>
