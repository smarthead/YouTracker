import urls from './urls';

class ApiService {

  constructor(authService) {
    this.authService = authService;
  }

  async getIssues() {
    const response = await this.authService.authorizedFetch(urls.getIssues, {
      headers
    });

    return response.ok ? await response.json() : [];
  }

  async postWorkItem({ issueId, date, minutes }) {
    const response = await this.authService.authorizedFetch(urls.postWorkItems(issueId), {
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
}

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

export default ApiService;
