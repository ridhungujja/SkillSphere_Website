# skillsphere-intl.org

Website for SkillSphere Foundation, a student-run 501(c)(3) in Delaware.
Static HTML, CSS, and a small script. No build step. Hosted on Netlify.

## Deploying

- `main` is production. Every push to `main` triggers a Netlify deploy (and uses build credits), so batch changes.
- Any other branch gets a deploy preview at `deploy-preview-<PR number>--silly-babka-ec9722.netlify.app`.
- Netlify Forms handles the contact form. Turn on **Site settings → Forms → Form notifications** so submissions are emailed.
- Turn on **Force HTTPS** under Domain management if it is not already.

## Layout

```
index.html              home
programs/  team/  news/  donate/  contact/  transparency/
404.html                served by Netlify for missing pages
style.css               one stylesheet; design tokens live in :root at the top
script.js               nav, mobile menu, reveals, contact-form prefill, back to top
images/photos/          event photography, WebP, 800 and 1200 widths
images/team/            member portraits, 400 and 800 widths
documents/              public PDFs linked from every footer
netlify.toml            security and cache headers
sitemap.xml robots.txt  keep the sitemap in step with the pages
```

## Editing common things

- **Numbers** ($ raised, students, schools): they appear on the home impact bar, the Dover story, programs fact rows, donate, and transparency. Search the repo for the old figure and replace every hit.
- **Team**: `team/index.html`. Add a portrait to `images/team/` at 400 and 800 px square, WebP. Officer titles should match the bylaws.
- **Partners**: three lists, in `index.html`, `programs/index.html`, and `transparency/index.html`.
- **News**: `news/index.html`, one `<article class="update">` per entry, newest first.
- **Documents**: drop the PDF in `documents/`, then add it to the transparency page and to the Documents column of the footer on every page.
- **Footer**: duplicated on every page. Change it once, then copy to the others.

## Open items

Search for `TODO(ridhun)`:

- Press article URLs (WBOC, WMDT, Dover News Today, Bay to Bay News)
- Analytics snippet in each `<head>`
- BPA module links once hosted
- Amount-card cost mappings on the donate page
- A real chapter-interest form

## Checks used before release

axe-core (accessibility), the Nu HTML checker, and Lighthouse, plus a headless Chromium render of every page at phone, tablet, and desktop widths. Aim to keep: 0 axe violations, 0 validator errors, Lighthouse accessibility and SEO at 100.
