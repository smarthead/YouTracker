import { EventEmitter } from 'events';
import fetch from 'node-fetch';
import keytar from 'keytar';
import urls from './urls';
import { YOUTRACK_SERVICE_ID, APP_SERVICE_AUTHORIZATION } from './config';

// Secure storage service name
const STORAGE_SERVICE = 'youtracker';


class AuthService extends EventEmitter {
    
    constructor() {
        super();
        this.accessToken = null;
        this.refreshToken = null;
        this._userId = null;
    }
    
    // Public
    
    get isAuthorized() {
        return this.accessToken !== null;
    }
    
    get userId() {
        return this._userId;
    }
    
    async initialize() {
        await this.restoreSession();
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
                await this.clearSession();
                throw new Error('Unauthorized');
            }
            
            const response = await makeFetch();
            
            if (response.status === 401) {
                await this.clearSession();
                throw new Error('Unauthorized');
            }
            
            return response;
        }
        
        return response;
    }
    
    async logIn(login, password) {
        console.log('Logging in...');
        
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', login);
        params.append('password', password);
        params.append('scope', YOUTRACK_SERVICE_ID);
        params.append('access_type', 'offline');
        
        const response = await fetch(urls.oauth, {
            headers: {
                'Authorization': `Basic ${APP_SERVICE_AUTHORIZATION}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: params
        });
        
        if (!response.ok) {
            console.error('Login error');
            throw new Error('Unauthorized');
        }
        
        const {
            access_token: accessToken,
            refresh_token: refreshToken
        } = await response.json();
        
        const userId = await this.getUserId(accessToken);
        
        await this.storeAccessToken(accessToken);
        await this.storeRefreshToken(refreshToken);
        await this.storeUserId(userId);
        
        console.log('Login succeeded');
    }
    
    async logOut() {
        await this.clearSession();
    }
    
    // Private
    
    async refreshAccessToken() {
        const refreshToken = this.refreshToken;
        if (!refreshToken) {
            throw new Error('Unauthorized');
        }
        
        console.log('Refreshing token...');
        
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);
        params.append('scope', YOUTRACK_SERVICE_ID);
        
        const response = await fetch(urls.oauth, {
            headers: {
                'Authorization': `Basic ${APP_SERVICE_AUTHORIZATION}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: params
        });
        
        if (!response.ok) {
            console.error('Refresh token error');
            throw new Error('Unauthorized');
        }
        
        const { access_token, refresh_token } = await response.json();
        
        await this.storeAccessToken(access_token);
        
        // Along with new access token, Hub may issue a new refresh token
        if (refresh_token) {
            await this.storeRefreshToken(refresh_token);
        }
        
        console.log('Refresh token succeeded');
    }
    
    async getUserId(accessToken) {
        console.log('Loading user info...');
        
        const response = await fetch(urls.getMe, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log('Error while loading user info');
            throw new Error('Error while loading user info');
        }
        
        const { id, login } = await response.json();
        
        console.log(`User ${login} with id ${id} loaded`);
        
        return id;
    }
    
    async storeAccessToken(accessToken) {
        this.accessToken = accessToken;
        await keytar.setPassword(STORAGE_SERVICE, 'accessToken', accessToken);
    }
    
    async storeRefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
        await keytar.setPassword(STORAGE_SERVICE, 'refreshToken', refreshToken);
    }
    
    async storeUserId(userId) {
        this._userId = userId;
        await keytar.setPassword(STORAGE_SERVICE, 'userId', userId);
    }
    
    async restoreSession() {
        this.accessToken = await keytar.getPassword(STORAGE_SERVICE, 'accessToken');
        this.refreshToken = await keytar.getPassword(STORAGE_SERVICE, 'refreshToken');
        this._userId = await keytar.getPassword(STORAGE_SERVICE, 'userId');
    }
    
    async clearSession() {
        this.accessToken = null;
        this.refreshToken = null;
        this._userId = null;
        
        await keytar.deletePassword(STORAGE_SERVICE, 'accessToken');
        await keytar.deletePassword(STORAGE_SERVICE, 'refreshToken');
        await keytar.deletePassword(STORAGE_SERVICE, 'userId');
        
        this.emit('unauthorized');
    }
}

export default AuthService;
