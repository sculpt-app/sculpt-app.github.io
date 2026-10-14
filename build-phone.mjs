import { writeFile } from 'node:fs/promises';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createPhoneModel } from './src/phone-model.js';
// Node provides Blob; GLTFExporter's binary writer also expects FileReader.
class BlobReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }).catch(error => this.onerror?.(error));
  }
}
globalThis.FileReader = BlobReader;
const model = createPhoneModel();
const binary = await new GLTFExporter().parseAsync(model, { binary: true, onlyVisible: true });
await writeFile('assets/iphone.glb', Buffer.from(binary));
console.log(`iPhone model: ${binary.byteLength} bytes`);
