const base = 'https://ramilaminov.myjetbrains.com';

// API

const oauth = `${base}/hub/api/rest/oauth2/token`;
const getMe = `${base}/youtrack/api/admin/users/me?fields=id,login`;

// for: me #Unresolved sort by: created desc 
const getIssues = `${base}/youtrack/api/issues?fields=id,idReadable,summary,customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))&query=for:%20me%20%23Unresolved%20sort%20by:%20created%20desc`;

const postWorkItems = (issueId) => `${base}/youtrack/api/issues/${issueId}/timeTracking/workItems`;

// Web

const viewIssue = (idReadable) => `${base}/youtrack/issue/${idReadable}`;

export default { oauth, getMe, getIssues, postWorkItems, viewIssue };
