// utils/imageHelpers.js
export function isExternalImage(src){
    return src.startsWith('http://') || src.startsWith('https://');
  }