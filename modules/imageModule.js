import StorageManager from './base/storageModule.js';

export default class ImageUploader {
  static saveImage(productId, file) {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.addEventListener('load', () => {
      const url = fr.result;
      console.log('File read successfully:', url); // Debugging log
      let imags = StorageManager.load('imags') || [];
      console.log('Loaded images:', imags); // Debugging log
      imags.push({ productId, url });
      StorageManager.save('imags', imags);
      console.log('Image saved:', imags); // Debugging log
    });
  }

  static updateImage(productId, file) {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.addEventListener('load', () => {
      const url = fr.result;
      console.log('File read successfully:', url); // Debugging log
      let imags = StorageManager.load('imags') || [];
      console.log('Loaded images:', imags); // Debugging log
      const index = imags.findIndex(img => img.productId === productId);
      if (index !== -1) {
        imags[index].url = url;
        StorageManager.save('imags', imags);
        console.log('Image updated:', imags); // Debugging log
      }
    });
  }

  static deleteImage(productId) {
    let imags = StorageManager.load('imags') || [];
    console.log('Loaded images:', imags); // Debugging log
    const index = imags.findIndex(img => img.productId === productId);
    if (index !== -1) {
      imags.splice(index, 1);
      StorageManager.save('imags', imags);
      console.log('Image deleted:', imags); // Debugging log
    }
  }

  static getImagesByProductId(productId) {
    const imags = StorageManager.load('imags') || [];
    console.log('Loaded images for retrieval:', imags); // Debugging log
    const imageData = imags.find(img => img.productId === productId);
    if (imageData) {
      const img = new Image();
      img.src = imageData.url;
      console.log('Loaded images for retrieval:', img); // Debugging log

      return img;
    }
    return null;
  }
}
