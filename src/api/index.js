import v1 from './v1';
import Router from 'express';

const api = new Router();

// Allow API v1 usage
api.use('/v1', v1);

export default api;
