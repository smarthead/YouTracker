import { remote, clipboard, shell } from 'electron';
import urls from '../../common/urls';
import ipc from '../ipc';

const { Menu } = remote;

export const makeContextMenu = (id, idReadable, summary) => {
    const add = (minutes) => ipc.addWorkItem(id, minutes);
    
    return Menu.buildFromTemplate([
        {
            label: idReadable,
            enabled: false,
        },
        { type: 'separator' },
        {
            label: 'Открыть...',
            click: () => shell.openExternal(urls.viewIssue(idReadable))
        },
        {
            label: 'Изменить...',
            click: () => shell.openExternal(urls.editIssue(idReadable))
        },
        { type: 'separator' },
        {
            label: 'Копировать ID и название',
            click: () => clipboard.writeText(`${idReadable} ${summary}`)
        },
        {
            label: 'Копировать ссылку',
            click: () => clipboard.writeText(urls.viewIssue(idReadable))
        },
        { type: 'separator' },
        {
            label: 'Добавить время',
            submenu: [
                { label: '5m', click: add(5) },
                { label: '10m', click: add(10) },
                { label: '15m', click: add(15) },
                { label: '30m', click: add(30) },
                { label: '1h', click: add(60) },
                { label: '2h', click: add(120) }
            ]
        }
    ]);
};
