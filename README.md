# Saudi Coffee | القهوة السعودية

A scroll-driven cinematic journey of Saudi coffee, from the mountain to the cup. Built with React and Vite, in Arabic and English, with no animation libraries.

Eight scenes: the mountain farm, ripe cherries, the harvest, drying, roasting, cardamom and spice, the dallah, and the cup of welcome.

## How it works

- Each scene is one full-screen image. The page is very tall and the stage is `position: sticky`, so scrolling moves a progress value instead of moving the page.
- That value is eased (a small damping loop) and drives each scene's fade, zoom and caption position.
- The step from scene 7 (dallah) to scene 8 (the cup) is an AI-generated morph video. Its playhead is scrubbed by scroll, so scrolling plays it forwards and backwards.
- Every other step uses a zoom and crossfade with drifting ember specks that speed up as you scroll.
- If an image or the video is missing, the site still works: it shows a coloured gradient or falls back to the crossfade.
- `prefers-reduced-motion` turns off the zoom, easing and particles.

## Run it

```bash
npm install
npm run fetch-assets   # downloads the 8 images and the morph video into public/
npm run dev
```

If `fetch-assets` cannot reach the links, save the files by hand:

| File | Scene |
| --- | --- |
| `public/images/scene-1.png` … `scene-8.png` | the 8 stills, in order |
| `public/videos/morph-7-8.mp4` | the dallah-to-cup morph |

Commit them to the repo so the site does not depend on the download links.

### Smoother video scrubbing (recommended)

Scrubbing is smoothest when every frame is a keyframe. Re-encode the clip once:

```bash
ffmpeg -i morph-7-8.mp4 -c:v libx264 -g 1 -crf 20 -pix_fmt yuv420p -an -movflags +faststart public/videos/morph-7-8.mp4
```

## Edit the story

Everything lives in `src/scenes.js`: the Arabic and English titles, captions and alt text for each scene, plus the intro and closing lines. To change which step uses the video, change `VIDEO.from`.

Please double-check any facts you add before publishing.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

1. Push the repo to GitHub as `saudi-coffee`.
2. In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Push again, or run the workflow from the **Actions** tab. The site appears at `https://<your-username>.github.io/saudi-coffee/`.

## Credits

Images and video were generated with Higgsfield. Fonts: Amiri, Cairo and Cormorant Garamond from Google Fonts.
