import { YOUTRACK_URL } from '../config';

// API

const oauth = `${YOUTRACK_URL}/hub/api/rest/oauth2/token`;
const getMe = `${YOUTRACK_URL}/api/admin/users/me?fields=id,login`;

const getIssues = (query) => `${YOUTRACK_URL}/api/issues`
    + '?fields=id,idReadable,summary,project(shortName,name)'
    + ',customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))'
    + `&query=${encodeURIComponent(query)}`;

const postWorkItems = (issueId) => `${YOUTRACK_URL}/api/issues/${issueId}/timeTracking/workItems`;

// Links

const viewIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}`;
const editIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}?edit`;
const viewAllIssues = (query) => `${YOUTRACK_URL}/issues?q=${encodeURIComponent(query)}`;

export default { oauth, getMe, getIssues, postWorkItems, viewIssue, editIssue, viewAllIssues };
