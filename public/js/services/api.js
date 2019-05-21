const fetch = require('node-fetch');
const urls = require('../urls');

const headers = {
  'Authorization': `Bearer ${process.env.TOKEN}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const getIssues = async () => {
  try {
    const response = await fetch(urls.getIssues, { headers });
    return response.json();
  }
  catch (error) {
    throw error;
  }
};

const postWorkItem = async ({ issueId, date, minutes }) => {
  try {
    await fetch(urls.postWorkItems(issueId), {
      headers,
      method: 'POST',
      body: JSON.stringify({
        date,
        duration: { minutes },
      })
    });
  }
  catch (error) {
    throw error;
  }
}

module.exports = { getIssues, postWorkItem };
