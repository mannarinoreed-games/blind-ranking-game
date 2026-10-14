import { S } from './state.js';

const screens = {};
/** Each screen: render(...args) draws it; optional refresh() runs on live data changes. */
export const register = (name, render, refresh) => (screens[name] = { render, refresh });
export function go(name, ...args) { S.screen = name; screens[name].render(...args); }
export const refresh = () => screens[S.screen]?.refresh?.();
