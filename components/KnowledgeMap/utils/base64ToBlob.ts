/*
 * @Author: tohsaka888
 * @Date: 2022-08-04 10:46:33
 * @LastEditors: tohsaka888
 * @LastEditTime: 2022-08-04 10:46:34
 * @Description: 请填写简介
 */

export const base64ToBlob = (code: string) => {
  let parts = code.split(';base64,');
  let contentType = parts[0].split(':')[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {
    type: contentType
  })
}
