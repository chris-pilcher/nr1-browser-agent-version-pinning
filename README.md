# Browser Agent Version Pinning

[![Tests](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml/badge.svg?branch=initial-setup)](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml) 
![GitHub Release](https://img.shields.io/github/v/release/chris-pilcher/nr1-browser-agent-version-pinning)
[![License](https://img.shields.io/github/license/chris-pilcher/nr1-browser-agent-version-pinning.svg)](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/blob/main/LICENSE)

> Pin your browser agent version directly from the New Relic UI.

## Features

- 📌 Pin browser agent versions with a single click
- 🔓 Unpin the browser agent version
- 👀 View current pinning status of your browser application

## Demo

![Browser Agent Version Pinning Demo](.github/images/browser-agent-version-pinning-demo.gif)


## Installation

1. Ensure you have [New Relic One](https://one.newrelic.com) access
2. Install the nerdpack from the New Relic One Catalog
3. Navigate to your browser application to manage version pinning

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [New Relic One CLI](https://developer.newrelic.com/build-tools/new-relic-one-applications/cli)

Run the following scripts:

```shell
cd src
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

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

