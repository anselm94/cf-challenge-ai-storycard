<script lang="ts">
	import { onMount } from 'svelte';
	import * as fabric from 'fabric';
	import FontFaceObserver from 'fontfaceobserver';
	import ImgCardMask from '$lib/images/story-postcard-mask.png';

	export let storyTitleText = ``;
	export let storyContentText = ``;
	export let storyIllusPath = ``;

	let elCanvas: HTMLCanvasElement;
	let fCanvas: fabric.Canvas | undefined;
	let fTextboxStoryTitle: fabric.Textbox | undefined;
	let fTextboxStoryContent: fabric.Textbox | undefined;
	let fImageIllus: fabric.FabricImage | undefined;
	let fImageGrungeBorder: fabric.FabricImage | undefined;

	$: if (fTextboxStoryTitle) {
		fTextboxStoryTitle.text = storyTitleText;
		fCanvas?.renderAll();
	}

	$: if (fTextboxStoryContent) {
		fTextboxStoryContent.text = storyContentText;
		fCanvas?.renderAll();
	}

	onMount(async () => {
		fCanvas = new fabric.Canvas(elCanvas, {
			enableRetinaScaling: true
		});
		fCanvas.skipTargetFind = true; // disable interaction

		await new FontFaceObserver('Chewy').load();
		await new FontFaceObserver('Poppins').load();

		fImageGrungeBorder = await fabric.FabricImage.fromURL(ImgCardMask);
		fImageGrungeBorder.left = 0;
		fImageGrungeBorder.top = 0;
		fImageGrungeBorder.selectable = false;

		fTextboxStoryTitle = new fabric.Textbox(storyTitleText, {
			left: 360,
			top: 24,
			width: 360,
			fontSize: 22,
			fontFamily: 'Chewy',
			fill: '#6B4600',
			textAlign: 'center',
			editable: false,
			selectable: false
		});

		fTextboxStoryContent = new fabric.Textbox(storyContentText, {
			left: 380,
			top: 70,
			width: 320,
			height: 420,
			fontSize: 15,
			isWrapping: true,
			editable: false,
			selectable: false,
			fontFamily: 'Poppins',
			fill: '#6B4600',
			lineHeight: 1.3,
			textAlign: 'center'
		});
		// fTextboxStoryContent.centerV()

		fCanvas?.add(fTextboxStoryTitle);
		fCanvas?.add(fTextboxStoryContent);
		fCanvas?.renderAll();

		await renderIllustration();
	});

	async function renderIllustration() {
		if (!storyIllusPath) {
			return;
		}

		if (fImageIllus) {
			fCanvas?.remove(fImageIllus);
		}

		fImageIllus = await fabric.FabricImage.fromURL(storyIllusPath);
		fImageIllus.left = 0;
		fImageIllus.top = 0;
		fImageIllus.scaleToHeight(480);
		fImageIllus.selectable = false;

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
