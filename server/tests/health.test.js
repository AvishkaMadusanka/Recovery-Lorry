import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';

test('health endpoint reports the API is ready', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok', service: 'rescuenow-api' });
});

test('protected nearby search rejects anonymous callers', async () => {
  const response = await request(app).get('/api/vehicles/nearby?latitude=7.29&longitude=80.63&radiusKm=25');
  assert.equal(response.status, 401);
});
