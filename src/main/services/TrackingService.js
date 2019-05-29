import { EventEmitter } from 'events';

class TrackingService extends EventEmitter {

  constructor(workItemService) {
    super();
    this.workItemService = workItemService;
    this.activeTracking = null;
  }

  get activeIssueId() {
    return this.activeTracking ? this.activeTracking.issueId : null;
  }

  start(issueId) {
    if (this.activeTracking) stop();

    this.activeTracking = {
      issueId,
      startTime: new Date()
    };

    this.emit('changed');
  }

  stop() {
    if (this.activeTracking === null) return;

    const { issueId, startTime } = this.activeTracking;
    const endTime = new Date();
    const time = endTime.getTime() - startTime.getTime();
    const minutes = Math.ceil(time / 1000 / 60);

    if (time > 30000) {
      console.log(`Tracked ${time} ms (${minutes} m) in task ${issueId}`);
      this.workItemService.commitWorkItem({
        issueId, date: endTime.getTime(), minutes
      });
    } else {
      console.log(`Work item is too short (${time} ms)`);
    }

    this.activeTracking = null;

    this.emit('changed');
  }

  add({ issueId, minutes }) {
    const today = new Date();
    this.workItemService.commitWorkItem({
      issueId, date: today.getTime(), minutes
    });
  }
}

export default TrackingService;
