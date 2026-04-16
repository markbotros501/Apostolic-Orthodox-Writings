#!/usr/bin/env python3
"""
Extract text from a patristic PDF (Latin + numbered notes at page foot or document end),
merge footnote references into the body as parentheses, translate Latin to English,
and emit HTML with sections led by Roman numerals where present.

Usage (from repo root):
  python tools/patristic_latin_pdf.py
  python tools/patristic_latin_pdf.py input/MySource.pdf -o output/translated/MySource.html
  python tools/patristic_latin_pdf.py input/x.pdf --dry-run

Requires: pymupdf; optional: deep-translator (pip install pymupdf deep-translator)
"""

from __future__ import annotations

import argparse
import html
import re
import sys
from pathlib import Path

SUP_MAP = {f"⁰¹²³⁴⁵⁶⁷⁸⁹"[i]: str(i) for i in range(10)}


def normalize_superscripts(text: str) -> str:
    for u, d in SUP_MAP.items():
        text = text.replace(u, d)
    return text


def extract_pdf_pages(path: Path) -> list[str]:
    import fitz  # pymupdf

    doc = fitz.open(path)
    return [doc[i].get_text() for i in range(len(doc))]


def extract_pdf_text(path: Path) -> str:
    return "\n".join(extract_pdf_pages(path))


FN_LINE = re.compile(r"^\s*(\d{1,3})[\.\)]\s+(.*)$")


def parse_footnote_lines(block_lines: list[str]) -> dict[str, str]:
    """Merge consecutive lines: numbered line starts entry; following lines continue until next number."""
    footnotes: dict[str, str] = {}
    cur_key: str | None = None
    buf: list[str] = []
    for ln in block_lines:
        m = FN_LINE.match(ln)
        if m:
            if cur_key is not None:
                footnotes[cur_key] = " ".join(buf).strip()
            cur_key = str(int(m.group(1)))  # normalize "01" -> "1"
            buf = [m.group(2).strip()]
        elif cur_key is not None and ln.strip():
            buf.append(ln.strip())
    if cur_key is not None:
        footnotes[cur_key] = " ".join(buf).strip()
    return footnotes


def find_footnote_block_in_page(page_text: str) -> tuple[str, dict[str, str]]:
    """
    Find a contiguous run of footnote lines at the bottom of one page's text.
    Returns (body_without_footnotes, footnotes).
    """
    lines = page_text.splitlines()
    if len(lines) < 2:
        return page_text, {}

    end = len(lines) - 1
    while end >= 0 and not lines[end].strip():
        end -= 1
    if end < 0:
        return page_text, {}

    if not FN_LINE.match(lines[end]):
        return page_text, {}

    start = end
    while start > 0 and FN_LINE.match(lines[start - 1]):
        start -= 1

    block = lines[start : end + 1]
    foots = parse_footnote_lines(block)
    if len(foots) < 1:
        return page_text, {}

    body_lines = lines[:start]
    return "\n".join(body_lines).rstrip() + "\n", foots


def find_footnote_block_at_document_end(full_text: str) -> tuple[str, dict[str, str]]:
    """Last contiguous numbered block in entire document (endnotes)."""
    lines = full_text.splitlines()
    if len(lines) < 1:
        return full_text, {}

    end = len(lines) - 1
    while end >= 0 and not lines[end].strip():
        end -= 1
    if end < 0:
        return full_text, {}

    if not FN_LINE.match(lines[end]):
        return full_text, {}

    start = end
    while start > 0 and FN_LINE.match(lines[start - 1]):
        start -= 1

    block = lines[start : end + 1]
    foots = parse_footnote_lines(block)
    if len(foots) < 1:
        return full_text, {}

    body_lines = lines[:start]
    return "\n".join(body_lines).rstrip() + "\n", foots


def merge_page_footnotes(pages: list[str]) -> str:
    """Apply per-page footnotes; page-local numbering assumed."""
    out: list[str] = []
    for pg in pages:
        body, foots = find_footnote_block_in_page(pg)
        out.append(inline_footnotes(body, foots))
    return "\n\n".join(out)


def inline_footnotes(body: str, footnotes: dict[str, str]) -> str:
    if not footnotes:
        return body

    body = normalize_superscripts(body)
    keys = sorted(footnotes.keys(), key=lambda k: (-len(k), int(k)))

    for k in keys:
        note = footnotes[k]
        body = re.sub(
            rf'(?<=[\w"\'»])\s*{re.escape(k)}(?=[\s.,;:!?\)\]\}}]|$)',
            f" ({note})",
            body,
        )
        body = re.sub(
            rf'(?<=["\'»])\s*{re.escape(k)}(?=[\s.,;:!?\)\]\}}]|$)',
            f" ({note})",
            body,
        )
    return body


_ROMAN_HEAD = re.compile(
    r"^(?P<rom>[IVXLCDM]{1,12})\.\s*(?P<rest>.*)$",
    re.IGNORECASE,
)


