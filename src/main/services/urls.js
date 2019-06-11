import { YOUTRACK_URL } from './config';

// API

const oauth = `${YOUTRACK_URL}/hub/api/rest/oauth2/token`;
const getMe = `${YOUTRACK_URL}/api/admin/users/me?fields=id,login`;

// for: me #Unresolved sort by: created desc 
const getIssues = `${YOUTRACK_URL}/api/issues?fields=id,idReadable,summary,customFields(id,projectCustomField(id,field(id,name)),value(id,minutes,presentation))&query=for:%20me%20%23Unresolved%20sort%20by:%20created%20desc`;

const postWorkItems = (issueId) => `${YOUTRACK_URL}/api/issues/${issueId}/timeTracking/workItems`;

// Web

const viewIssue = (idReadable) => `${YOUTRACK_URL}/issue/${idReadable}`;

export default { oauth, getMe, getIssues, postWorkItems, viewIssue };
