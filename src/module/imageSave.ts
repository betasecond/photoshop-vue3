import {useUndoRedoStore} from "../store/undoRedoStore";

export function saveImage(canvas: Ref<HTMLCanvasElement | null>) {
    if (!canvas.value) return;

    const dataURL = canvas.value.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.png';
    link.click();
}

