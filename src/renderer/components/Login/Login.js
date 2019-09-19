import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import ErrorBanner from '../Error/ErrorBanner';
import styles from './Login.css';

const Login = () => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(false);
    
    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    
    const onSubmit = () => {
        event.preventDefault();

        setError(false);
        setInProgress(true);

        ipcRenderer.once('log-in-result', (event, success) => {
            if (!success) {
                setInProgress(false);
                setError(true);
            }
        });

        ipcRenderer.send('log-in', { login, password });
    };
    
    return (
        <div className={styles.login}>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className={styles.field}
                    placeholder="Логин"
                    value={login}
                    onChange={handleLoginChange}
                    disabled={inProgress}
                    autoFocus={true}
                />
                <br/>
                <input
                    type="password"
                    className={styles.field}
                    placeholder="Пароль"
                    value={password}
                    disabled={inProgress}
                    onChange={handlePasswordChange}
                />
                <br/>
                <button
                    type="submit"
                    className={styles.button}
                    disabled={inProgress || login === '' || password === ''}
                >
                    Войти
                </button>
            </form>
            {
                error
                ? <div className={styles.error}>
                    <ErrorBanner>
                        Неверные логин/пароль или отсутствует подключение
                    </ErrorBanner>
                </div>
                : ''
            }
        </div>
    );
};

export default Login;
