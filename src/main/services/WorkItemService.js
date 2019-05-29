import { EventEmitter } from 'events';


const RETRY_INTERVAL = 2 * 60 * 1000; // 2 minutes


class WorkItemService extends EventEmitter {
  
  constructor(apiService) {
    super();
    this.apiService = apiService;
    this.workItems = [];
    this.isSending = false;
  }

  initialize() {
    // TODO Загрузить отметки из хранилища, когда оно будет реализовано
    // TODO Отправить неотправленные отметки: this.sendNext();
  }

  destroy() {
    this.stopTimer();
  }

  commitWorkItem(item) {
    this.workItems.push(item);
    this.sendNext();
  }

  sendNext() {
    if (this.isSending || this.workItems.length === 0) {
      return;
    }
    this.stopTimer();
    this.isSending = true;

    const item = this.workItems[0];

    console.log(`Posting work item ${item}...`);
    
    this.apiService.postWorkItem(item)
      .then(() => {
        console.log('Work item posted');
        this.isSending = false;

        this.workItems.shift();
        
        if (this.workItems.length > 0) {
          this.sendNext();
        } else {
          this.emit('all-sent');
        }
      })
      .catch((error) =>{
        console.error('Work item posting error:', error);
        this.isSending = false;
        this.startTimer();
      });
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.timer = null;
      this.sendNext();
    }, RETRY_INTERVAL);
  }

  stopTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export default WorkItemService;
