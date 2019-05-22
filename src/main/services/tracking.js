import { EventEmitter } from 'events';
import workItemPosting from './workItemPosting';

let events = new EventEmitter();

let activeTracking = null;

const start = (issueId) => {
  if (activeTracking) stop();

  activeTracking = {
    issueId,
    startTime: new Date()
  };

  events.emit('changed');
}

const stop = () => {
  if (activeTracking === null) return;

  const { issueId, startTime } = activeTracking;
  const endTime = new Date();
  const time = endTime.getTime() - startTime.getTime();
  const minutes = Math.ceil(time / 1000 / 60);

  // Send the work item if it's duration more than 30 seconds
  if (time > 30000) {
    console.log(`Tracked ${time} ms (${minutes} m) in task ${issueId}`);
    workItemPosting.commitWorkItem({ issueId, date: endTime.getTime(), minutes });
  } else {
    console.log(`Work item is too short (${time} ms)`);
  }

  activeTracking = null;

  events.emit('changed');
}

const add = ({ issueId, minutes }) => {
  const today = new Date();
  workItemPosting.commitWorkItem({ issueId, date: today.getTime(), minutes });
};

const getActiveIssueId = () => {
  return activeTracking ? activeTracking.issueId : null;
};

export default { events, start, stop, add, getActiveIssueId };
