import log from 'debug';

log.enable('muta:warn');
log.enable('muta:error');

export const debug = log('muta:trace');
export const info = log('muta:info');
export const warn = log('muta:warn');
export const error = log('muta:error');
