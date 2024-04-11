<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import StoryCardPreview from '$lib/client/components/StoryCardPreview.svelte';
	import DownloadIcon from 'flowbite-svelte-icons/DownloadSolid.svelte';
	import TranslateIcon from 'flowbite-svelte-icons/TextSizeOutline.svelte';
	import SettingsIcon from 'flowbite-svelte-icons/UserSettingsSolid.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import Select from 'flowbite-svelte/Select.svelte';
	import Spinner from 'flowbite-svelte/Spinner.svelte';
	import Textarea from 'flowbite-svelte/Textarea.svelte';
	import type { PageData } from './$types';
	import type { LangCode } from './+page.server';

	export let data: PageData;

	let LANGUAGES = [
		{ value: 'en', name: 'English' },
		{ value: 'de', name: 'German' },
		{ value: 'es', name: 'Spanish' },
		{ value: 'pt', name: 'Portuguese' }
	];

	let ILLUSTRATION_STYLES = [
		{ value: 'none', name: 'None', bg: 'https://i.pravatar.cc/100' },
		{ value: 'artistic', name: 'Artistic', bg: 'https://i.pravatar.cc/100' },
		{ value: 'comic', name: 'Comic', bg: 'https://i.pravatar.cc/100' }
	];

	let elStoryCardPreview: StoryCardPreview | undefined;

	let selLanguage: LangCode = 'en';
	let selTranslateLanguage: LangCode = 'en';

	let storyTitleText = data.data.text[selLanguage].title;
	let storyContentText = data.data.text[selLanguage].content;
	let selIllustrationStyle = data.data.illustration.selectedStyle;
	let storyIllusUrl = data.data.illustration.styles[selIllustrationStyle].url;

	$: storyLanguages = Object.keys(data.data.text);

	let isTranslateModalOpen = false;
	let isTaskInProgress = false;

	async function selectLanguage(lang: string) {
		selLanguage = lang as LangCode;
		storyTitleText = data.data.text[selLanguage].title;
		storyContentText = data.data.text[selLanguage].content;
	}

	async function taskTranslateLanguage() {
		isTaskInProgress = true;
		await self.fetch(`/story/${data.data.id}`, {
			method: 'POST',
			body: JSON.stringify({ type: 'translate', language: selTranslateLanguage })
		});
		isTaskInProgress = false;
		return invalidateAll();
	}

	async function taskUpdateText() {
		isTaskInProgress = true;
		await self.fetch(`/story/${data.data.id}`, {
			method: 'POST',
			body: JSON.stringify({
				type: 'update-text',
				language: selLanguage,
				storyTitle: storyTitleText,
				storyContent: storyContentText
			})
		});
		isTaskInProgress = false;
		return invalidateAll();
	}

	async function taskUpdateIllusStyle() {
		isTaskInProgress = true;
		await self.fetch(`/story/${data.data.id}`, {
			method: 'POST',
			body: JSON.stringify({
				type: 'update-illus-style',
				illustrationStyle: selIllustrationStyle
			})
		});
		isTaskInProgress = false;
		return invalidateAll();
	}
</script>

<svelte:head>
	<title>Edit and Download Story Card</title>
	<meta name="description" content="Edit, translate, transform and download your Story Card" />
</svelte:head>

