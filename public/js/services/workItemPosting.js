const { EventEmitter } = require('events');
const api = require('./api');

// TODO реализовать таймер повторной отправки

let events = new EventEmitter();

let workItems = [];
let isSending = false;

const commitWorkItem = (item) => {
  workItems.push(item);
  send();
};

const send = () => {
  if (isSending || workItems.length === 0) {
    return;
  }
  isSending = true;

  const item = workItems[0];
  
  api.postWorkItem(item)
    .then(() => {
      workItems.shift();
      isSending = false;
      if (workItems.length > 0) {
        send();
      } else {
        events.emit('all-sent');
      }
    })
    .catch((error) =>{
      console.error(`Work item posting error: ${error}`);
      isSending = false;
    });
};

module.exports = { events, commitWorkItem };
