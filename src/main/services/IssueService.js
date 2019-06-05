import { EventEmitter } from 'events';
import parseIssues from './parseIssues';
import store from './store';


const AUTORELOAD_INTERVAL = 2 * 60 * 1000; // 2 minutes


class IssueService extends EventEmitter {

  constructor(apiService) {
    super();
    this.apiService = apiService;
    this._issues = [];
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
  }

  async reload() {
    try {
      await this.loadIssues();
    } catch {
      console.log('Issues reloading failed');
    }
  }

  // Private

  async loadIssues() {
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
      throw error;
    }
  }

  async startTimer() {
    try {
      await this.loadIssues();
      
      this.timer = setTimeout(async () => {
        this.timer = null;
        await this.startTimer();
      }, AUTORELOAD_INTERVAL);

    } catch {
      console.log('Issues autoreloading failed');
    }
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  storeIssues() {
    store.set('issues', this._issues);
  }

  restoreIssues() {
    const issues = store.get('issues');
    if (issues) {
      this._issues = issues;
      console.log(`${issues.length} issues restored`);
    }
  }
}

export default IssueService;
