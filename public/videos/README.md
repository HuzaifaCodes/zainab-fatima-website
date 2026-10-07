## PLACEHOLDER — Replace with real video files

Place your personal videos in this folder.

## Required Files

| File | Used After |
|------|-----------|
| `mission1.mp4` | Mission 1 password correct |
| `mission2.mp4` | Mission 2 password correct |
| `mission3.mp4` | Mission 3 password correct |
| `final.mp4` | (Optional) Final screen video |

## Tips

- **Portrait orientation** (9:16) looks best on mobile
- Keep videos under **50MB** each for fast loading
- **H.264 MP4** has the best mobile browser support
- The video player uses native HTML5 `<video>` with controls
- Users can tap to pause and use fullscreen button

## Compression

To compress videos before adding them:
```
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 28 output.mp4
```
