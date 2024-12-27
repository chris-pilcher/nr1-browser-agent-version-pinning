# Browser Agent Version Pinning (nr1-browser-agent-version-pinning)

[![Tests](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml/badge.svg?branch=initial-setup)](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml) ![GitHub Release](https://img.shields.io/github/v/release/chris-pilcher/nr1-browser-agent-version-pinning)


NR1 Browser Agent Version Pinning makes it easy to lock a specific browser agent version from the UI. Keep things stable and avoid surprises from automatic updates.

## Getting started

Run the following scripts:

```
cd src
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Developer Notes

- This is a good example app: https://github.com/newrelic/nr1-browser-analyzer/blob/f1b6d61dbf77f93e50e445dec01c6e37c6423c09/nerdlets/browser-analyzer-nerdlet/nr1.json
- New Relic UI controls https://docs.newrelic.com/docs/new-relic-solutions/build-nr-ui/sdk-component/controls/AccountPicker/

## Publishing

Publishing is done via GitHub Actions. The following steps are required:

- Create a new release in [GitHub](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/releases)
  - **Tag**: Tag version should be in the format `v1.2.3`
  - **Title**: Release title should be `X.Y.Z (Month Day, Year)`. E.g. `1.2.3 (June 1, 2021)`
  - **Description**: Release description should be a summary of changes.
- Publish the release will trigger the [publish workflow](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/publish.yml) in GitHub Actions
  - Publish will set the NPM version based on the GitHub release tag from the previous step
  - Publish the Nerdpack to New Relic One
- *Note: You must be a collaborator on the repository to publish*

