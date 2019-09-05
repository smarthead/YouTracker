import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';


const UPDATE_INTERVAL = 1000; // 1 s

// Минимальная продолжительность сессии неактивности
// TODO 60 seconds
const IDLE_SESSION_MIN_DURATION = 5;

class IdleMonitor extends EventEmitter {
    constructor() {
        super();
        this.savedIdleTime = 0;
        this.idleSessionTime = 0;
    }

    get idleTime() {
        let idleTime = this.savedIdleTime;
        if (this.idleSessionTime >= IDLE_SESSION_MIN_DURATION) {
            idleTime += this.idleSessionTime;
        }
        return idleTime;
    }

    start() {
        this.reset();

        this.updateInterval = setInterval(() => {

            // TODO не учитывается блокировка компьютера. Использовать getSystemIdleState(idleThreshold)

            // TODO Заменить на powerMonitor.getSystemIdleTime() после обновления до Electron 6
            powerMonitor.querySystemIdleTime((systemIdleTime) => {
                const oldIdleTime = this.idleTime;

                // New idle session
                if (systemIdleTime === 0 && this.idleSessionTime >= IDLE_SESSION_MIN_DURATION) {
                    this.savedIdleTime += this.idleSessionTime;
                }
                this.idleSessionTime = systemIdleTime;

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
        this.idleSessionTime = 0;
        this.dispatchChanges();
    }

    // Private

    dispatchChanges() {
        this.emit('changed');
    }
}

export default IdleMonitor;
