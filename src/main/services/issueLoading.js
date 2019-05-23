import { EventEmitter } from 'events';
import api from './api';
import parseIssues from './parseIssues';

let events = new EventEmitter();

let issues = [];

const reload = () => {
  api.getIssues()
    .then(parseIssues)
    .then((result) => {
      console.log(result);
      issues = result;
      events.emit('changed', issues);
    });
};

const getIssues = () => issues;

export default { events, reload, getIssues };