def paragraphs_with_roman_heads(text: str) -> list[tuple[str | None, str]]:
    """Split into sections where a line begins with a Roman numeral and a period."""
    chunks: list[tuple[str | None, str]] = []
    current_roman: str | None = None
    buf: list[str] = []

    def flush():
        nonlocal buf, current_roman
        if not buf:
            return
        raw = "\n".join(buf).strip()
        if raw:
            chunks.append((current_roman, raw))
        buf = []

    for line in text.splitlines():
        ls = line.strip()
        if not ls:
            flush()
            current_roman = None
            continue
        m = _ROMAN_HEAD.match(ls)
        if m:
            flush()
            current_roman = m.group("rom").upper()
            buf = [m.group("rest").strip()]
        else:
            buf.append(ls)

    flush()
    return chunks


def is_probably_latin(text: str) -> bool:
    t = f" {text.lower()} "
    hits = sum(
        1
        for w in (
            " et ",
            " est ",
            " non ",
            " sed ",
            " quod ",
            " autem ",
            " cum ",
            " sunt ",
            " enim ",
            " ergo ",
            " qui ",
            " hoc ",
            " ipsum ",
        )
        if w in t
    )
    return hits >= 2


def translate_latin_chunks(text: str, dry_run: bool) -> str:
    if dry_run or not text.strip():
        return text
    try:
        from deep_translator import GoogleTranslator  # type: ignore
    except ImportError:
        print("deep-translator not installed; install with: python -m pip install deep-translator", file=sys.stderr)
        return text

    tr = GoogleTranslator(source="la", target="en")
    out: list[str] = []
    for block in re.split(r"\n\s*\n", text):
        block = block.strip()
        if not block:
            continue
        if is_probably_latin(block):
            try:
                translated: list[str] = []
                step = 4500
                for i in range(0, len(block), step):
                    translated.append(tr.translate(block[i : i + step]))
                out.append("\n".join(translated))
            except Exception as e:
                print(f"Translate error: {e}", file=sys.stderr)
                out.append(block)
        else:
            out.append(block)
    return "\n\n".join(out)


def strip_duplicate_title_line(text: str, title: str) -> str:
    """Remove a lone first line matching the document title (common in PDFs)."""
    lines = text.splitlines()
    if not lines:
        return text
    first = lines[0].strip()
    if first.lower() == title.lower() or first.lower() == title.replace("_", " ").lower():
        return "\n".join(lines[1:]).lstrip()
    return text


def build_html(raw_pages_merged: str, title: str, dry_run: bool) -> str:
    raw_pages_merged = strip_duplicate_title_line(raw_pages_merged, title)
    chunks = paragraphs_with_roman_heads(raw_pages_merged)
    if not chunks:
        chunks = [(None, raw_pages_merged)]

    parts = [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '<meta charset="utf-8">',
        f"<title>{html.escape(title)}</title>",
        "<style>",
        "body{font-family:Georgia,serif;max-width:42rem;margin:2rem auto;line-height:1.55;}",
        "p.sec{margin:1em 0;}",
        "span.roman{font-weight:600;margin-right:0.35em;}",
        "</style>",
        "</head><body>",
        f"<h1>{html.escape(title)}</h1>",
    ]
    for roman, para in chunks:
        translated = translate_latin_chunks(para, dry_run=dry_run)
        esc = html.escape(translated)
        esc = esc.replace("\n\n", "</p><p>").replace("\n", "<br>\n")
        if roman:
            parts.append(f'<p class="sec"><span class="roman">{html.escape(roman)}.</span> {esc}</p>')
        else:
            parts.append(f"<p>{esc}</p>")
    parts.append("</body></html>")
    return "\n".join(parts)


def pipeline(path: Path, per_page: bool, dry_run: bool) -> str:
    pages = extract_pdf_pages(path)
    if per_page:
        merged = merge_page_footnotes(pages)
    else:
        merged = "\n\n".join(pages)

    body, end_foots = find_footnote_block_at_document_end(merged)
    doc_body = inline_footnotes(body, end_foots)

    title = path.stem.replace("_", " ")
    return build_html(doc_body, title, dry_run)


def main() -> int:
    ap = argparse.ArgumentParser(description="Latin patristic PDF → English HTML with inline notes")
    ap.add_argument("pdf", nargs="?", type=Path, help="PDF path (default: first .pdf in ./input)")
    ap.add_argument("-o", "--output", type=Path, help="Output .html")
    ap.add_argument("--dry-run", action="store_true", help="Extract and merge notes only; skip translation")
    ap.add_argument("--no-per-page", action="store_true", help="Only use document-level footnote block")
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    input_dir = root / "input"

    pdf = args.pdf
    if pdf is None:
        pdfs = sorted(input_dir.glob("*.pdf"))
        if not pdfs:
            print(
                f"No PDF in {input_dir}. Add your Latin PDF there or pass a path.\n"
                f"Example: {input_dir / 'source.pdf'}",
                file=sys.stderr,
            )
            return 1
        pdf = pdfs[0]

    if not pdf.is_file():
        print(f"Not found: {pdf}", file=sys.stderr)
        return 1

    print(f"Reading: {pdf}")
    per_page = not args.no_per_page
    html_out = pipeline(pdf, per_page=per_page, dry_run=args.dry_run)

    out = args.output
    if out is None:
        out_dir = root / "output" / "translated"
        out_dir.mkdir(parents=True, exist_ok=True)
        out = out_dir / f"{pdf.stem}.html"

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html_out, encoding="utf-8")
    print(f"Wrote: {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
