import log from 'debug';

log.enable('muta:*');

export const debug = log('muta:trace');
export const info = log('muta:info');
export const error = log('muta:error');
