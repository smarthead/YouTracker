import React, { useState } from 'react';
import { ipcRenderer } from 'electron';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    
    const handleLoginChange = (event) => {
        setLogin(event.target.value);
    };
    
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    
    const onSubmit = () => {
        event.preventDefault();
        ipcRenderer.send('logIn', { login, password });
    };
    
    return (
        <div className="login">
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className="login__field"
                    placeholder="Логин"
                    value={login}
                    onChange={handleLoginChange}
                    autoFocus={true}
                />
                <br/>
                <input
                    type="password"
                    className="login__field"
                    placeholder="Пароль"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <br/>
                <button type="submit" className="login__button">
                    Войти
                </button>
            </form>
        </div>
    );
};

export default Login;
