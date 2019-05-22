const base = 'https://ramilaminov.myjetbrains.com/youtrack';

// API
const getIssues = `${base}/api/issues?fields=id,idReadable,summary&query=Assignee:me`;
const postWorkItems = (issueId) => `${base}/api/issues/${issueId}/timeTracking/workItems`;

// Web
const viewIssue = (idReadable) => `${base}/issue/${idReadable}`;

export default { getIssues, postWorkItems, viewIssue };
