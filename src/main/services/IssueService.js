import { EventEmitter } from 'events';
import parseIssues from './parseIssues';
import store from './store';


const AUTORELOAD_INTERVAL = 2 * 60 * 1000; // 2 minutes


class IssueService extends EventEmitter {

  constructor(apiService, userId) {
    super();
    
    this.apiService = apiService;
    this.userId = userId;

    this._issues = [];
    this.destroyed = false;
  }

  // Public

  get issues() {
    return this._issues;
  }

  initialize() {
    this.restoreIssues();
    this.startTimer();
  }

  destroy() {
    this.stopTimer();
    this.destroyed = true;
  }

  async reload() {
    try {
      console.log('Loading issues...');

      this._issues = parseIssues(
        await this.apiService.getIssues()
      );
      this.storeIssues();
      
      this.emit('changed');

      console.log(`${this._issues.length} issues loaded`);

    } catch(error) {
      console.error('Issues loading error:', error);
    }
  }

  // Private

  async startTimer() {
    await this.reload();
    
    if (this.destroyed) return;

    this.timer = setTimeout(async () => {
      this.timer = null;
      await this.startTimer();
    }, AUTORELOAD_INTERVAL);
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  storeIssues() {
    store.set(`issues-${this.userId}`, this._issues);
  }

  restoreIssues() {
    const issues = store.get(`issues-${this.userId}`);
    if (issues) {
      this._issues = issues;
      console.log(`${issues.length} issues restored`);
    }
  }
}

export default IssueService;
