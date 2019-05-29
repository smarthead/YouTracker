import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import keytar from 'keytar';
import urls from './urls';

class AuthService extends EventEmitter {
  constructor() {
    super();
    this.accessToken = null;
    this.refreshToken = null;
  }
  
  // Public
  
  get isAuthorized() {
    return this.accessToken !== null;
  }
  
  async initialize() {
    await this.loadTokens();
  }
  
  async authorizedFetch(url, options) {
    if (!this.accessToken) {
      throw new Error('Unauthorized');
    }
    
    const makeFetch = async () => {
      return await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    };
    
    const response = await makeFetch();
    
    if (response.status === 401) {
      try {
        await this.refreshAccessToken();
      } catch {
        await this.unauthorize();
        throw new Error('Unauthorized');
      }
      
      const response = await makeFetch();
      
      if (response.status === 401) {
        await this.unauthorize();
        throw new Error('Unauthorized');
      }
      
      return response;
    }
    
    return response;
  }
  
  async logIn(login, password) {
    console.log('Logging in...');
    
    const body = `grant_type=password&username=${login}&password=${password}&scope=${youTrackScope}&access_type=offline`;
    
    const response = await fetch(urls.oauth, {
      headers: {
        'Authorization': `Basic ${serviceAuthorization}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body
    });
    
    if (!response.ok) {
      console.error('Login error');
      throw new Error('Unauthorized');
    }
    
    const { access_token, refresh_token } = await response.json();
    
    await this.setAccessToken(access_token);
    await this.setRefreshToken(refresh_token);
    
    console.log('Login succeeded');
  }

  async logOut() {
    await this.unauthorize();
  }
  
  // Private
  
  async refreshAccessToken() {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      throw new Error('Unauthorized');
    }
    
    console.log('Refreshing token...');
    
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}&scope=${youTrackScope}`;
    
    const response = await fetch(urls.oauth, {
      headers: {
        'Authorization': `Basic ${serviceAuthorization}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body
    });
    
    if (!response.ok) {
      console.error('Refresh token error');
      throw new Error('Unauthorized');
    }
    
    const { access_token, refresh_token } = await response.json();
    
    await this.setAccessToken(access_token);
    
    // Along with new access token, Hub may issue a new refresh token
    if (refresh_token) {
      await this.setRefreshToken(refresh_token);
    }
    
    console.log('Refresh token succeeded');
  }
  
  async setAccessToken(accessToken) {
    this.accessToken = accessToken;
    await keytar.setPassword(keytarService, 'accessToken', accessToken);
  }
  
  async setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    await keytar.setPassword(keytarService, 'refreshToken', refreshToken);
  }
  
  async loadTokens() {
    this.accessToken = await keytar.getPassword(keytarService, 'accessToken');
    this.refreshToken = await keytar.getPassword(keytarService, 'refreshToken');
  }
  
  async unauthorize() {
    this.accessToken = null;
    this.refreshToken = null;
    
    await keytar.deletePassword(keytarService, 'accessToken');
    await keytar.deletePassword(keytarService, 'refreshToken');
    
    this.emit('unauthorized');
  }
}

// base64(service_id:service_secret)
const serviceAuthorization = 'NDZiN2Q5OGItODk0Ni00OGI1LWI0NjYtYjdhYjM4ZjRkYWM4OnkxUTR6RGRoY0s=';

// id of YouTrack Service
const youTrackScope = '03499c9a-a075-4deb-9f01-8cc69fe5c959';

// Secure storage service name
const keytarService = 'youtracker';

export default AuthService;