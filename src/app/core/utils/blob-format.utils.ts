import {Image} from '../models/interfaces/images/image';

export function base64ToBlob(base64Data: string, contentType: string): Blob {
  const base64Content = base64Data.split(',')[1] || base64Data;

  const byteCharacters = atob(base64Content);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

export function imageToFile(image: Image): File {
  const blob = base64ToBlob(image.base64Data, image.contentType);

  const fileName = image.key.split('/').pop() || 'file';

  return new File(
    [blob],
    fileName,
    {
      type: image.contentType,
      lastModified: new Date(image.lastModified).getTime()
    }
  );
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);

    reader.readAsArrayBuffer(file);
  });
}
