import { remote, shell } from 'electron';
import urls from '../../common/urls';

const { Menu } = remote;

export const makeContextMenu = (query) => {
    return Menu.buildFromTemplate([
        {
            label: 'Открыть на YouTrack...',
            click: () => shell.openExternal(urls.viewAllIssues(query))
        }
    ]);
};
