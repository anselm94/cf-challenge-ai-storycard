<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { FabricImage, StaticCanvas, Textbox } from 'fabric';
	import FontFaceObserver from 'fontfaceobserver';
	import ImgCardMask from '$lib/images/story-postcard-mask.png';

	export let storyTitleText: string;
	export let storyContentText: string;
	export let storyIllusPath: string;

	let elCanvas: HTMLCanvasElement;
	let fCanvas: StaticCanvas | undefined;
	let fTextboxStoryTitle: Textbox | undefined;
	let fTextboxStoryContent: Textbox | undefined;
	let fImageIllus: FabricImage | undefined;
	let fImageGrungeBorder: FabricImage | undefined;

	onMount(async () => {
		fCanvas = new StaticCanvas(elCanvas, {
			enableRetinaScaling: true
		});

		await new FontFaceObserver('Chewy').load();
		await new FontFaceObserver('Poppins').load();

		fImageGrungeBorder = await FabricImage.fromURL(ImgCardMask);
		fImageGrungeBorder.left = 0;
		fImageGrungeBorder.top = 0;

		fTextboxStoryTitle = new Textbox(storyTitleText, {
			left: 360,
			top: 24,
			width: 360,
			fontSize: 22,
			fontFamily: 'Chewy',
			fill: '#6B4600',
			textAlign: 'center',
			editable: false
		});

		fTextboxStoryContent = new Textbox(storyContentText, {
			left: 380,
			top: 70,
			width: 320,
			height: 420,
			fontSize: 15,
			isWrapping: true,
			editable: false,
			fontFamily: 'Poppins',
			fill: '#6B4600',
			lineHeight: 1.3,
			textAlign: 'center'
		});
		// fTextboxStoryContent.centerV()

		fCanvas?.add(fTextboxStoryTitle);
		fCanvas?.add(fTextboxStoryContent);
	});

	afterUpdate(() => {
		fTextboxStoryTitle?.set({ text: storyTitleText });
		fTextboxStoryContent?.set({ text: storyContentText });
		renderIllustration();
	});

	async function renderIllustration() {
		if (!storyIllusPath) {
			return;
		}

		if (fImageIllus) {
			fCanvas?.remove(fImageIllus);
		}

		fImageIllus = await FabricImage.fromURL(storyIllusPath);
		fImageIllus.left = 0;
		fImageIllus.top = 0;
		fImageIllus.scaleToHeight(480);

		fCanvas?.add(fImageIllus);

		fCanvas?.bringObjectForward(fImageGrungeBorder!);
		fCanvas?.bringObjectToFront(fTextboxStoryTitle!);
		fCanvas?.bringObjectToFront(fTextboxStoryContent!);
		fCanvas?.sendObjectToBack(fImageIllus);

		fCanvas?.renderAll();
	}

	export function downloadImage() {
		const dataUrl = fCanvas?.toDataURL({ format: 'png', multiplier: 2 });
		if (dataUrl) {
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = 'storybook.png';
			link.click();
			link.remove();
		}
	}
</script>

<canvas bind:this={elCanvas} id="card-editor" width="720" height="480" class="border"></canvas>
