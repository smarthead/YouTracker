import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';


const UPDATE_INTERVAL = 1000; // 1 s

// Минимальная продолжительность сессии неактивности
// TODO 60 seconds
const SESSION_MIN_DURATION = 5;

class IdleMonitor extends EventEmitter {
    constructor() {
        super();
        this.savedIdleTime = 0;
        this.sessionIdleTime = 0;
    }

    get idleTime() {
        return this.savedIdleTime + this.sessionIdleTime;
    }

    start() {
        this.reset();

        this.updateInterval = setInterval(() => {
            // TODO Заменить на powerMonitor.getSystemIdleTime() после обновления до Electron 6
            powerMonitor.querySystemIdleTime((sessionIdleTime) => {
                const oldIdleTime = this.idleTime;

                // New idle session
                if (sessionIdleTime === 0 && this.sessionIdleTime >= SESSION_MIN_DURATION) {
                    this.savedIdleTime += this.sessionIdleTime;
                }
                this.sessionIdleTime = sessionIdleTime;

                if (oldIdleTime !== this.idleTime) {
                    this.dispatchChanges();
                }
            });
        }, UPDATE_INTERVAL);
    }

    stop() {
        if (!this.updateInterval) return;
        clearInterval(this.updateInterval);
    }

    reset() {
        this.savedIdleTime = 0;
        this.sessionIdleTime = 0;
        this.dispatchChanges();
    }

    // Private

    dispatchChanges() {
        this.emit('changed');
    }
}

export default IdleMonitor;
