# code.gov inventory generator

A web app for generating an [inventory](https://code.gov/#/policy-guide/docs/compliance/inventory-code) of an organization's software projects.

Demo: https://code-json.now.sh/?org=cfpb

## Usage

1. Sign up for GitHub's [Early Access Program](https://developer.github.com/early-access/graphql/guides/accessing-graphql/) and generate an OAuth token.
1. `cp .env.sample .env` and add your token.
1. `npm install`
2. `npm start`
3. Visit http://localhost:3000?org=cfpb.

## Deployment

1. `npm run deploy`

[now](https://zeit.co/now) will serve the app at a public URL.

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)
