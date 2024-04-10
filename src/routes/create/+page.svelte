<script lang="ts">
	import { goto } from '$app/navigation';
	import HeadExplodeIcon from 'flowbite-svelte-icons/FaceExplodeSolid.svelte';
	import MagicWandIcon from 'flowbite-svelte-icons/WandMagicSparklesSolid.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import Select from 'flowbite-svelte/Select.svelte';
	import Spinner from 'flowbite-svelte/Spinner.svelte';

	let GENRES = [
		{ value: 'comedy', name: 'Comedy' },
		{ value: 'fantasy', name: 'Fantasy' },
		{ value: 'science fiction', name: 'Science Fiction' }
	];
	let CHARACTERS = [
		{ value: 'dragon', name: 'Dragon' },
		{ value: 'robot', name: 'Robot' },
		{ value: 'animal', name: 'Animal' },
		{ value: 'unicorn', name: 'Unicorn' },
		{ value: 'alien', name: 'Alien' },
		{ value: 'superhero', name: 'Superhero' },
		{ value: 'prince', name: 'Prince' },
		{ value: 'princess', name: 'Princess' }
	];
	let LOCATIONS = [
		{ value: 'forest', name: 'Forest' },
		{ value: 'space', name: 'Space' },
		{ value: 'underwater', name: 'Underwater' },
		{ value: 'city', name: 'City' },
		{ value: 'castle', name: 'Castle' },
		{ value: 'school', name: 'School' }
	];
	let TONES = [
		{ value: 'scary', name: 'Scary' },
		{ value: 'funny', name: 'Funny' },
		{ value: 'adventurous', name: 'Adventurous' },
		{ value: 'mysterious', name: 'Mysterious' },
		{ value: 'magical', name: 'Magical' }
	];
	let THEMES = [
		{ value: 'friendship', name: 'Friendship' },
		{ value: 'bravery', name: 'Bravery' },
		{ value: 'adventure', name: 'Adventure' },
		{ value: 'love', name: 'Love' },
		{ value: 'deception', name: 'Deception' }
	];

	let selectedGenre = 'comedy';
	let selectedCharacter = 'dragon';
	let selectedLocation = 'forest';
	let selectedTone = 'scary';
	let selectedTheme = 'friendship';

	let isCreatingStoryCard = false;

	async function createStoryCard() {
		isCreatingStoryCard = true;
		await new Promise((resolve) => setTimeout(resolve, 2000));
		goto(`/story/123`);
	}
</script>

<svelte:head>
	<title>Create a Story Card</title>
	<meta name="description" content="Create a Story Card using AI with illustrations" />
</svelte:head>

<div>
	<h1 class="my-8 text-4xl font-extrabold">Create a Story Card</h1>
	<div class="rounded-lg border">
		<form class="flow flow-row block text-lg leading-[4rem]">
			<div class="flex flex-row items-center justify-between border-b bg-gray-100 px-4 py-4">
				<h2 class="inline-block text-xl font-bold">Define a Narrative</h2>
				<Button outline color="alternative" size="xs" class="mx-4"
					><HeadExplodeIcon class="me-2 h-4 w-4" />Surprise Me</Button
				>
			</div>
			<div class="px-8 pb-12 pt-4 text-base font-normal">
				Create a
				<span class="font-bold"> Story Card </span>
				with a
				<Label defaultClass="inline-block">
					<span class="hidden">Genre</span>
					<Select class="mt-2" items={GENRES} bind:value={selectedGenre} />
				</Label>
				story, about a
				<Label defaultClass="inline-block">
					<span class="hidden">Character</span>
					<Select class="mt-2" items={CHARACTERS} bind:value={selectedCharacter} />
				</Label>
				who lives in a
				<Label defaultClass="inline-block">
					<span class="hidden">Setting</span>
					<Select class="mt-2" items={LOCATIONS} bind:value={selectedLocation} />
				</Label>
				. The story should have a
				<Label defaultClass="inline-block">
					<span class="hidden">Tone</span>
					<Select class="mt-2" items={TONES} bind:value={selectedTone} />
				</Label>
				tone and revolve around the theme of
				<Label defaultClass="inline-block">
					<span class="hidden">Theme</span>
					<Select class="mt-2" items={THEMES} bind:value={selectedTheme} />
				</Label>
				.
			</div>
			<div class="flex flex-row-reverse border-t bg-gray-100 px-4 py-4">
				<Button type="submit" color="primary" on:click={createStoryCard}
					><MagicWandIcon class="me-2 h-4 w-4" />Create</Button
				>
			</div>
		</form>
	</div>
</div>

<Modal bind:open={isCreatingStoryCard} dismissable={false} size="xs">
	<div class="flew-row flex items-center justify-center">
		<Spinner />
		<p class="ml-4">Creating Story Card ...</p>
	</div>
</Modal>
