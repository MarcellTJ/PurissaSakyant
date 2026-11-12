export async function api(path, options = {}) {
  const response = await fetch('/api/admin/' + path, {
    credentials: 'same-origin',
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || 'Permintaan gagal.');
    error.status = response.status;
    throw error;
  }
  return data;
}
export async function prepareImage(file) {
  if (
    !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  )
    throw new Error('Gunakan JPG, PNG, atau WebP, maksimal 5 MB per gambar.');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error('Gambar tidak dapat diproses.')),
      'image/webp',
      0.86,
    ),
  );
}
