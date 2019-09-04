import { EventEmitter } from 'events';
import TrackingRecoveryService from './TrackingRecoveryService';
import IdleMonitor from './IdleMonitor';


const MIN_DURATION = 30 * 1000; // 30 s


class TrackingService extends EventEmitter {
    
    constructor(workItemService) {
        super();
        
        this.workItemService = workItemService;
        this.recoveryService = new TrackingRecoveryService();
        this.idleMonitor = new IdleMonitor();

        this._current = null;
    }
    
    get current() {
        return this._current;
    }
    
    async initialize() {
        const recoverItem = await this.recoveryService.recoverWorkItem();
        if (!recoverItem) return;
        
        const { issueId, startTime, lastTime } = recoverItem;
        const { time, minutes, isValid } = workItemTime(startTime, lastTime);
        
        if (isValid) {
            console.log(`Recovered ${minutes} m (${time} ms) in issue ${issueId}`);
            
            this.workItemService.commitWorkItem({
                issueId,
                date: lastTime.getTime(),
                minutes,
                startTime,
                endTime: lastTime
            });
        } else {
            console.log(`Recovered work item is too short (${time} ms) in issue ${issueId}`);
        }
    }
    
    destroy() {
        if (this._current) this.stop();
    }
    
    start(issue) {
        if (this._current) this.stop();
        
        const startTime = new Date();
        
        this._current = {
            issue,
            isActive: true,
            startTime,
            endTime: null
        };
        
        this.recoveryService.start(issue.id, startTime);
        this.idleMonitor.start();
        
        console.log(`Start tracking issue ${issue.idReadable} (${issue.id})`);
        
        this.emit('changed');
    }
    
    stop() {
        if (this._current === null || this._current.endTime !== null) {
            return;
        }
        
        this.idleMonitor.stop();
        this.recoveryService.stop();
        
        const { issue, startTime } = this._current;
        const endTime = new Date();
        const { time, minutes, isValid } = workItemTime(startTime, endTime);
        
        this._current.endTime = endTime;
        this._current.isActive = false;
        
        if (isValid) {
            console.log(`Tracked ${minutes} m (${time} ms) in issue ${issue.idReadable} (${issue.id})`);
            
            this.workItemService.commitWorkItem({
                issueId: issue.id,
                date: endTime.getTime(),
                minutes,
                startTime,
                endTime
            });
        } else {
            console.log(`Work item is too short (${time} ms) in issue ${issue.idReadable} (${issue.id})`);
        }
        
        this.emit('changed');
    }
    
    add({ issueId, minutes }) {
        const today = new Date();
        this.workItemService.commitWorkItem({
            issueId,
            date: today.getTime(),
            minutes
        });
    }
    
    updateIssue(issue) {
        if (!this._current || this._current.issue.id !== issue.id) {
            return;
        }
        this._current.issue = issue;
    }
}

const workItemTime = (startTime, endTime) => {
    const time = endTime.getTime() - startTime.getTime();
    const minutes = Math.ceil(time / 1000 / 60);
    
    return {
        time, minutes,
        isValid: time > MIN_DURATION
    }
};

export default TrackingService;
