const { EventEmitter } = require('events');
const api = require('./api');

let events = new EventEmitter();

let issues = [];

const reload = () => {
  api.getIssues().then((result) => {
    issues = result;
    events.emit('changed', issues);
  });
};

const getIssues = () => issues;

module.exports = { events, reload, getIssues };
