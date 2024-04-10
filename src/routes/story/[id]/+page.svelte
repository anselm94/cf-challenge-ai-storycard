<script lang="ts">
	import StoryCardPreview from '$lib/client/components/StoryCardPreview.svelte';
	import ImgIllus from '$lib/images/storybook-illus.png';
	import DownloadIcon from 'flowbite-svelte-icons/DownloadSolid.svelte';
	import ImageIcon from 'flowbite-svelte-icons/ImageSolid.svelte';
	import TranslateIcon from 'flowbite-svelte-icons/TextSizeOutline.svelte';
	import SettingsIcon from 'flowbite-svelte-icons/UserSettingsSolid.svelte';
	import TextIcon from 'flowbite-svelte-icons/LetterItalicOutline.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import Select from 'flowbite-svelte/Select.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Textarea from 'flowbite-svelte/Textarea.svelte';

	let LANGUAGES = [
		{ value: 'en', name: 'English' },
		{ value: 'de', name: 'German' },
		{ value: 'es', name: 'Spanish' }
	];

	let ILLUSTRATION_STYLES = [
		{ value: 'none', name: 'None' },
		{ value: 'artistic', name: 'Artistic' },
		{ value: 'comic', name: 'Comic' }
	];

	export let storyTitleText: string = `The Girl and the Magic Aquarium`;
	export let storyContentText: string = `Once upon a time, in a quaint little seaside town, lived a curious girl named Mia. One sunny afternoon, she visited the local aquarium for the very first time. As she approached the vast tank filled with colorful fish, her eyes widened in awe. The rainbow-hued angelfish danced gracefully, while the playful clownfish hid among the coral. Mia was mesmerized by the gentle sway of the sea anemone and the graceful glide of the stingrays. She spent hours watching the underwater ballet, her heart filled with wonder and delight. The magic of the aquarium had cast its spell on Mia, igniting a lifelong love for the ocean and its wondrous inhabitants.`;
	export let storyIllusPath: string = ImgIllus;

	let translatedLanguages = [{ value: 'en', name: 'English' }];

	let isTranslateModalOpen = false;
</script>

<svelte:head>
	<title>Edit and Download Story Card</title>
	<meta name="description" content="Edit, translate, transform and download your Story Card" />
</svelte:head>

<div>
	<h1 class="my-8 text-4xl font-extrabold">Story Card</h1>
	<div class="flex flex-col rounded-lg border xl:flex-row">
		<div class="flex basis-3/4 flex-col border-b bg-gray-50 xl:border-r">
			<div class="flex flex-row-reverse border-b bg-white p-4">
				<Button size="xs" color="alternative"
					><DownloadIcon class="me-2 h-3.5 w-3.5" />Download</Button
				>
			</div>
			<div class="flex flex-row justify-center py-4">
				<ButtonGroup>
					{#each translatedLanguages as lang}
						<Button>{lang.name}</Button>
					{/each}
					<Button color="light" class="bg-gray-200" on:click={() => (isTranslateModalOpen = true)}>
						<TranslateIcon class="me-2 h-4 w-4" />
						Add translation
					</Button>
				</ButtonGroup>
			</div>
			<div class="flex flex-row justify-center">
				<div class="inline-block touch-auto overflow-scroll px-4 py-36">
					<StoryCardPreview bind:storyTitleText bind:storyContentText bind:storyIllusPath />
				</div>
			</div>
		</div>
		<div class="basis-1/4">
			<h5 class="flex w-full flex-row items-center px-4 pb-8 pt-8 text-xl font-bold">
				<SettingsIcon class="me-2 h-5 w-5" /> Tweak
			</h5>
			<div class="mx-4 mb-8 flex flex-col rounded-lg border">
				<div class="flex flex-row items-center border-b bg-gray-50 px-4 py-4 text-lg font-medium">
					<ImageIcon class="me-2 h-5 w-5" /><span class="me-2 italic">Restyle</span> Story Illustration
				</div>
				<div
					class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-3 gap-4 px-4 py-4"
				>
					{#each ILLUSTRATION_STYLES as style}
						<div
							class="flex h-20 w-20 cursor-pointer flex-row items-center justify-center rounded-lg border text-sm hover:border-primary-300 xl:h-16 xl:w-16 2xl:h-24 2xl:w-24"
						>
							{style.name}
						</div>
					{/each}
				</div>
				<div class="flex flex-row-reverse items-center border-t px-2 py-2">
					<Button outline color="alternative" size="xs">Apply</Button>
				</div>
			</div>
			<div class="mx-4 mb-8 flex flex-col rounded-lg border">
				<div class="flex flex-row items-center border-b bg-gray-50 px-4 py-4 text-lg font-medium">
					<TextIcon class="me-2 h-5 w-5" /> Story Text
				</div>
				<div class="px-4 py-4">
					<Label for="story-title" class="mb-2 block">Title</Label>
					<Input
						id="story-title"
						placeholder="Story Title"
						type="text"
						bind:value={storyTitleText}
					/>
				</div>
				<div class="px-4 py-4">
					<Label for="story-content" class="mb-2 block">Content</Label>
					<Textarea
						id="story-content"
						placeholder="Story Content"
						class="h-56 lg:h-36 xl:h-80"
						bind:value={storyContentText}
					/>
				</div>
			</div>
		</div>
	</div>
	<form>
		<Modal title="Translate Story Card" bind:open={isTranslateModalOpen} autoclose>
			<Label>
				Select an option
				<Select
					class="mt-2"
					items={LANGUAGES.filter((item) =>
						translatedLanguages.some((i) => i.value !== item.value)
					)}
				/>
			</Label>
			<svelte:fragment slot="footer">
				<Button type="submit">Translate</Button>
			</svelte:fragment>
		</Modal>
	</form>
</div>
