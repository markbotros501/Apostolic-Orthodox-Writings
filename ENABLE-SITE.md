# Re-enable Apostolic Orthodox Writings

1. Set `"enabled": true` in `site-config.json`.
2. Replace `vercel.json` with the enabled version (remove the `rewrites` block):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**",
      "use": "@vercel/static"
    }
  ]
}
```

3. Push to GitHub so Vercel redeploys the live site.
