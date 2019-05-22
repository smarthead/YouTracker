import { EventEmitter } from 'events';
import tracking from './services/tracking';
import issueLoading from './services/issueLoading';
import workItemPosting from './services/workItemPosting';

let events = new EventEmitter();

const initialize = () => {
  issueLoading.reload();
};

const startTracking = (issueId) => {
  tracking.start(issueId);
}

const stopTracking = () => {
  tracking.stop();
}

const getState = () => {
  return {
    issues: issueLoading.getIssues(),
    activeIssueId: tracking.getActiveIssueId()
  };
};

tracking.events.on('changed', () => { events.emit('changed'); });
issueLoading.events.on('changed', () => { events.emit('changed'); });
workItemPosting.events.on('all-sent', () => { issueLoading.reload(); });

export default { events, initialize, startTracking, stopTracking, getState };
