# nr1-browser-agent-version-pinning

[![Tests](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml/badge.svg?branch=initial-setup)](https://github.com/chris-pilcher/nr1-browser-agent-version-pinning/actions/workflows/test.yml)

NR1 Browser Agent Version Pinning makes it easy to lock a specific browser agent version from the UI. Keep things stable and avoid surprises from automatic updates.

## Getting started

Run the following scripts:

```
npm install
npm start
```

Visit https://one.newrelic.com/?nerdpacks=local and :sparkles:

## Creating new artifacts

If you want to create new artifacts run the following command:

```
nr1 create
```

> Example: `nr1 create --type nerdlet --name my-nerdlet`.


## Developer Notes

- This is a good example app: https://github.com/newrelic/nr1-browser-analyzer/blob/f1b6d61dbf77f93e50e445dec01c6e37c6423c09/nerdlets/browser-analyzer-nerdlet/nr1.json
- New Relic UI controls https://docs.newrelic.com/docs/new-relic-solutions/build-nr-ui/sdk-component/controls/AccountPicker/
