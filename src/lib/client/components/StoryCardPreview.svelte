<script lang="ts">
	import ImgCardMask from '$lib/images/story-postcard-mask.png';
	import { FabricImage, StaticCanvas, Textbox } from 'fabric';
	import FontFaceObserver from 'fontfaceobserver';
	import { afterUpdate, onMount } from 'svelte';

	export let storyTitleText: string;
	export let storyContentText: string;
	export let storyIllusPath: string;

	let elCanvas: HTMLCanvasElement;
	let fCanvas: StaticCanvas | undefined;

	onMount(async () => {
		fCanvas = new StaticCanvas(elCanvas, {
			enableRetinaScaling: true
		});
	});

	afterUpdate(() => {
		renderCanvas();
	});

	async function renderCanvas() {
		fCanvas?.clear();

		await new FontFaceObserver('Chewy').load();
		await new FontFaceObserver('Poppins').load();

		let fImageGrungeBorder = await FabricImage.fromURL(
			ImgCardMask,
			{},
			{
				left: 0,
				top: 0
			}
		);

		let fTextboxStoryTitle = new Textbox(storyTitleText, {
			left: 360,
			top: 24,
			width: 360,
			fontSize: 22,
			fontFamily: 'Chewy',
			fill: '#6B4600',
			textAlign: 'center',
			editable: false
		});

		let fTextboxStoryContent = new Textbox(storyContentText, {
			left: 380,
			top: 65,
			width: 320,
			height: 420,
			fontSize: 15 * (650 / storyContentText.length), // to fit in variable text size
			isWrapping: true,
			editable: false,
			fontFamily: 'Poppins',
			fill: '#6B4600',
			lineHeight: 1.3,
			textAlign: 'center'
		});
		// fTextboxStoryContent.centerV()

		let fImageIllus = await FabricImage.fromURL(
			storyIllusPath,
			{},
			{
				left: 0,
				top: 0
			}
		);
		fImageIllus.scaleToHeight(480);

		fCanvas?.add(fImageIllus);
		fCanvas?.add(fImageGrungeBorder);
		fCanvas?.add(fTextboxStoryTitle);
		fCanvas?.add(fTextboxStoryContent);
	}

	export function downloadImage() {
		const dataUrl = fCanvas?.toDataURL({ format: 'png', multiplier: 2 });
		if (dataUrl) {
			const link = document.createElement('a');
			link.href = dataUrl;
			link.download = `${storyTitleText.toLowerCase().replaceAll(' ', '-')}-storycard.png`;
			link.click();
			link.remove();
		}
	}
</script>

<canvas bind:this={elCanvas} id="card-editor" width="720" height="480" class="border"></canvas>
