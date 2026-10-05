// THIS CODE IS FOR FEACHING THE ASSETS (IMAGES & VIDEOS)
// Downloads the 8 scene images and the scene 7 -> 8 morph video that were generated
// on Higgsfield into public/images and public/videos.
//
//   npm run fetch-assets                  download everything
//   npm run fetch-assets -- --if-missing  skip files that are already there
//
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3KI4iV0lcf6SL7S9flUzJTe1wy8/';

const files = [
  ['hf_20261005_205522_7c22f66c-3795-489c-b506-f2a2baa0ed54.png', 'public/images/scene-1.png'],
  ['hf_20261005_205548_931d44ae-cf3d-46ad-8830-00054a71ea4b.png', 'public/images/scene-2.png'],
  ['hf_20261005_205612_8bf4458b-096e-4e85-a75d-11f105be8d30.png', 'public/images/scene-3.png'],
  ['hf_20261005_205548_2042f829-db5f-48ad-bc76-e82dfef9e4ef.png', 'public/images/scene-4.png'],
  ['hf_20261005_205637_3f02c285-72fa-4979-b80e-37ed723cccba.png', 'public/images/scene-5.png'],
  ['hf_20261005_205548_2b111204-b1c3-42b2-ae64-e7033a0ea16a.png', 'public/images/scene-6.png'],
  ['hf_20261005_205548_78f7e33b-f4b1-479c-8ca0-13449b4464e9.png', 'public/images/scene-7.png'],
  ['hf_20261005_205700_1f241efb-5fa8-46f4-9b89-76d8eeec173f.png', 'public/images/scene-8.png'],
  ['hf_20261005_210533_266c7923-4bfc-444a-a066-6cfe6c015bc4.mp4', 'public/videos/morph-7-8.mp4'],
];

const onlyMissing = process.argv.includes('--if-missing');
const exists = (p) => access(p).then(() => true, () => false);

let failed = 0;
for (const [remote, local] of files) {
  const dest = resolve(root, local);
  if (onlyMissing && (await exists(dest))) {
    console.log(`skip   ${local}`);
    continue;
  }
  try {
    const res = await fetch(CDN + remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`saved  ${local}`);
  } catch (err) {
    failed += 1;
    console.error(`FAILED ${local}: ${err.message}`);
  }
}

if (failed) {
  console.error(`\n${failed} file(s) could not be downloaded. Save them by hand into public/images and public/videos (see README).`);
  process.exit(1);
}
