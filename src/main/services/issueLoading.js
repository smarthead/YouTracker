import { EventEmitter } from 'events';
import api from './api';

let events = new EventEmitter();

let issues = [];

const reload = () => {
  api.getIssues().then((result) => {
    issues = result;
    events.emit('changed', issues);
  });
};

const getIssues = () => issues;

export default { events, reload, getIssues };
