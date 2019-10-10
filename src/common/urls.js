import { YOUTRACK_URL } from '../config';

// API

const oauth = `${YOUTRACK_URL}/hub/api/rest/oauth2/token`;
const getMe = `${YOUTRACK_URL}/api/admin/users/me?fields=id,login`;

const issueFields = 'id,idReadable,summary,project(shortName,name)' +
    ',links(linkType(name),direction,issues(id))' +
    ',customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))';

const getIssue = (id) => `${YOUTRACK_URL}/api/issues/${id}?fields=${issueFields}`;
const getIssues = (query) => `${YOUTRACK_URL}/api/issues?fields=${issueFields}`
    + `&query=${encodeURIComponent(query)}`;

const postWorkItems = (issueId) => `${YOUTRACK_URL}/api/issues/${issueId}/timeTracking/workItems`;

// Links

const viewIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}`;
const editIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}?edit`;
const viewAllIssues = (query) => `${YOUTRACK_URL}/issues?q=${encodeURIComponent(query)}`;

export default { oauth, getMe, getIssue, getIssues, postWorkItems, viewIssue, editIssue, viewAllIssues };
