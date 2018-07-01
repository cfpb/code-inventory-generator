# code.gov inventory generator

A web app for generating an [inventory](https://code.gov/#/policy-guide/docs/compliance/inventory-code) of an organization's software projects.

Demo: https://code-json.now.sh/?org=cfpb

## Installation

1. Generate a [GitHub personal access token](https://github.com/settings/tokens) with `public_repo` and `read:org` permissions.
1. `cp .env.sample .env` and add your token. `source .env`
1. `npm install`
1. `npm start`
1. Visit http://localhost:3000?org=cfpb.
1. If there are greater than 100 results, pass the query's `endCursor` as an `after` parameter in the url to get the next page of results, e.g. http://localhost:3000?org=cfpb&after=Y3Vyc29yOnYyOpHOA/2KeA==

## Deployment

1. `npm run deploy`

[now](https://zeit.co/now) will serve the app at a public URL.

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)
