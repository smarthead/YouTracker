import { EventEmitter } from 'events';

class WorkItemService extends EventEmitter {

  // TODO реализовать таймер повторной отправки
  
  constructor(apiService) {
    super();
    this.apiService = apiService;
    this.workItems = [];
    this.isSending = false;
  }

  commitWorkItem(item) {
    this.workItems.push(item);
    this.send();
  }

  send() {
    if (this.isSending || this.workItems.length === 0) {
      return;
    }
    this.isSending = true;
  
    const item = this.workItems[0];
    
    this.apiService.postWorkItem(item)
      .then(() => {
        this.workItems.shift();
        this.isSending = false;
        if (this.workItems.length > 0) {
          this.send();
        } else {
          this.emit('all-sent');
        }
      })
      .catch((error) =>{
        console.error(`Work item posting error: ${error}`);
        this.isSending = false;
      });
  };
}

export default WorkItemService;
