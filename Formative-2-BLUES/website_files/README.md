# Software Explorer

A redesigned, more interactive version of the BSE Specialisation Advisor
project, now branded as **Software Explorer**.

## What changed

- Renamed the site from "BSE Explorer" to **Software Explorer**, using the
  logo already found in the project's images folder.
- Smaller, sticky header with the Software Explorer logo mark + wordmark.
- Favicon added (browser tab icon), generated from the same logo mark.
- New purple / orange / white theme throughout (`css/style.css`), with
  Poppins for headings and Inter for body text (Google Fonts).
- Home page:
  - New "Don't get confused, Software Explorer is here to guide you"
    section with the confused-student photo.
  - "How Software Explorer Works" now has a 4th step linking to the
    Contact page, and the step numbers (01-04) are underlined.
- Specialisations page rebuilt as four image cards. Each image has an
  **Explore** button that reveals career paths, core courses and more
  detail for that specialisation (`js/specialisations.js`).
- Assessment page expanded from 4 to **10 questions** (7 multiple choice +
  1 image hotspot + 1 audio scenario + 1 video scenario), with a single
  overall countdown timer, a progress bar, timeout locking/auto-submit,
  and a scoring engine with a speed/streak bonus (`js/assessment.js`).
- Results page adds a congratulations section with the "content software
  engineer" photo, plus an animated score breakdown and a purple/orange
  radar (spider) chart drawn with the raw Canvas 2D API
  (`js/results.js`).
- Fixed a bug in the original files: several pages linked to
  `specialisations.html` / `assessment.html` (lowercase) while the actual
  files were named `Specialisations.html` / `Assessment.html`. On
  GitHub Pages (case-sensitive servers) this breaks navigation, so every
  file is now consistently lowercase.
- Removed stray ```` ```html ```` / ```` ```css ```` markdown fences that
  were left at the top and bottom of every file in the original upload.

## Still to add before you submit

- **Audio file**: `audio/scenario.mp3` (referenced by Question 7). The
  question already shows a text fallback if this file is missing, but
  add a real short scenario recording for full marks on the audio
  requirement.
- **Video file**: `videos/scenario.mp4` (referenced by Question 9),
  ideally a few seconds longer than the `pauseAt` timestamp set in
  `js/assessment.js` (currently 4 seconds) so the auto-pause is visible.
- **GitHub Repository links**: currently `href="#"` in the header/footer
  and Contact page — replace with your real repo URL.
- **Contact page developer name/photo**: name is set to "Angel" — update
  if needed.

## Images used

All specialisation, hero and results images were sourced from the
`images/` folder you already had in the project (the "Software Explorer"
logo, the confused-student graphic, and the content-engineer photo were
already present and used directly).
