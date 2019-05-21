const { EventEmitter } = require('events');
const tracking = require('./services/tracking');
const issueLoading = require('./services/issueLoading');
const workItemPosting = require('./services/workItemPosting');

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

module.exports = { events, initialize, startTracking, stopTracking, getState };
