import { EventEmitter } from 'events';

class TrackingService extends EventEmitter {

  constructor(workItemService) {
    super();
    this.workItemService = workItemService;
    this._current = null;
  }

  get current() {
    return this._current;
  }

  start(issue) {
    if (this._current) this.stop();

    this._current = {
      issue,
      isActive: true,
      startTime: new Date(),
      endTime: null
    };

    console.log(`Start tracking issue ${issue.idReadable} (${issue.id})`);

    this.emit('changed');
  }

  stop() {
    if (this._current === null || this._current.endTime !== null) {
      return;
    }

    const { issue, startTime } = this._current;
    const endTime = new Date();
    const time = endTime.getTime() - startTime.getTime();
    const minutes = Math.ceil(time / 1000 / 60);

    this._current.endTime = endTime;
    this._current.isActive = false;

    if (time > 30000) {
      console.log(`Tracked ${time} ms (${minutes} m) in issue ${issue.idReadable} (${issue.id})`);
      this.workItemService.commitWorkItem({
        issueId: issue.id, date: endTime.getTime(), minutes
      });
    } else {
      console.log(`Work item is too short (${time} ms) in issue ${issue.idReadable} (${issue.id})`);
    }

    this.emit('changed');
  }

  add({ issueId, minutes }) {
    const today = new Date();
    this.workItemService.commitWorkItem({
      issueId, date: today.getTime(), minutes
    });
  }

  updateIssue(issue) {
    if (!this._current || this._current.issue.id !== issue.id) {
      return;
    }
    this._current.issue = issue;
  }
}

export default TrackingService;
