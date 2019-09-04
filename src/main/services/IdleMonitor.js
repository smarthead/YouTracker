import electron from 'electron';
import { EventEmitter } from 'events';


const UPDATE_INTERVAL = 1000;


class IdleMonitor extends EventEmitter {
    constructor() {
        super();
        this.sum = 0;
        this.currentIdleTime = 0;
    }

    get idleTime() {
        return this.sum + this.currentIdleTime;
    }

    start() {
        this.sum = 0;
        this.currentIdleTime = 0;

        this.updateInterval = setInterval(() => {
            electron.powerMonitor.querySystemIdleTime((idleTime) => {
                // New idle session
                if (this.currentIdleTime > 0 && idleTime === 0) {
                    this.sum += this.currentIdleTime;
                }
                this.currentIdleTime = idleTime;

                console.log('Idle time', this.idleTime);
            });
        }, UPDATE_INTERVAL);
    }

    stop() {
        clearInterval(this.updateInterval);
    }
}

export default IdleMonitor;
