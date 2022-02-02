import electron from 'electron';

export const isDev = typeof electron !== 'string';
