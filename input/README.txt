Place your Latin patristic PDF here (numbered footnotes at page foot or document end).

From the repository root, run:

  python -m pip install pymupdf deep-translator
  python tools/patristic_latin_pdf.py

The first .pdf in this folder is processed. Output is written to output/translated/<name>.html

Options:
  --dry-run     Merge footnotes into text only; do not call the translation API
  --no-per-page Join pages without stripping per-page footnote blocks first
  -o PATH       Write HTML to a specific file
