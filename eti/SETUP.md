# Economic Thinking Inventory v3.0 — setup guide

**What's new in v3:** every student gets instant feedback when they submit, built from fixed rules and ready-written text. **No AI and no API key needed.** All the wording sits in a Sheet tab that teachers can edit. The AI analysis from v2 is still there as an optional extra for later.

**Files**
- `index.html`: the student questionnaire (all questions, about 30–40 minutes). Host it on GitHub Pages. Double-click it to try demo mode and see the feedback screen.
- `Code.gs`: the backend in your Google Sheet.
- `schema.json`: the question text, for reference.

---

## How the feedback works

**Two scores** are worked out from the closed questions (0–100, the same formula for every student):

| Score | Built from |
|---|---|
| **Interest in the subject** | G1 reasons (understand the world, current affairs, informed citizen, analysing issues) · G2 importance of understanding the economy, current affairs, critical thinking · F curiosity frequency · G3 effort if there were no exam |
| **Exam focus** | G1 reasons (do well in the A-Level, mainly pass) · G2 importance of exams · G3 reversed (effort would drop without the exam) |

**Four personas** come from those two scores. The cut-offs start at 55 and can be changed (see "Tuning the cut-offs").

|  | Exam focus low | Exam focus high |
|---|---|---|
| **Interest high** | 🧭 The Explorer (suggested track: interest) | ♟️ The Strategist (balanced) |
| **Interest low** | 🌱 The Wanderer (balanced) | 🎯 The Navigator (exam) |

**What students see after submitting:**
- **Persona card:** name, tagline, description, "What you bring" and "Something to try".
- **Three bars:** interest, exam focus and curiosity. Once 20 or more students have submitted, a marker shows the cohort average.
- **Thinking habits:**
  - up to 3 questions they already ask often (D1 rated 5–7);
  - up to 2 they rarely ask, each with a tip.
- **Ideas worth exploring:** up to 3 belief statements they agreed with (E1 rated 5–7). Each comes with a neutral "another angle" prompt, not a correction.
- **JC2 only:**
  - persona then and now;
  - interest or exam changes of 10+ points;
  - beliefs that moved 2+ points;
  - questions they now ask more;
  - their "Economics is the study of…" answer from JC1 next to JC2.
- A **download** of their answers plus all this feedback.

Students **don't** see the suggested track. That's for teachers only.

## Editing the wording (no code)
1. Open the **Feedback_Text** tab. It has one row per piece of text: `key`, `text`, and `used_for`, which explains where each row appears.
2. Edit the `text` column, e.g. rename "The Explorer", rewrite a belief prompt, or change a persona's suggested track (interest / balanced / exam).
   - Keep `{placeholders}` such as `{from}` and `{a}` in the JC2 change lines.
3. Run **ETI Admin → Apply Feedback_Text edits now**. New submissions use the new wording straight away, and the Profiles tab is rebuilt.
   - Without this step, edits still take effect within about 2 minutes.

Demo mode (double-clicking `index.html`) always shows the built-in default wording, not your edits.

## Tuning the cut-offs
- **Fixed cut-offs:** edit `threshold.interest` and `threshold.exam` in Feedback_Text.
- **Cohort medians:** after a pilot (10+ responses), run **ETI Admin → Set persona cut-offs from cohort medians…**. Roughly half the students then count as "high" on each score.
- Do this before the main cohort submits. Students who already submitted saw the old cut-offs; the Profiles tab updates to the new ones.

---

## 0. Before you start
1. Check that **Anyone** appears under **Deploy → New deployment → Web app → Who has access**. Students are on `student.ri.edu.sg`, a different domain from your account.
2. Use the school-issued student ID, **never the NRIC/FIN**.
3. Let your data-protection contact know that responses are stored with student IDs in your school Drive. Students are told on the first screen how their answers are used.

## 1. Sheet and script
1. Create a new Google Sheet → **Extensions → Apps Script** → paste `Code.gs` → Save → reload the Sheet. An **ETI Admin** menu appears.
2. **ETI Admin → 1. Set up sheets.** This creates Student_List, Roster, Responses, Profiles, Feedback_Text, Class_Summary and the optional AI tabs. The inventory starts CLOSED.
3. Paste `student_id` and `class` into **Student_List**.
4. **2. Generate access codes:** enter a cohort label. Distribute the codes privately, then delete the codes tab.
   - Lost code: **Reset one student's access code…**

## 2. Deploy and publish
1. **Deploy → New deployment → Web app.** Execute as **Me**; access: **Anyone**. Copy the `/exec` URL.
2. Paste the URL into `const API_URL='';` in `index.html` and commit it to GitHub Pages.
3. After code changes: **Manage deployments → ✏️ → New version → Deploy**. Wording edits in Feedback_Text don't need a redeploy.

## 3. Running the session
- **Open JC1 inventory**, then **Close inventory** afterwards. In two years, **Open JC2 inventory**.
- Answers autosave on each device, and busy-server retries happen automatically.

## 4. Teacher views
| Tab | What it shows |
|---|---|
| **Profiles** | One row per student per stage, filled in automatically at submission: persona, scores, habits, beliefs to explore, JC2 change lines, suggested track. Fill in **teacher_track_decision** and **teacher_notes**; they're kept when profiles are rebuilt. |
| **Class_Summary** | Run **3. Build class & cohort summaries…** for one row per class plus COHORT: average scores, persona counts, track counts (your decisions override the suggestions), most-agreed beliefs, least-asked questions. |
| **Student_View** | Run **4. Build / refresh Student_View**, then pick a student ID in B1 to see persona, feedback and every answer, JC1 next to JC2. |
| Responses | The raw answers. |

## 5. Optional later: AI analysis
**ETI Admin → Optional: AI analysis.** This adds AI-drafted profiles of the written answers, class overviews and JC2 change reports, once you have a Claude API key and school approval. The AI receives answers only, never IDs or classes. Nothing above depends on it.

## 6. Test before the real lesson
Add 3–4 test IDs. For each persona, submit answers that match it and check the feedback screen reads well on a phone. Then:
1. Edit one Feedback_Text row and apply it.
2. Open JC2 and submit once more to see the change section.
3. Delete the test rows from Responses and Profiles.
