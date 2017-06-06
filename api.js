const request = require('request');
const http = require('http');
const url = require('url');

let inventory = {
  name: "",
  version: "1.0.1",
  projects: []
};

codeJson = (org, cb) => {
  
  inventory.name = org.toLowerCase();
  
  const query = `query($username:String!) {
    organization(login: $username) {
      name
      repositories(first: 100) {
        nodes {
          name
          description
          license
          url
          owner {
            login
          }
          repositoryTopics(first: 100) {
            edges {
              node {
                topic {
                  name
                }
              }
            }
          }
        }
      }
    }
  }`;
  
  const variables = `{
    "username": "${inventory.name}"
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
    if (err) return console.error(error);
    if (!body.data.organization) return cb("Invalid GitHub organization!");
    const inventory = handleResponse(body);
    cb(null, inventory);
  });
  
};

handleResponse = (body) => {
  
  let projects = body.data.organization.repositories.nodes;
  inventory.projects = projects.map((project) => {
    let tags = project.repositoryTopics.edges.map((edge) => {
      return edge.node.topic.name;
    });
    tags.push(inventory.name);
    tags.sort();
    return {
      name: project.name,
      description: project.description,
      license: project.license,
      openSourceProject: 1,
      governmentWideReuseProject: 1,
      tags: tags,
      contact: {
        email: `contact@${inventory.name}.gov`
      },
      repository: project.url
    }
  });
  
  return inventory;
  
}

module.exports = codeJson;
