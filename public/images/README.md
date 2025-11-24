# Dogs images

Drop your photos in this folder (e.g. `IMG_1234.JPG`). Then add the filenames to `manifest.json` as a JSON array.

Example `manifest.json`:

```
[
  "DSC_0012.JPG",
  "gemeter1.JPG",
  "my-dog.jpg"
]
```

The dashboard fetches `/images/manifest.json` at runtime and uses those filenames as `/images/<filename>`.
