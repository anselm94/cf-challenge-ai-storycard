<script lang="ts">
	import { goto } from '$app/navigation';
	import HeadExplodeIcon from 'flowbite-svelte-icons/FaceExplodeSolid.svelte';
	import MagicWandIcon from 'flowbite-svelte-icons/WandMagicSparklesSolid.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import Select from 'flowbite-svelte/Select.svelte';
	import Spinner from 'flowbite-svelte/Spinner.svelte';

	let GENRES = [
		{ value: 'comedy', name: 'Comedy' },
		{ value: 'fantasy', name: 'Fantasy' },
		{ value: 'science fiction', name: 'Science Fiction' },
		{ value: 'fairy tale', name: 'Fairy Tale' },
		{ value: 'historical fantasy', name: 'Historical Fantasy' },
		{ value: 'mystery', name: 'Mystery' },
		{ value: 'adventure', name: 'Adventure' },
		{ value: 'romance', name: 'Romance' },
		{ value: 'superhero', name: 'Superhero' },
		{ value: 'steampunk', name: 'Steampunk' },
		{ value: 'mythology', name: 'Mythology' },
		{ value: 'folklore', name: 'Folklore' }
	];
	let CHARACTERS = [
		{ value: 'dragon', name: 'Dragon' },
		{ value: 'robot', name: 'Robot' },
		{ value: 'animal', name: 'Animal' },
		{ value: 'unicorn', name: 'Unicorn' },
		{ value: 'alien', name: 'Alien' },
		{ value: 'superhero', name: 'Superhero' },
		{ value: 'prince', name: 'Prince' },
		{ value: 'princess', name: 'Princess' },
		{ value: 'knight', name: 'Knight' },
		{ value: 'fairy', name: 'Fairy' },
		{ value: 'wizard', name: 'Wizard' },
		{ value: 'phoenix', name: 'Phoenix' },
		{ value: 'mermaid', name: 'Mermaid' },
		{ value: 'merman', name: 'Merman' },
		{ value: 'goblin', name: 'Goblin' },
		{ value: 'giant', name: 'Giant' },
		{ value: 'dwarf', name: 'Dwarf' },
		{ value: 'elf', name: 'Elf' }
	];
	let LOCATIONS = [
		{ value: 'forest', name: 'Forest' },
		{ value: 'space', name: 'Space' },
		{ value: 'underwater', name: 'Underwater' },
		{ value: 'city', name: 'City' },
		{ value: 'castle', name: 'Castle' },
		{ value: 'school', name: 'School' },
		{ value: 'countryside', name: 'Countryside' },
		{ value: 'beach', name: 'Beach' },
		{ value: 'jungle', name: 'Jungle' },
		{ value: 'garden', name: 'Garden' },
		{ value: 'ship', name: 'Ship' },
		{ value: 'candy land', name: 'Candy land' },
		{ value: 'factory', name: 'Factory' }
	];
	let TONES = [
		{ value: 'happy', name: 'Happy' },
		{ value: 'scary', name: 'Scary' },
		{ value: 'funny', name: 'Funny' },
		{ value: 'adventurous', name: 'Adventurous' },
		{ value: 'mysterious', name: 'Mysterious' },
		{ value: 'magical', name: 'Magical' },
		{ value: 'wonderous', name: 'Wonderous' },
		{ value: 'heartwarming', name: 'Heartwarming' },
		{ value: 'historical', name: 'Historical' },
		{ value: 'mythological', name: 'Mythological' },
		{ value: 'inspiring', name: 'Inspiring' },
		{ value: 'whimsical', name: 'Whimsical' }
	];
	let THEMES = [
		{ value: 'friendship', name: 'Friendship' },
		{ value: 'bravery', name: 'Bravery' },
		{ value: 'adventure', name: 'Adventure' },
		{ value: 'family', name: 'Family' },
		{ value: 'love', name: 'Love' },
		{ value: 'imagination', name: 'Imagination' },
		{ value: 'honesty', name: 'Honesty' },
		{ value: 'compassion', name: 'Compassion' },
		{ value: 'self discovery', name: 'Self discovery' },
		{ value: 'nature', name: 'Nature' },
		{ value: 'creativity', name: 'Creativity' },
		{ value: 'kindness', name: 'Kindness' },
		{ value: 'perseverance', name: 'Perseverance' },
		{ value: 'curiosity', name: 'Curiosity' },
		{ value: 'responsibility', name: 'Responsibility' },
		{ value: 'team work', name: 'Team work' }
	];

	let selectedGenre = '';
	let selectedCharacter = '';
	let selectedLocation = '';
	let selectedTone = '';
	let selectedTheme = '';
	let extraPrompt = '';
	juggleCreateParams(); // to create intereting stories ;)

	let isTaskInProgress = false;

	async function taskCreateStoryCard() {
		isTaskInProgress = true;
		const res = await self.fetch('/create', {
			method: 'POST',
			body: JSON.stringify({
				type: 'create-story',
				genre: selectedGenre,
				character: selectedCharacter,
				location: selectedLocation,
				tone: selectedTone,
				theme: selectedTheme
			})
		});
		const { storyId } = await res.json<{ storyId: string }>();
		isTaskInProgress = false;

		goto(`/story/${storyId}`);
	}

	function juggleCreateParams() {
		selectedGenre = GENRES[Math.floor(Math.random() * GENRES.length)].value;
		selectedCharacter = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].value;
		selectedLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)].value;
		selectedTone = TONES[Math.floor(Math.random() * TONES.length)].value;
		selectedTheme = THEMES[Math.floor(Math.random() * THEMES.length)].value;
	}
