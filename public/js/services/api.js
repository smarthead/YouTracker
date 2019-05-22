const fetch = require('node-fetch');
const urls = require('../urls');

const headers = {
  'Authorization': `Bearer ${process.env.TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const getIssues = async () => {
  const response = await fetch(urls.getIssues, { headers });
  return response.ok ? response.json() : [];
};

const postWorkItem = async ({ issueId, date, minutes }) => {
  const response = await fetch(urls.postWorkItems(issueId), {
    headers,
    method: 'POST',
    body: JSON.stringify({
      date,
      duration: { minutes },
    })
  });
  if (response.status >= 500 && response.status < 600) {
    throw new Error("Server error");
  }
}

module.exports = { getIssues, postWorkItem };
