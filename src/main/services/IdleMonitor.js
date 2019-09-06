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
    }

    get idleTime() {
        return this._idleTime;
    }

    start() {
        this.reset();

        this.updateInterval = setInterval(() => {
            this.checkIdleState();
        }, UPDATE_INTERVAL);
    }

    stop() {
        if (!this.updateInterval) return;
        clearInterval(this.updateInterval);
    }

    reset() {
        this._idleTime = 0;
        this.lastActivityTime = new Date();
        this.isActive = true;
        this.dispatchChanges();
    }

    // Private

    checkIdleState() {
        if (!this.lastActivityTime) return;

        // TODO После обновления до Electron 6
        // заменить на powerMonitor.getSystemIdleState
        powerMonitor.querySystemIdleState(IDLE_THRESHOLD, (idleState) => {
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
        });
    }

    dispatchChanges() {
        this.emit('changed');
    }
}

export default IdleMonitor;
