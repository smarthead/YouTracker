import { app, Menu } from 'electron';
import isMac from '../../common/isMac';

export const makeMainMenu = (appState, onReload, onLogOut) => {
    const appName = app.getName();

    const editMenu = [
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
    ];

    return Menu.buildFromTemplate(
        isMac ? [
            {
                label: appName,
                submenu: [
                    {
                        label: 'Обновить список задач',
                        enabled: appState.isAuthorized,
                        click: onReload
                    },
                    { type: 'separator' },
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
            },
            {
                label: 'Правка',
                submenu: editMenu
            }
        ] : [
            {
                label: 'Файл',
                submenu: [
                    {
                        label: 'Обновить список задач',
                        enabled: appState.isAuthorized,
                        click: onReload
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
            },
            {
                label: 'Правка',
                submenu: editMenu
            }
        ]
    );
};
