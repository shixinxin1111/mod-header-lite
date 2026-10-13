export function setRowDragPreview(
  rowElement: HTMLElement,
  dataTransfer: DataTransfer,
  offsetX: number,
  offsetY: number,
) {
  const previewElement = rowElement.cloneNode(true);

  if (!(previewElement instanceof HTMLElement)) {
    return;
  }

  previewElement.classList.add('drag-preview');
  previewElement.style.width = `${rowElement.offsetWidth}px`;
  previewElement.style.position = 'fixed';
  previewElement.style.top = '-1000px';
  previewElement.style.left = '-1000px';
  previewElement.style.pointerEvents = 'none';

  document.body.appendChild(previewElement);
  dataTransfer.setDragImage(previewElement, offsetX, offsetY);
  window.setTimeout(() => previewElement.remove(), 0);
}
