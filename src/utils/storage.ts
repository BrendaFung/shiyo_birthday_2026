import type {SaveState} from '../types';
const KEY='shiyo-birthday-state';
export const readState=():SaveState|null=>{try{const v=localStorage.getItem(KEY);return v?JSON.parse(v):null;}catch{return null;}};
export const writeState=(v:SaveState)=>localStorage.setItem(KEY,JSON.stringify(v));
export const clearState=()=>localStorage.removeItem(KEY);
