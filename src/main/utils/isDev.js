import { app } from 'electron';

const isDev = !app.isPackaged;
export default isDev;