import { powerMonitor, Notification } from 'electron';
import formatTimeInterval from '../../common/formatTimeInterval';

class IdleNotifier {

    constructor(getCurrentTracking) {
        this.getCurrentTracking = getCurrentTracking;
        this.isStarted = false;
    }

    initialize() {
        powerMonitor.on('unlock-screen', () => {
            if (!this.isStarted) return;
            
            const tracking = this.getCurrentTracking();
            if (tracking && tracking.idle.warningIsShown) {
                notify(tracking);
            }
        });
    }

    start() {
        this.isStarted = true;
    }

    stop() {
        this.isStarted = false;
    }
}

const notify = (tracking) => {
    const notification = new Notification({
        title: `Задача ${tracking.issue.idReadable} включена`,
        body: `Вы были неактивны ${formatTimeInterval(tracking.idle.current)}.`
    });
    notification.show();
};

export default IdleNotifier;
