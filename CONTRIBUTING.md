# Contributing

Please read the shared [CloudFlare ImgBed contribution guide](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/dev/CONTRIBUTING.md) for repository selection, code style, compatibility and atomic PR requirements.

- Submit documentation PRs to **`main`**. Backend and frontend changes belong in their respective repositories and target `dev`.
- Use Node.js 22 and the existing lockfile: `npm ci`.
- Preview with `npm run docs:dev` and validate with `npm run docs:build`.
- Pages live in `src/`, English pages in `src/en/`, and navigation/sidebar configuration in `src/.vitepress/config.mts`.
- Follow the existing structure, terminology and writing style. Check navigation, links, images, configuration names and example commands.
- Update corresponding Chinese and English pages where practical, and identify any language version still needing an update.
- Keep each PR focused on one topic, link related implementation PRs and describe how the documented behavior was verified.