<div>
	<h1 class="my-8 text-4xl font-extrabold">Story Card</h1>
	<div class="flex flex-col overflow-hidden rounded-lg border bg-clip-border xl:flex-row">
		<div class="flex basis-3/4 flex-col border-b bg-gray-50 xl:border-r">
			<div class="flex flex-row-reverse border-b bg-white p-4">
				<Button size="xs" color="alternative" on:click={() => elStoryCardPreview?.downloadImage()}>
					<DownloadIcon class="me-2 h-3.5 w-3.5" />Download</Button
				>
			</div>
			<div class="flex flex-row justify-center py-4">
				<ButtonGroup>
					{#each storyLanguages as lang}
						<Button
							color={lang === selLanguage ? 'primary' : 'light'}
							on:click={() => selectLanguage(lang)}
							>{LANGUAGES.filter((l) => l.value === lang)[0].name}</Button
						>
					{/each}
					<Button color="light" class="bg-gray-200" on:click={() => (isTranslateModalOpen = true)}>
						<TranslateIcon class="me-2 h-4 w-4" />
						Add translation
					</Button>
				</ButtonGroup>
			</div>
			<div class="flex flex-row justify-center">
				<div class="inline-block touch-auto overflow-scroll px-4 py-16">
					<StoryCardPreview
						bind:this={elStoryCardPreview}
						bind:storyTitleText
						bind:storyContentText
						bind:storyIllusPath={storyIllusUrl}
					/>
				</div>
			</div>
		</div>
		<div class="basis-1/4">
			<div class="overflow-hidden border-b bg-gray-50 px-4 py-4">
				<h5 class="flex flex-row items-center text-xl font-bold text-gray-800">
					<SettingsIcon class="me-2 h-5 w-5" /> Tweak
				</h5>
			</div>
			<div class="mx-4 flex flex-col border-b">
				<div class="flex flex-row items-center py-4 text-lg font-medium">
					<span class="me-1.5 font-bold">Restyle</span> Illustration
				</div>
				<div class="grid grid-cols-3 gap-4 pb-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-3">
					{#each ILLUSTRATION_STYLES as style}
						<label class="hidden" for={style.value}>{style.value}</label>
						<input
							class="h-20 w-20 cursor-pointer rounded-lg border bg-cover text-sm checked:bg-cover checked:ring-4 checked:ring-primary-800 xl:h-16 xl:w-16 2xl:h-24 2xl:w-24"
							type="radio"
							id={style.value}
							name="illustration-style"
							bind:group={selIllustrationStyle}
							value={style.value}
							style="background-image: url('{style.bg}');"
							checked={style.value === selIllustrationStyle}
						/>
					{/each}
				</div>
				<div class="flex flex-row-reverse items-center px-2 pb-4 pt-2">
					<Button outline color="alternative" size="xs" on:click={taskUpdateIllusStyle}
						>Apply</Button
					>
				</div>
			</div>
			<div class="mx-4 mb-4 flex flex-col">
				<div class="flex flex-row items-center py-4 text-lg font-medium">
					<span class="me-1.5 font-bold">Edit</span> Text
				</div>
				<input type="hidden" name="language" value={selLanguage} />
				<div class="pb-4">
					<Label for="story-title" class="mb-2 block">Title</Label>
					<Input
						id="story-title"
						name="story-title"
						placeholder="Story Title"
						type="text"
						bind:value={storyTitleText}
					/>
				</div>
				<div class="py-4">
					<Label for="story-content" class="mb-2 block">Content</Label>
					<Textarea
						id="story-content"
						name="story-content"
						placeholder="Story Content"
						class="h-56 lg:h-36 xl:h-80"
						bind:value={storyContentText}
					/>
				</div>
				<div class="flex flex-row-reverse items-center px-2">
					<Button outline color="alternative" size="xs" type="submit" on:click={taskUpdateText}
						>Save</Button
					>
				</div>
			</div>
		</div>
	</div>
</div>
<Modal title="Translate Story Card" bind:open={isTranslateModalOpen} autoclose>
	<Label>
		Select Language
		<Select
			name="language"
			class="mt-2"
			items={LANGUAGES.filter((item) => !storyLanguages.includes(item.value))}
			bind:value={selTranslateLanguage}
		/>
	</Label>
	<svelte:fragment slot="footer">
		<Button on:click={taskTranslateLanguage}>Translate</Button>
	</svelte:fragment>
</Modal>

<Modal open={isTaskInProgress} dismissable={false} size="xs">
	<div class="flew-row flex items-center justify-center">
		<Spinner />
		<p class="ml-4">In Progress ...</p>
	</div>
</Modal>
