import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import keytar from 'keytar';
import urls from './urls';


// base64(service_id:service_secret)
const SERVICE_AUTHORIZATION = 'NDZiN2Q5OGItODk0Ni00OGI1LWI0NjYtYjdhYjM4ZjRkYWM4OnkxUTR6RGRoY0s=';

// id of YouTrack Service
const YOUTRACK_SCOPE = '03499c9a-a075-4deb-9f01-8cc69fe5c959';

// Secure storage service name
const STORAGE_SERVICE = 'youtracker';


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
    
    const body = `grant_type=password&username=${login}&password=${password}&scope=${YOUTRACK_SCOPE}&access_type=offline`;
    
    const response = await fetch(urls.oauth, {
      headers: {
        'Authorization': `Basic ${SERVICE_AUTHORIZATION}`,
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
    
    const body = `grant_type=refresh_token&refresh_token=${refreshToken}&scope=${YOUTRACK_SCOPE}`;
    
    const response = await fetch(urls.oauth, {
      headers: {
        'Authorization': `Basic ${SERVICE_AUTHORIZATION}`,
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
    await keytar.setPassword(STORAGE_SERVICE, 'accessToken', accessToken);
  }
  
  async setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    await keytar.setPassword(STORAGE_SERVICE, 'refreshToken', refreshToken);
  }
  
  async loadTokens() {
    this.accessToken = await keytar.getPassword(STORAGE_SERVICE, 'accessToken');
    this.refreshToken = await keytar.getPassword(STORAGE_SERVICE, 'refreshToken');
  }
  
  async unauthorize() {
    this.accessToken = null;
    this.refreshToken = null;
    
    await keytar.deletePassword(STORAGE_SERVICE, 'accessToken');
    await keytar.deletePassword(STORAGE_SERVICE, 'refreshToken');
    
    this.emit('unauthorized');
  }
}

export default AuthService;