</script>

<svelte:head>
	<title>Create a Story Card</title>
	<meta name="description" content="Create a Story Card using AI with illustrations" />
</svelte:head>

<div>
	<h1 class="my-8 text-4xl font-extrabold">Create a Story Card</h1>
	<div class="rounded-lg border">
		<form class="flow flow-row block text-lg">
			<div class="flex flex-row items-center justify-between border-b bg-gray-100 px-4 py-4">
				<h2 class="inline-block text-xl font-bold">Define a Narrative</h2>
				<Button
					outline
					color="alternative"
					size="xs"
					class="mx-4 animate-bounce hover:animate-none"
					on:click={juggleCreateParams}><HeadExplodeIcon class="me-2 h-4 w-4" />Surprise Me</Button
				>
			</div>
			<div class="px-8 pb-12 pt-4 text-base font-normal leading-[5rem]">
				A
				<span class="font-bold"> Story Card </span>
				with a
				<Label defaultClass="inline-block">
					<span class="hidden">Genre</span>
					<Select class="" items={GENRES} bind:value={selectedGenre} />
				</Label>
				story, about a
				<Label defaultClass="inline-block">
					<span class="hidden">Character</span>
					<Select class="" items={CHARACTERS} bind:value={selectedCharacter} />
				</Label>
				who lives in
				<Label defaultClass="inline-block">
					<span class="hidden">Setting</span>
					<Select class="" items={LOCATIONS} bind:value={selectedLocation} />
				</Label>
				. The story should have
				<Label defaultClass="inline-block">
					<span class="hidden">Tone</span>
					<Select class="" items={TONES} bind:value={selectedTone} />
				</Label>
				tone and revolve around the theme of
				<Label defaultClass="inline-block">
					<span class="hidden">Theme</span>
					<Select class="" items={THEMES} bind:value={selectedTheme} />
				</Label>
				.
				<Label defaultClass="inline-block">
					<span class="hidden">Extra Prompt input</span>
					<Input
						defaultClass="block w-full lg:w-96"
						placeholder="(Optional) Write further story narration"
						bind:value={extraPrompt}
					/>
				</Label>
			</div>
			<div class="flex flex-row-reverse border-t bg-gray-100 px-4 py-4">
				<Button type="submit" color="primary" on:click={taskCreateStoryCard}
					><MagicWandIcon class="me-2 h-4 w-4" />Create</Button
				>
			</div>
		</form>
	</div>
</div>

<Modal bind:open={isTaskInProgress} dismissable={false} size="xs">
	<div class="flew-row flex items-center justify-center">
		<Spinner />
		<p class="ml-4">Creating a Story Card ... (may take a minute or two)</p>
	</div>
</Modal>
