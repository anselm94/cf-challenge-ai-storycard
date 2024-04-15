<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import StoryCardPreview from '$lib/client/components/StoryCardPreview.svelte';
	import ImgStyle1 from '$lib/images/styles/style-corryloftis.jpg';
	import ImgStyle2 from '$lib/images/styles/style-jerrypinkney.jpg';
	import ImgStyle3 from '$lib/images/styles/style-jimtoomey.jpg';
	import ImgStyle4 from '$lib/images/styles/style-loisvonbaarle.jpg';
	import ImgStyle5 from '$lib/images/styles/style-martinrowson.jpg';
	import ImgNoneStyle from '$lib/images/styles/style-none.jpg';
	import ImgStyle6 from '$lib/images/styles/style-posysimmonds.jpg';
	import ImgStyle7 from '$lib/images/styles/style-tatsurokiuchi.jpg';
	import type { LangCode } from '$lib/types/types';
	import DownloadIcon from 'flowbite-svelte-icons/DownloadSolid.svelte';
	import TranslateIcon from 'flowbite-svelte-icons/TextSizeOutline.svelte';
	import SettingsIcon from 'flowbite-svelte-icons/UserSettingsSolid.svelte';
	import Banner from 'flowbite-svelte/Banner.svelte';
	import Button from 'flowbite-svelte/Button.svelte';
	import ButtonGroup from 'flowbite-svelte/ButtonGroup.svelte';
	import Input from 'flowbite-svelte/Input.svelte';
	import Label from 'flowbite-svelte/Label.svelte';
	import Modal from 'flowbite-svelte/Modal.svelte';
	import Select from 'flowbite-svelte/Select.svelte';
	import Alert from 'flowbite-svelte/Alert.svelte';
	import Spinner from 'flowbite-svelte/Spinner.svelte';
	import Textarea from 'flowbite-svelte/Textarea.svelte';
	import CheckIcon from 'flowbite-svelte-icons/BadgeCheckSolid.svelte';
	import AlertIcon from 'flowbite-svelte-icons/ExclamationCircleSolid.svelte';
	import type { PageData } from './$types';
	import { Tooltip } from 'flowbite-svelte';

	export let data: PageData;

	let LANGUAGES = [
		{ value: 'en', name: 'English' },
		{ value: 'fr', name: 'French' },
		{ value: 'de', name: 'German' },
		{ value: 'es', name: 'Spanish' },
		{ value: 'pt', name: 'Portuguese' },
		{ value: 'it', name: 'Italian' },
		{ value: 'af', name: 'Afrikaans' },
		{ value: 'ms', name: 'Malay' },
		{ value: 'id', name: 'Indonesian' }
	];

	let ILLUSTRATION_STYLES = [
		{ value: 'none', name: 'None', bg: ImgNoneStyle },
		{ value: 'Corry Loftis', name: 'Artistic', bg: ImgStyle1 },
		{ value: 'Jerry Pinkney', name: 'Comic', bg: ImgStyle2 },
		{ value: 'Jim Toomey', name: 'Comic', bg: ImgStyle3 },
		{ value: 'Lois Von Baarle', name: 'Comic', bg: ImgStyle4 },
		{ value: 'Martin Rowson', name: 'Comic', bg: ImgStyle5 },
		{ value: 'Posy Simmonds', name: 'Comic', bg: ImgStyle6 },
		{ value: 'Tatsuro Kiuchi', name: 'Comic', bg: ImgStyle7 }
	];

	let elStoryCardPreview: StoryCardPreview | undefined;

	let selLanguage: LangCode = 'en';
	let selTranslateLanguage: LangCode = 'en';

	let storyTitleText = data.data.text[selLanguage].title;
	let storyContentText = data.data.text[selLanguage].content;
	let selIllustrationStyle = data.data.illustration.selectedStyle;
	let storyIllusUrl = data.data.illustration.styles[selIllustrationStyle]!.url;

	$: storyLanguages = Object.keys(data.data.text);
	$: contentSafe =
		data.data.contentFilter.text === 'safe' && data.data.contentFilter.illustration === 'safe';

	let isTranslateModalOpen = false;
	let isTaskInProgress = false;

	async function selectLanguage(lang: string) {
		selLanguage = lang as LangCode;
		storyTitleText = data.data.text[selLanguage]!.title;
		storyContentText = data.data.text[selLanguage]!.content;
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
		const res = await self.fetch(`/story/${data.data.id}`, {
			method: 'POST',
			body: JSON.stringify({
				type: 'update-illus-style',
				illustrationStyle: selIllustrationStyle
			})
		});
		isTaskInProgress = false;

		const { illustrationUrl }: { illustrationUrl: string } = await res.json();
		storyIllusUrl = illustrationUrl;

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
			<div class="flex flex-row items-center justify-center">
				<div class="flex flex-1"></div>
				<div class="flex flex-1 flex-row justify-center py-4">
					<ButtonGroup>
						{#each storyLanguages as lang}
							<Button
								color={lang === selLanguage ? 'primary' : 'light'}
								on:click={() => selectLanguage(lang)}
								>{LANGUAGES.filter((l) => l.value === lang)[0].name}</Button
							>
						{/each}
						<Button
							color="light"
							class="bg-gray-200"
							on:click={() => (isTranslateModalOpen = true)}
						>
							<TranslateIcon class="me-2 h-4 w-4" />
							Add translation
						</Button>
					</ButtonGroup>
				</div>
				<div class="flex flex-1 flex-row items-center justify-end">
					<Alert
						color={contentSafe ? 'green' : 'red'}
						border
						class="me-4 flex flex-row items-center px-2 py-2"
					>
						{#if contentSafe}
							<CheckIcon slot="icon" class="h-4 w-4" />
							<span class="font-medium">Safe</span>
						{:else}
							<AlertIcon slot="icon" class="h-4 w-4" />
							<span class="font-medium">Not Safe</span>
						{/if}
					</Alert>
					<Tooltip
						>{contentSafe
							? 'Story & Illustration are verified to be safe for Children'
							: 'Either Story or Illustration has content not suitable for children'}</Tooltip
					>
				</div>
			</div>

			<div class="flex flex-row justify-center">
				<div
					class="mx-4 my-16 inline-block h-auto touch-auto overflow-scroll {contentSafe
						? 'blur-0'
						: 'blur-lg active:blur-0'}"
				>
					<StoryCardPreview
						bind:this={elStoryCardPreview}
						{storyTitleText}
						{storyContentText}
						storyIllusPath={storyIllusUrl}
					/>
				</div>
				{#if !contentSafe}
					<Tooltip open>Content not suitable for children. Click to reveal.</Tooltip>
				{/if}
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
						class={contentSafe ? 'blur-0' : 'blur-sm focus:blur-0'}
						bind:value={storyTitleText}
					/>
				</div>
				<div class="py-4">
					<Label for="story-content" class="mb-2 block">Content</Label>
					<Textarea
						id="story-content"
						name="story-content"
						placeholder="Story Content"
						class="h-56 lg:h-36 xl:h-80 {contentSafe ? 'blur-0' : 'blur-sm focus:blur-0'}"
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

<Banner position="absolute" bannerType="info" dismissable>
	<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
		<span class="me-2 font-bold">Do you know?</span> You can access this link upto 24 hours! Collaborate
		with your friends, download and share your story card!
	</p>
</Banner>

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
