import { Router } from 'express';
import { dbState } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'rescuenow-api' });
});

router.get('/db-status', (req, res) => {
  res.json({
    status: 'ok',
    database: {
      connected: dbState.connected,
      mode: dbState.mode,
      uri: dbState.uri ? dbState.uri.replace(/:([^:@]+)@/, ':****@') : '',
      error: dbState.error
    }
  });
});

export default router;
