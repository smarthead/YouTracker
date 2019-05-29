import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import urls from './urls';
import AuthService from './AuthService';

class ApiService extends EventEmitter {

  constructor() {
    super();
    this.authService = new AuthService();

    this.authService.on('unauthorized', () => {
      this.emit('unauthorized');
    });
  }

  get isAuthorized() {
    return this.authService.isAuthorized;
  }

  async initialize() {
    await this.authService.initialize();
  }

  async logIn(login, password) {
    await this.authService.logIn(login, password);
  }
  
  async logOut() {
    await this.authService.logOut();
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
