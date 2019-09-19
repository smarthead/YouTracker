import urls from '../../common/urls';

class ApiService {
    
    constructor(authService) {
        this.authService = authService;
    }
    
    async getIssue(id) {
        const response = await this.authService.authorizedFetch(urls.getIssue(id), {
            headers
        });

        return response.ok ? await response.json() : null;
    }
    
    async getIssues(query) {
        const response = await this.authService.authorizedFetch(urls.getIssues(query), {
            headers
        });
        
        return response.ok ? await response.json() : [];
    }

    async validateIssuesQuery(query) {
        const response = await this.authService.authorizedFetch(urls.getIssues(query), {
            method: 'HEAD'
        });

        return response.ok;
    }
    
    async postWorkItem({ issueId, date, minutes, startTime, endTime }) {
        const response = await this.authService.authorizedFetch(urls.postWorkItems(issueId), {
            headers,
            method: 'POST',
            body: JSON.stringify({
                date,
                duration: { minutes },
                text: workItemText(startTime, endTime)
            })
        });
        
        if (response.status >= 500 && response.status < 600) {
            throw new Error("Server error");
        }
    }
}

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

const formatTime = (time) => {
    return time.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow' });
};

const workItemText = (startTime, endTime) => {
    if (startTime && endTime) {
        return `[${formatTime(startTime)}–${formatTime(endTime)}] YouTracker`;
    }
    return null;
};

export default ApiService;
