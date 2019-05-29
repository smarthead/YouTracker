import { EventEmitter } from 'events';
import parseIssues from './parseIssues';

class IssueService extends EventEmitter {

  // TODO реализовать таймер периодической загрузки задач

  constructor(apiService) {
    super();
    this.apiService = apiService;
    this._issues = [];
  }

  get issues() {
    return this._issues;
  }

  reload() {
    this.apiService.getIssues()
      .then(parseIssues)
      .then(issues => {
        this._issues = issues;
        this.emit('changed', issues);
      });
  }
}

export default IssueService;
