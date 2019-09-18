import { EventEmitter } from 'events';
import parseIssues from './parseIssues';
import store from './store';

const AUTORELOAD_INTERVAL = 2 * 60 * 1000; // 2 minutes

const DEFAULT_QUERY = 'for: me #Unresolved sort by: created';

class IssueService extends EventEmitter {
    
    constructor(apiService, userId) {
        super();
        
        this.apiService = apiService;
        this.userId = userId;
        
        this._query = { value: DEFAULT_QUERY, inProgress: false, error: null };
        this._issues = [];
        this.destroyed = false;
    }
    
    // Public
    
    get issues() {
        return this._issues;
    }

    get query() {
        return this._query;
    }
    
    initialize() {
        this.restoreQueryValue();
        this.restoreIssues();
        this.startTimer();
    }
    
    destroy() {
        this.stopTimer();
        this.destroyed = true;
    }
    
    async reload() {
        try {
            console.log('Loading issues...');
            
            this._issues = parseIssues(
                await this.apiService.getIssues(this.query.value)
            );
            this.storeIssues();
            
            console.log(`${this._issues.length} issues loaded`);
            this.dispatchChanges();
        } catch (error) {
            console.error('Issues loading error:', error);
        }
    }

    async setQuery(queryValue) {
        this._query.inProgress = true;
        this._query.error = null;
        this.dispatchChanges();

        try {
            const isValid = await this.apiService.validateIssuesQuery(queryValue);

            if (isValid) {
                this._query.value = queryValue;
                this.storeQueryValue();
            } else {
                throw new Error('Issues query is not valid:', queryValue);
            }
        } catch (error) {
            this._query.error = error;
        }

        this._query.inProgress = false;
        this.dispatchChanges();

        await this.reload();
    }
    
    // Private

    dispatchChanges() {
        this.emit('changed');
    }
    
    async startTimer() {
        await this.reload();
        
        if (this.destroyed) return;
        
        this.timer = setTimeout(async () => {
            this.timer = null;
            await this.startTimer();
        }, AUTORELOAD_INTERVAL);
    }
    
    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    
    storeIssues() {
        store.set(`issues-${this.userId}`, this._issues);
    }
    
    restoreIssues() {
        const issues = store.get(`issues-${this.userId}`);
        if (issues) {
            this._issues = issues;
            console.log(`${issues.length} issues restored`);
        }
    }

    storeQueryValue() {
        store.set('issuesQueryValue', this._query.value);
    }

    restoreQueryValue() {
        const query = store.get('issuesQueryValue');
        if (query) {
            this._query.value = query;
            console.log(`Issues query restored: ${query}`);
        }
    }
}

export default IssueService;
    