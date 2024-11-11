import { Ref } from 'vue';
import { useUndoRedoStore } from "../store/undoRedoStore";
import {CanvasContext} from "../types/ContextType";

export function histogramEqualization(
{ canvas, ctx }: CanvasContext
) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    // Save the state for undo/redo
    undoRedoStore.saveCanvasState();
    // Step 1: Get the current image data
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;

    // Step 2: Calculate the histogram for each color channel (R, G, B)
    const histogramR = new Array(256).fill(0);
    const histogramG = new Array(256).fill(0);
    const histogramB = new Array(256).fill(0);

    // Step 3: Populate histograms
    for (let i = 0; i < data.length; i += 4) {
        histogramR[data[i]]++;      // R channel
        histogramG[data[i + 1]]++;  // G channel
        histogramB[data[i + 2]]++;  // B channel
    }

    // Step 4: Calculate the cumulative distribution function (CDF)
    const cdfR = new Array(256).fill(0);
    const cdfG = new Array(256).fill(0);
    const cdfB = new Array(256).fill(0);

    cdfR[0] = histogramR[0];
    cdfG[0] = histogramG[0];
    cdfB[0] = histogramB[0];

    for (let i = 1; i < 256; i++) {
        cdfR[i] = cdfR[i - 1] + histogramR[i];
        cdfG[i] = cdfG[i - 1] + histogramG[i];
        cdfB[i] = cdfB[i - 1] + histogramB[i];
    }

    // Step 5: Normalize the CDF to the range [0, 255]
    const totalPixels = canvas.value.width * canvas.value.height;
    const scale = 255 / totalPixels;

    for (let i = 0; i < 256; i++) {
        cdfR[i] = Math.round(cdfR[i] * scale);
        cdfG[i] = Math.round(cdfG[i] * scale);
        cdfB[i] = Math.round(cdfB[i] * scale);
    }

    // Step 6: Apply the equalization to the pixel data
    for (let i = 0; i < data.length; i += 4) {
        // Apply the new pixel value from the CDF to each channel
        data[i] = cdfR[data[i]];        // R channel
        data[i + 1] = cdfG[data[i + 1]]; // G channel
        data[i + 2] = cdfB[data[i + 2]]; // B channel
    }

    // Step 7: Put the updated image data back onto the canvas
    ctx.value.putImageData(imageData, 0, 0);


}
