<script lang="ts">
	import { onMount } from 'svelte';
	import { fabric } from 'fabric';
    import FontFaceObserver from 'fontfaceobserver';
	import ImgCardMask from '$lib/images/story-postcard-mask.png';
	import ImgIllus from '$lib/images/storybook-illus.png';

	let txtTitle: string = `The Girl and the Magic Aquarium`;
	let txtBody: string = `Once upon a time, in a quaint little seaside town, lived a curious girl named Mia. One sunny afternoon, she visited the local aquarium for the very first time. As she approached the vast tank filled with colorful fish, her eyes widened in awe. The rainbow-hued angelfish danced gracefully, while the playful clownfish hid among the coral. Mia was mesmerized by the gentle sway of the sea anemone and the graceful glide of the stingrays. She spent hours watching the underwater ballet, her heart filled with wonder and delight. The magic of the aquarium had cast its spell on Mia, igniting a lifelong love for the ocean and its wondrous inhabitants.`;

	let elCanvas: HTMLCanvasElement;
	let fabricCanvas: fabric.Canvas | undefined;
	let txtbxStoryTitle: fabric.Textbox | undefined;
	let txtbxStoryBody: fabric.Textbox | undefined;

	$: if (txtbxStoryTitle) {
		txtbxStoryTitle.text = txtTitle;
		fabricCanvas?.renderAll();
	}

	$: if (txtbxStoryBody) {
		txtbxStoryBody.text = txtBody;
		fabricCanvas?.renderAll();
	}

	const fabricLoadImage = (url: string) =>
		new Promise<fabric.Image>((resolve) => fabric.Image.fromURL(url, (img) => resolve(img)));

	onMount(async () => {
		fabricCanvas = new fabric.Canvas(elCanvas, {
			enableRetinaScaling: true
		});

        await new FontFaceObserver('Chewy').load();
        await new FontFaceObserver('Poppins').load();

		const imgGrungeBorder = await fabricLoadImage(ImgCardMask);
        imgGrungeBorder.left = 0;
        imgGrungeBorder.top = 0;
		imgGrungeBorder.selectable = false;

        const imgIllus = await fabricLoadImage(ImgIllus)
        imgIllus.left = 0;
        imgIllus.top = 0;
        imgIllus.scaleToHeight(480);
        imgIllus.selectable = false;

		// fabricCanvas.skipTargetFind = true; // disable interaction
		txtbxStoryTitle = new fabric.Textbox(txtTitle, {
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

		txtbxStoryBody = new fabric.Textbox(txtBody, {
			left: 380,
			top: 65,
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

		fabricCanvas?.add(imgIllus);
		fabricCanvas?.add(imgGrungeBorder);
		fabricCanvas?.add(txtbxStoryTitle);
		fabricCanvas?.add(txtbxStoryBody);

        // txtbxStoryBody.centerV()
        
		fabricCanvas?.renderAll();
	});

    function downloadImage() {
        const dataUrl = fabricCanvas?.toDataURL({ format: 'png', multiplier: 2 });
        if (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'storybook.png';
            link.click();
            link.remove();
        }
    }
</script>

<div class="flex flex-col h-full w-full items-center justify-center">
	<input bind:value={txtTitle} type="text" placeholder="Title" class="input w-64 mb-4" />
	<textarea bind:value={txtBody} placeholder="Title" class="input w-96 mb-4" />
    <button class="btn btn-sm variant-ghost-surface mb-4" on:click={downloadImage}>Download</button>
	<canvas
		bind:this={elCanvas}
		id="card-editor"
		width="720"
		height="480"
		class="w-24 border-2 border-primary-900"
	></canvas>
</div>
