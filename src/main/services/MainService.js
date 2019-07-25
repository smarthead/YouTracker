import { EventEmitter } from 'events';
import TrackingService from './TrackingService';
import IssueService from './IssueService';
import WorkItemService from './WorkItemService';
import ApiService from './ApiService';
import AuthService from './AuthService';

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
    
    reloadIssues() {
        if (this.session) {
            this.session.issueService.reload();
        }
    }
    
    get state() {
        return {
            isAuthorized: this.authService.isAuthorized,
            state: this.session ? {
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
            if (trackingService.current) {
                const issue = issueService.issues.find(
                    issue => issue.id === trackingService.current.issue.id
                );
                if (issue) {
                    trackingService.updateIssue(issue);
                }
            }
            this.dispatchChanges();
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
}

export default MainService;
        