import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';


const UPDATE_INTERVAL = 1500; // 5 s

// Минимальное время бездествия, считающееся периодом неактивности
const IDLE_PERIOD_THRESHOLD = 300; // 5 m

class IdleMonitor extends EventEmitter {
    constructor() {
        super();

        this._idleTime = 0;
        this.lastActivityTime = null;
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
            const idleState = powerMonitor.getSystemIdleState(1);
            if (idleState === 'active') {
                this.activateApp();
            }
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
        this.dispatchChanges();
    }

    activateApp() {
        if (!this.isStarted || !this.lastActivityTime) return;

        const now = new Date();
        const timeFromLastActivity = Math.floor(
            (now.getTime() - this.lastActivityTime.getTime()) / 1000
        );
        this.lastActivityTime = now;

        if (timeFromLastActivity >= IDLE_PERIOD_THRESHOLD) {
            this._idleTime += timeFromLastActivity;
            this.dispatchChanges();
        }
    }

    // Private

    dispatchChanges() {
        this.emit('changed');
    }
}

export default IdleMonitor;
