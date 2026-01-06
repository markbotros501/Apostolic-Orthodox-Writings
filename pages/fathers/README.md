# Adding New Works

To add new HTML files for Cyril or Severus without editing `data.js`:

## Steps:

1. **Place your HTML file** in the appropriate folder:
   - For Cyril: `pages/fathers/cyril/` (or any subfolder)
   - For Severus: `pages/fathers/severus/` (or any subfolder)

2. **Edit the manifest file** for that author:
   - For Cyril: Edit `pages/fathers/cyril/works-manifest.json`
   - For Severus: Edit `pages/fathers/severus/works-manifest.json`

3. **Add a new entry** to the manifest file in this format:
   ```json
   {
     "id": "unique-work-id",
     "title": "Title of the Work",
     "path": "pages/fathers/author-name/path/to/your-file.html"
   }
   ```

## Example:

If you add a new file `pages/fathers/cyril/new-work.html`, add this to `pages/fathers/cyril/works-manifest.json`:

```json
{
  "id": "new-work",
  "title": "New Work Title",
  "path": "pages/fathers/cyril/new-work.html"
}
```

The works will automatically appear on the author's page!

