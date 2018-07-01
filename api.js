const request = require('request');
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

let inventory = {
  version: "2.0.0",
  agency: "CFPB",
  measurementType: {
    method: "projects"
  },
  releases: []
};

codeJson = (params, cb) => {
  let after = '';

  if (params.after) {
    after = ` after:"${params.after}"`
  }

  const query = `query($username:String!) {
    organization(login:$username) {
      name
      repositories(first:100 ${after}) {
        nodes {
          name
          description
          license
          url
          owner {
            login
          }
          repositoryTopics(first:3) {
            edges {
              node {
                topic {
                  name
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`;

  const variables = `{
    "username": "${params.org}"
  }`;

  const options = {
    method: 'POST',
    url: 'https://api.github.com/graphql',
    headers: {
      'User-Agent': 'request',
      'Content-Type': 'application/json',
      'Authorization': `bearer ${process.env.GITHUB_TOKEN}`
    },
    body: {
      query: query,
      variables: variables
    },
    json: true
  };

  request(options, (err, res, body) => {
    console.log('\npageInfo: ', body.data.organization.repositories.pageInfo);
    if (body.data.organization.repositories.pageInfo.hasNextPage) {
      console.log(
`There are more results. Open http://localhost:${PORT}?org=${params.org}\
&after=${body.data.organization.repositories.pageInfo.endCursor} \
to see the next page.`
      );
    }
    if (err) return console.error(error);
    if (!body.data.organization) return cb("Invalid GitHub organization!");
    const inventory = handleResponse(body);
    cb(null, inventory);
  });

};

handleResponse = (body) => {

  let releases = body.data.organization.repositories.nodes;
  inventory.releases = releases.map((release) => {
    let tags = release.repositoryTopics.edges.map((edge) => {
      return edge.node.topic.name;
    });
    tags.push(inventory.agency);
    tags.sort();
    if (!release.description) {
      release.description = ''
    }
    return {
      name: release.name,
      description: release.description,
      repositoryURL: release.url,
      permissions: {
        licenses: [
          {
            name: "Public Domain"
          }
        ],
        usageType: "openSource"
      },
      laborHours: -1,
      tags: tags,
      contact: {
        email: "tech@consumerfinance.gov"
      },
    }
  });

  return inventory;

}

module.exports = codeJson;
