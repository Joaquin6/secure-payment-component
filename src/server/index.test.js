const request = require('supertest');
const app = require('./index');

describe('Express API Tests', () => {
  
  // Test GET route
  describe('GET /api/hello', () => {
    it('should return hello message', async () => {
      const res = await request(app)
        .get('/api/hello')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toEqual({ message: 'Hello World' });
    });
  });

  // Test error handling
  describe('GET /api/error', () => {
    it('should handle errors properly', async () => {
      const res = await request(app)
        .get('/api/error')
        .expect(500);
      
      expect(res.body.error).toBe('Test error');
    });
  });

  // Test 404
  describe('Non-existent routes', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });
  });
});