# Griffles learning packs (H1 Economics)

Student pages, served by GitHub Pages at https://liyun-wang-ri.github.io/field-reports/. They are built by `build.py` in the Griffles project; don't edit these files by hand.

## Naming

File = page ID in lower case + the two place codes (a country code, or a local place such as `ri` Raffles Institution or `ct` Chinatown): `lower(<PREFIX>-<TOPIC>-<NN>-<FORMAT>)-<a>-<b>.html`

| Format | Page ID | File |
|---|---|---|
| Griffles Profile (every Post on one page) | GRIFFLES-PROFILE | [griffles-profile.html](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html) |
| Post (Instagram-style trailer, phones) | PC-CPE-01-POST | [pc-cpe-01-post-ri-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-cpe-01-post-ri-sg.html) |
| Field Report Lite | FR-CPE-01-LITE | [fr-cpe-01-lite-ri-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-cpe-01-lite-ri-sg.html) |
| Post (Instagram-style trailer, phones) | PC-CPE-02-POST | [pc-cpe-02-post-ct-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-cpe-02-post-ct-sg.html) |
| Field Report Lite | FR-CPE-02-LITE | [fr-cpe-02-lite-ct-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-cpe-02-lite-ct-sg.html) |
| Post (Instagram-style trailer, phones) | PC-DDSS-01-POST | [pc-ddss-01-post-za-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-ddss-01-post-za-sg.html) |
| Field Report Lite | FR-DDSS-01-LITE | [fr-ddss-01-lite-za-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-ddss-01-lite-za-sg.html) |
| Post (Instagram-style trailer, phones) | PC-MF-01-POST | [pc-mf-01-post-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-01-post-ke-sg.html) |
| Field Report Lite | FR-MF-01-LITE | [fr-mf-01-lite-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-01-lite-ke-sg.html) |
| Deep Dive | FR-MF-01-DEEPDIVE | [fr-mf-01-deepdive-ke-sg.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-01-deepdive-ke-sg.html) |
| Post (Instagram-style trailer, phones) | PC-MF-02-POST | [pc-mf-02-post-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/pc-mf-02-post-dk-nz.html) |
| Field Report Lite | FR-MF-02-LITE | [fr-mf-02-lite-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-02-lite-dk-nz.html) |
| Deep Dive | FR-MF-02-DEEPDIVE | [fr-mf-02-deepdive-dk-nz.html](https://liyun-wang-ri.github.io/field-reports/fr-mf-02-deepdive-dk-nz.html) |

Share the Profile with students; add a post's code to open it directly, e.g. [griffles-profile.html#mf-02](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html#mf-02) or [#cpe-01](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html#cpe-01). Posts are in syllabus order (Central Problem, then Price Mechanism, then Market Failure), e.g. [#ddss-01](https://liyun-wang-ri.github.io/field-reports/griffles-profile.html#ddss-01). The Profile plays each Post on the page; the standalone Post pages above stay published as each trailer's own record and link. Postcards were retired on 16 Nov 2026 (the Post works on phones and computers). The Deep Dives stay published but are no longer linked from the posts until the exam-style Deep Dive is built.

The other `.html` files are forwarding pages for the old file names (before 30 Oct 2026), so earlier Canvas links keep working.

## Economic Thinking Inventory (`eti/`)

The JC1/JC2 questionnaire is not built by `build.py`; edit the files in `eti/` directly.

| File | What it is |
|---|---|
| [eti/index.html](https://liyun-wang-ri.github.io/field-reports/eti/) | Student page, connected to the Apps Script web app through `API_URL` near the top of its script (a new deployment URL must be pasted there). Add `?demo=1` to the link for a demo that saves nothing. |
| `eti/Code.gs` | Backend to paste into Apps Script in the response Google Sheet. Contains no keys or student data. |
| `eti/SETUP.md` | Setup and teacher guide. |
| `eti/img/` | Griffles and the five Year 5–6 House mascots (school artwork, 360 px tall webp). A chapter's guide is set in `CHAPTERS` / `CAST` near the top of the page script; a missing image falls back to Griffles. |

Sections unlock in order: a student must answer every question in a section before the next opens, and can go back to any finished section to edit before submitting.

Student answers are saved only in the teacher's private Google Sheet, never in this repository.

## Econ Speedrun (`speedrun/`)

A class game for Year 6 H1 macro, hand-written (not built by `build.py`). Open [speedrun/](https://liyun-wang-ri.github.io/field-reports/speedrun/) for the campaign map. The teacher opens an act's Host page on the projector; students join on their phones with the game code and a team nickname (no accounts). Uses the `econ-speedrun` Firebase project; add `#demo` to any page to test in one browser without Firebase. See `speedrun/README.md`.
