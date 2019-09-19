import { EventEmitter } from 'events';
import TrackingService from './TrackingService';
import IssueService from './IssueService';
import WorkItemService from './WorkItemService';
import ApiService from './ApiService';
import AuthService from './AuthService';
import parseIssue from './parseIssue';

class MainService extends EventEmitter {
    
    constructor() {
        super();
        this.authService = new AuthService();
        this.apiService = new ApiService(this.authService);
        this.session = null;
    }
    
    // Public
    
    async initialize() {
        this.authService.on('unauthorized', () => {
            this.destroySession();
        });
        
        await this.authService.initialize();
        
        if (this.authService.isAuthorized) {
            this.createSession(this.authService.userId);
        }
    }
    
    async logIn(login, password) {
        await this.authService.logIn(login, password);
        this.createSession(this.authService.userId);
    }
    
    async logOut() {
        await this.authService.logOut();
    }
    
    startTracking(issueId) {
        if (this.session) {
            const { issueService, trackingService } = this.session;
            
            const issue = issueService.issues.find(
                issue => issue.id === issueId
            );
            if (issue) {
                trackingService.start(issue);
            }
        }
    }
    
    stopTracking() {
        if (this.session) {
            this.session.trackingService.stop();
        }
    }
    
    addWorkItem(item) {
        if (this.session) {
            this.session.trackingService.add(item);
        }
    }

    acceptIdleTime() {
        if (this.session) {
            this.session.trackingService.acceptIdleTime();
        }
    }

    subtractIdleTime() {
        if (this.session) {
            this.session.trackingService.subtractIdleTime();
        }
    }
    
    reloadIssues() {
        if (this.session) {
            this.session.issueService.reload();
        }
    }

    async setQuery(query) {
        if (this.session) {
            return await this.session.issueService.setQuery(query);
        }
        return false;
    }
    
    get state() {
        return {
            isAuthorized: this.authService.isAuthorized,
            state: this.session ? {
                query: this.session.issueService.query,
                issues: this.session.issueService.issues,
                current: this.session.trackingService.current
            } : null
        };
    }
    
    // Private
    
    createSession(userId) {
        if (this.session) return;
        
        const issueService = new IssueService(this.apiService, userId);
        const workItemService = new WorkItemService(this.apiService, userId);
        const trackingService = new TrackingService(workItemService);
        
        trackingService.on('changed', () => {
            this.dispatchChanges();
        });
        
        issueService.on('changed', () => {
            this.dispatchChanges();
        });

        issueService.on('reloaded', () => {
            this.updateCurrentIssue();
        });
        
        workItemService.on('all-sent', () => {
            issueService.reload();
        });
        
        issueService.initialize();
        workItemService.initialize();
        trackingService.initialize();
        
        this.session = { issueService, workItemService, trackingService };
        this.dispatchChanges();
    }
    
    destroySession() {
        if (!this.session) return;
        
        this.session.issueService.destroy();
        this.session.workItemService.destroy();
        this.session.trackingService.destroy();
        
        this.session = null;
        this.dispatchChanges();
    }
    
    dispatchChanges() {
        this.emit('changed');
    }

    updateCurrentIssue() {
        if (!this.session) return;
        
        const { issueService, trackingService } = this.session;

        if (!trackingService.current) return;

        const id = trackingService.current.issue.id;

        // Если текущая issue уже есть в спике загруженных, берем оттуда
        const issue = issueService.issues.find(
            issue => issue.id === id
        );
        if (issue) {
            console.log('Current issue updated without reloading');
            trackingService.updateIssue(issue);
        } else {
            // Если нет, то загружаем отдельно
            this.apiService.getIssue(id)
                .then(parseIssue)
                .then(issue => {
                    console.log('Current issue reloaded');
                    trackingService.updateIssue(issue);
                })
                .catch(error => {
                    console.log('Current issue reloading error:', error);
                });
        }
    }
}

export default MainService;
        