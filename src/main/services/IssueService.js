import { EventEmitter } from 'events';
import parseIssues from './parseIssues';


const RELOAD_INTERVAL = 2 * 60 * 1000; // 2 minutes


class IssueService extends EventEmitter {

  constructor(apiService) {
    super();
    this.apiService = apiService;
    this._issues = [];
  }

  get issues() {
    return this._issues;
  }

  initialize() {
    this.startTimer();
  }

  destroy() {
    this.stopTimer();
  }

  async reload() {
    try {
      console.log('Reloading issues...');

      this._issues = parseIssues(
        await this.apiService.getIssues()
      );
      this.emit('changed');

      console.log(`${this._issues.length} issues loaded`);
    } catch(error) {
      console.error('Issues loading error:', error);
    }
  }

  async startTimer() {
    await this.reload();
    
    this.timer = setTimeout(async () => {
      this.timer = null;
      await this.startTimer();
    }, RELOAD_INTERVAL);
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export default IssueService;
