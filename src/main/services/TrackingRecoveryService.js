import store from './store';


const RECOVER_INTERVAL = 30 * 1000; // 30s


class TrackingRecoveryService {
    
    constructor() {
        this.recoverTracking = null;
    }
    
    // Public
    
    async recoverWorkItem() {
        const recoverTracking = this.restore();
        if (!recoverTracking) return null;
        
        this.recoverTracking = null;
        this.clear();
        
        return recoverTracking;
    }
    
    start(issueId, startTime) {
        this.recoverTracking = {
            issueId,
            startTime,
            lastTime: new Date(),
            subtracted: 0
        }
        this.store(this.recoverTracking);
        
        this.recoverInterval = setInterval(() => {
            this.recoverTracking.lastTime = new Date();
            this.store(this.recoverTracking);
        }, RECOVER_INTERVAL);
    }
    
    stop() {
        clearInterval(this.recoverInterval);
        
        this.recoverTracking = null;
        this.clear();
    }

    updateSubtractedMinutes(subtracted) {
        if (!recoverTracking) return;
        this.recoverTracking.subtracted = subtracted;
        this.store(this.recoverTracking);
    }
    
    // Private
    
    store(item) {
        store.set(`recoverTracking-${this.userId}`, item);
    }
    
    restore() {
        const item = store.get(`recoverTracking-${this.userId}`);
        if (!item) return null;
        
        return {
            issueId: item.issueId,
            startTime: new Date(item.startTime),
            lastTime: new Date(item.lastTime),
            subtracted: item.subtracted
        }
    }
    
    clear() {
        store.delete(`recoverTracking-${this.userId}`);
    }
}

export default TrackingRecoveryService;
