import { app, Menu } from 'electron';
import isMac from '../../common/isMac';

export const makeMainMenu = (appState, onReload, onLogOut, onOpenIssuesInYouTrack) => {
    const appName = app.getName();
    const appVersion = app.getVersion();

    const fileMenu = isMac ? {
        label: appName,
        submenu: [
            {
                label: 'Выйти из аккаунта',
                enabled: appState.isAuthorized,
                click: onLogOut
            },
            { type: 'separator' },
            {
                label: `О ${appName}`,
                role: 'about'
            },
            { type: 'separator' },
            {
                label: `Скрыть ${appName}`,
                role: 'hide'
            },
            {
                label: 'Скрыть остальные',
                role: 'hideothers'
            },
            {
                label: 'Отобразить все',
                role: 'unhide'
            },
            { type: 'separator' },
            {
                label: `Выйти из ${appName}`,
                role: 'quit'
            }
        ]
    } : {
        label: 'Файл',
        submenu: [
            {
                label: `Версия ${appVersion}`,
                enabled: false
            },
            { type: 'separator' },
            {
                label: 'Выйти из аккаунта',
                enabled: appState.isAuthorized,
                click: onLogOut
            },
            { type: 'separator' },
            {
                label: `Выйти из ${appName}`,
                role: 'quit'
            }
        ]
    };

    const editMenu = {
        label: 'Правка',
        submenu: [
            {
                label: 'Отменить',
                role: 'undo'
            },
            {
                label: 'Повторить',
                role: 'redo'
            },
            { type: 'separator' },
            {
                label: 'Вырезать',
                role: 'cut'
            },
            {
                label: 'Копировать',
                role: 'copy'
            },
            {
                label: 'Вставить',
                role: 'paste'
            },
            {
                label: 'Удалить',
                role: 'delete'
            },
            {
                label: 'Выбрать все',
                role: 'selectAll'
            }
        ]
    };

    const issuesMenu = {
        label: 'Задачи',
        submenu: [
            {
                label: 'Обновить',
                enabled: appState.isAuthorized,
                click: onReload
            },
            { type: 'separator' },
            {
                label: 'Открыть на YouTrack...',
                click: onOpenIssuesInYouTrack
            }
            // TODO Сделать возможность настройки и отключения группировки
            //
            // { type: 'separator' },
            // {
            //     label: 'Группировка',
            //     submenu: [
            //         {
            //             label: 'Нет',
            //             type: 'radio',
            //             checked: false
            //         },
            //         {
            //             label: 'По проекту',
            //             type: 'radio',
            //             checked: true
            //         }
            //     ]
            // }
        ]
    };

    return Menu.buildFromTemplate([
        fileMenu,
        editMenu,
        issuesMenu
    ]);
};
