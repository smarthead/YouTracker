import { EventEmitter } from 'events';
import TrackingRecoveryService from './TrackingRecoveryService';
import IdleMonitor from './IdleMonitor';
import IdleNotifier from './IdleNotifier';

const WORK_ITEM_MIN_DURATION = 30 * 1000; // 30 s

// Минимальное суммарное время неактивности, при котором показывается предупреждение
const IDLE_WARNING_THRESHOLD = 300; // 5 m

class TrackingService extends EventEmitter {
    
    constructor(workItemService) {
        super();
        
        this.workItemService = workItemService;
        this.recoveryService = new TrackingRecoveryService();
        this.idleMonitor = new IdleMonitor();
        
        this.idleNotifier = new IdleNotifier(() => {
            this.idleMonitor.activateApp();
            return this.current;
        });

        this._current = null;
    }
    
    get current() {
        return this._current;
    }
    
    async initialize() {
        await this.recoverWorkItems();
        
        this.idleMonitor.on('changed', () => this.handleIdleTimeChange());
        this.idleNotifier.initialize();
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
            idle: {
                current: 0,
                subtracted: 0,
                warningIsShown: false
            },
            startTime,
            endTime: null
        };
        
        this.recoveryService.start(issue.id, startTime);
        this.idleMonitor.start();
        this.idleNotifier.start();
        
        console.log(`Start tracking issue ${issue.idReadable} (${issue.id})`);
        
        this.dispatchChanges();
    }
    
    stop() {
        if (this._current === null || this._current.endTime !== null) {
            return;
        }
        
        this.idleNotifier.stop();
        this.idleMonitor.stop();
        this.recoveryService.stop();
        
        const {
            issue, startTime,
            idle: { subtracted }
        } = this._current;

        const endTime = new Date();
        const { time, minutes, isValid } = workItemTime(startTime, endTime, subtracted);
        
        this._current.endTime = endTime;
        this._current.isActive = false;
        this._current.idle.current = 0;
        this._current.idle.warningIsShown = false;

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
        
        this.dispatchChanges();
    }
    
    add({ issueId, minutes }) {
        const today = new Date();
        this.workItemService.commitWorkItem({
            issueId,
            date: today.getTime(),
            minutes
        });
    }

    acceptIdleTime() {
        console.log('Idle time accepted');
        this.idleMonitor.reset();
    }

    subtractIdleTime() {
        if (!this._current) return;
        
        this._current.idle.subtracted += this._current.idle.current;
        this.recoveryService.updateSubtracted(this._current.idle.subtracted);

        console.log('Idle time subtracted');

        this.idleMonitor.reset();
    }
    
    updateIssue(issue) {
        if (!this._current || this._current.issue.id !== issue.id) {
            return;
        }
        this._current.issue = issue;
    }

    // Private

    async recoverWorkItems() {
        const recoverItem = await this.recoveryService.recoverWorkItem();
        if (!recoverItem) return;
        
        const { issueId, startTime, lastTime, subtracted } = recoverItem;
        const { time, minutes, isValid } = workItemTime(startTime, lastTime, subtracted);
        
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

    handleIdleTimeChange() {
        if (!this._current) return;

        const idleTime = this.idleMonitor.idleTime;

        console.log(`Idle time: ${idleTime}s`);

        if (this._current.idle.current !== idleTime) {
            this._current.idle.current = idleTime;
            this._current.idle.warningIsShown = idleTime >= IDLE_WARNING_THRESHOLD;
            this.dispatchChanges();
        }
    }

    dispatchChanges() {
        this.emit('changed');
    }
}

const workItemTime = (startTime, endTime, subtracted) => {
    const time = endTime.getTime() - startTime.getTime() - subtracted * 1000;
    const minutes = Math.ceil(time / 1000 / 60);
    
    return {
        time, minutes,
        isValid: time > WORK_ITEM_MIN_DURATION
    }
};

export default TrackingService;
