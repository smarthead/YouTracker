import { EventEmitter } from 'events';
import TrackingService from './TrackingService';
import IssueService from './IssueService';
import WorkItemService from './WorkItemService';
import ApiService from './ApiService';

class MainService extends EventEmitter {

  constructor() {
    super();
    this.apiService = new ApiService();
    this.session = null;
  }

  // Public

  async initialize() {
    this.apiService.on('unauthorized', () => {
      this.destroySession();
    });

    await this.apiService.initialize();

    if (this.apiService.isAuthorized) {
      this.createSession();
    }
  }

  async logIn(login, password) {
    await this.apiService.logIn(login, password);
    this.createSession();
  }

  async logOut() {
    await this.apiService.logOut();
  }

  startTracking(issueId) {
    if (this.session) {
      this.session.trackingService.start(issueId);
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

  get state() {
    return {
      isAuthorized: this.apiService.isAuthorized,
      state: this.session ? {
        issues: this.session.issueService.issues,
        activeIssueId: this.session.trackingService.activeIssueId
      } : null
    };
  }

  // Private

  createSession() {
    if (this.session) return;

    const issueService = new IssueService(this.apiService);
    const workItemService = new WorkItemService(this.apiService);
    const trackingService = new TrackingService(workItemService);

    trackingService.on('changed', () => {
      this.dispatchChanges();
    });
    
    issueService.on('changed', () => {
      this.dispatchChanges();
    });
    
    workItemService.on('all-sent', () => {
      issueService.reload();
    });

    issueService.reload();

    this.session = { issueService, workItemService, trackingService };
    this.dispatchChanges();
  }

  destroySession() {
    if (!this.session) return;

    this.session = null;
    this.dispatchChanges();
  }

  dispatchChanges() {
    this.emit('changed');
  }
}

export default MainService;
