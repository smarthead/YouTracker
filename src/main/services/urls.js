const base = 'https://ramilaminov.myjetbrains.com';

// API
const oauth = `${base}/hub/api/rest/oauth2/token`;
const getIssues = `${base}/youtrack/api/issues?fields=id,idReadable,summary,customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))&query=Assignee:me`;
const postWorkItems = (issueId) => `${base}/youtrack/api/issues/${issueId}/timeTracking/workItems`;

// Web
const viewIssue = (idReadable) => `${base}/youtrack/issue/${idReadable}`;

export default { oauth, getIssues, postWorkItems, viewIssue };
