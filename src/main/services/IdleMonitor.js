import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';


const UPDATE_INTERVAL = 1500; // 5 s

// TODO 60 s
const IDLE_THRESHOLD = 5; // 5s

class IdleMonitor extends EventEmitter {
    constructor() {
        super();

        this._idleTime = 0;
        this.lastActivityTime = null;
        this.isActive = true;
        this.isStarted = false;
    }

    get idleTime() {
        return this._idleTime;
    }

    start() {
        if (this.isStarted) return;
        this.isStarted = true;

        this.reset();

        this.updateInterval = setInterval(() => {
            this.updateIdleState();
        }, UPDATE_INTERVAL);
    }

    stop() {
        if (!this.isStarted) return;
        this.isStarted = false;

        clearInterval(this.updateInterval);
    }

    reset() {
        this._idleTime = 0;
        this.lastActivityTime = new Date();
        this.isActive = true;
        this.dispatchChanges();
    }

    updateIdleState() {
        if (!this.isStarted || !this.lastActivityTime) return;

        const idleState = powerMonitor.getSystemIdleState(IDLE_THRESHOLD);
        const newIsActive = idleState === 'active';

        if (!this.isActive && newIsActive) {
            const now = new Date();

            this._idleTime += Math.floor(
                (now.getTime() - this.lastActivityTime.getTime()) / 1000
            );

            this.lastActivityTime = now;
            this.isActive = true;

            this.dispatchChanges();
        } else {
            this.isActive = newIsActive;
        }
    }

    // Private

    dispatchChanges() {
        this.emit('changed');
    }
}

export default IdleMonitor;
