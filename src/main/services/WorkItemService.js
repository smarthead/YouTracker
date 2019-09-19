import { EventEmitter } from 'events';
import log from 'electron-log';
import store from './store';


const RETRY_INTERVAL = 2 * 60 * 1000; // 2 minutes


class WorkItemService extends EventEmitter {
    
    constructor(apiService, userId) {
        super();
        
        this.apiService = apiService;
        this.userId = userId;
        
        this.workItems = [];
        this.isSending = false;
    }
    
    // Public
    
    initialize() {
        this.restoreWorkItems();
        this.sendNext();
    }
    
    destroy() {
        this.stopTimer();
    }
    
    commitWorkItem(item) {
        this.workItems.push(item);
        this.storeWorkItems();
        
        this.sendNext();
    }
    
    // Private
    
    sendNext() {
        if (this.isSending || this.workItems.length === 0) {
            return;
        }
        this.stopTimer();
        this.isSending = true;
        
        const item = this.workItems[0];
        
        log.info('Posting work item', item, '...');
        
        this.apiService.postWorkItem(item)
            .then(() => {
                log.info('Work item posted');
                this.isSending = false;
                
                this.workItems.shift();
                this.storeWorkItems();
                
                if (this.workItems.length > 0) {
                    this.sendNext();
                } else {
                    this.emit('all-sent');
                }
            })
            .catch((error) =>{
                log.warn('Work item posting error:', error);
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
    
    storeWorkItems() {
        store.set(`workItems-${this.userId}`, this.workItems);
    }
    
    restoreWorkItems() {
        const workItems = store.get(`workItems-${this.userId}`);
        if (workItems) {
            this.workItems = workItems.map(item => ({
                ...item,
                startTime: new Date(item.startTime),
                endTime: new Date(item.endTime),
            }));
            log.info(`${workItems.length} work items restored`);
        }
    }
}

export default WorkItemService;
