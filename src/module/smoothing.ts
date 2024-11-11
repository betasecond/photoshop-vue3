import { useUndoRedoStore } from "../store/undoRedoStore";

export function smoothing({ canvas, ctx }: CanvasContext, radius: number) {
    const undoRedoStore = useUndoRedoStore();

    if (!canvas.value || !ctx.value) {
        console.error('Canvas or context is missing.');
        return;
    }
    // Save the canvas state for undo/redo functionality
    undoRedoStore.saveCanvasState();
    // Get the current image data from the canvas
    const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const data = imageData.data;

    // Iterate over every pixel in the canvas
    for (let y = 0; y < canvas.value.height; y++) {
        for (let x = 0; x < canvas.value.width; x++) {
            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;

            // Apply a box blur kernel (simple averaging of neighboring pixels)
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // Skip pixels outside the canvas
                    if (nx >= 0 && nx < canvas.value.width && ny >= 0 && ny < canvas.value.height) {
                        const idx = (ny * canvas.value.width + nx) * 4;
                        r += data[idx];     // Red
                        g += data[idx + 1]; // Green
                        b += data[idx + 2]; // Blue
                        a += data[idx + 3]; // Alpha
                        count++;
                    }
                }
            }

            // Set the new pixel value (average)
            const idx = (y * canvas.value.width + x) * 4;
            data[idx] = r / count;       // Red
            data[idx + 1] = g / count;   // Green
            data[idx + 2] = b / count;   // Blue
            data[idx + 3] = a / count;   // Alpha
        }
    }

    // Put the modified image data back to the canvas
    ctx.value.putImageData(imageData, 0, 0);


}
