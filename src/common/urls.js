// Base YouTrack URL
const YOUTRACK_URL = 'https://youtrack.smarthead.ru';

// Query
// for: me #Unresolved sort by: created 
const query = 'for:%20me%20%23Unresolved%20sort%20by:%20created';

// API

const oauth = `${YOUTRACK_URL}/hub/api/rest/oauth2/token`;
const getMe = `${YOUTRACK_URL}/api/admin/users/me?fields=id,login`;

const getIssues = `${YOUTRACK_URL}/api/issues?fields=id,idReadable,summary,project(shortName,name),customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))&query=${query}`;

const postWorkItems = (issueId) => `${YOUTRACK_URL}/api/issues/${issueId}/timeTracking/workItems`;

// Links

const viewIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}`;
const editIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}?edit`;
const viewAllIssues = `${YOUTRACK_URL}/issues?q=${query}`;

export default { oauth, getMe, getIssues, postWorkItems, viewIssue, editIssue, viewAllIssues };
