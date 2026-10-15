# Adding videos

Films are plain files in `public/`, committed to git and served from the site.
Sanity only stores their paths. Every film has three copies or companions:

| File | Where | Used by |
| --- | --- | --- |
| Original film | `public/gallery/videos/` or `public/commercialGallery/<Client>/` | Project pages, the video player |
| Preview | `public/previews/<same path>.mp4` (generated) | Homepage grid and carousel tiles |
| Poster | `public/posters/<Name>.jpg` | Still shown before the film loads |

## Steps

1. **Add the original** to `public/gallery/videos/` (creative) or
   `public/commercialGallery/<Client>/` (commercial). WebM (VP9) and MP4 (H.264)
   both work. Keep each file under 100 MB, which is GitHub's hard limit per file.
   Never commit HEVC/H.265: Firefox and many Windows browsers can't play it.
   Check with `ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 <file>`.

2. **Make a poster** from a strong frame:

   ```bash
   ffmpeg -ss 2 -i "public/gallery/videos/Name.webm" -frames:v 1 -q:v 3 public/posters/Name.jpg
   ```

3. **Update the manifest** (dimensions and durations):

   ```bash
   npm run media:manifest
   ```

4. **Encode the preview.** Run this after the manifest, because it reads it:

   ```bash
   npm run media:previews
   ```

   This writes `public/previews/...mp4` and updates `src/content/video-previews.json`.
   Films that already have an up-to-date preview are skipped. It needs `ffmpeg`
   on PATH, or `FFMPEG_PATH` pointing to it.

5. **Point the content at it.**
   - Sanity (live content): in the project's row slot, set Kind to Film, set
     Film file to the path (`/gallery/videos/Name.webm`), and fill in Poster,
     Width, Height and Duration. Copy the numbers from
     `src/content/media-manifest.json`. Set the project's Cover film too if the
     homepage tile shouldn't use the first film in the rows.
   - Local fallback content (`src/content/projects.js`): add the path to the
     project's `media` or `rows`, and the poster to `src/content/posters.js`.

6. **Commit the original, the poster, the preview and the JSON files together.**
   If the preview is missing, tiles fall back to the full film. That still works,
   but it brings back the homepage buffering problem.

## The showreel

`public/reel/showreel.mp4` is used by the homepage hero, the menu backdrop and
the player, so it has no separate preview. Replace it with an H.264 file at
about 5 Mbps:

```bash
ffmpeg -i new-reel.mov -c:v libx264 -preset slow -crf 22 -maxrate 5M -bufsize 10M \
  -profile:v high -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/reel/showreel.mp4
```

Then update the showreel's width, height and duration in Sanity's Site settings.

## How playback is kept light

Read this before changing video components.

- `src/components/media/AutoVideo.jsx` loads nothing until the video is on
  screen (`preload="none"`), pauses it when it scrolls away, and drops its
  source once it is more than a screen away.
- `<AutoVideo preview>` is for decorative tiles. It plays the preview encode
  (`src/content/previews.js`) and asks `src/lib/playbackBudget.js` for a slot.
  Only the 2 tiles nearest the middle of the screen play at once (1 on phones);
  the rest show their cover. Don't use `preview` where visitors control
  playback, such as `VideoSlot`.
- The homepage hero (`ReelIntro.jsx`) pauses whenever it is off screen.
- `useCanAutoplay` turns autoplay off for reduced motion and for save-data or
  2G connections.

Original films run at 13–20 Mbps. Never autoplay several of them at once.
