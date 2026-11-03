# Griffles learning packs (H1 Economics)

Student pages, served by GitHub Pages at https://liyun-wang-ri.github.io/field-reports/. They are built by `build.py` in the Griffles project; don't edit these files by hand.

## Naming

File = page ID in lower case + the two place codes: `lower(<PREFIX>-<TOPIC>-<NN>-<FORMAT>)-<a>-<b>.html`

| Format | Page ID | File |
|---|---|---|
| Griffles Profile (every Post on one page) | GRIFFLES-PROFILE | [griffles-profile.html](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html) |
| Post (Instagram-style trailer, phones) | PC-MF-01-POST | [pc-mf-01-post-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-01-post-ke-sg.html) |
| Postcard (airmail trailer, computers) | PC-MF-01-POSTCARD | [pc-mf-01-postcard-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-01-postcard-ke-sg.html) |
| Field Report Lite | FR-MF-01-LITE | [fr-mf-01-lite-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-01-lite-ke-sg.html) |
| Deep Dive | FR-MF-01-DEEPDIVE | [fr-mf-01-deepdive-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-01-deepdive-ke-sg.html) |
| Post (Instagram-style trailer, phones) | PC-MF-02-POST | [pc-mf-02-post-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-02-post-dk-nz.html) |
| Postcard (airmail trailer, computers) | PC-MF-02-POSTCARD | [pc-mf-02-postcard-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-02-postcard-dk-nz.html) |
| Field Report Lite | FR-MF-02-LITE | [fr-mf-02-lite-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-02-lite-dk-nz.html) |
| Deep Dive | FR-MF-02-DEEPDIVE | [fr-mf-02-deepdive-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-02-deepdive-dk-nz.html) |

Share the Profile with students; add a post's code to open it directly, e.g. [griffles-profile.html#mf-02](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html#mf-02). The Profile plays each Post on the page; the standalone Post and Postcard pages above stay published as each trailer's own record and link.

The other `.html` files are forwarding pages for the old file names (before 30 Oct 2026), so earlier Canvas links keep working.

## Economic Thinking Inventory (`eti/`)

The JC1/JC2 questionnaire is not built by `build.py`; edit the files in `eti/` directly.

| File | What it is |
|---|---|
| [eti/index.html](https://liyun-wang-ri.github.io/field-reports/eti/) | Student page, connected to the Apps Script web app through `API_URL` near the top of its script (a new deployment URL must be pasted there). Add `?demo=1` to the link for a demo that saves nothing. |
| `eti/Code.gs` | Backend to paste into Apps Script in the response Google Sheet. Contains no keys or student data. |
| `eti/SETUP.md` | Setup and teacher guide. |

Student answers are saved only in the teacher's private Google Sheet, never in this repository.
