const { getStudentProfile } = require('../src/services/studentService');

describe('Student Service', () => {
  test('getStudentProfile should return student data', async () => {
    const mockUserId = 'test-user-id';
    const result = await getStudentProfile(mockUserId);
    // Mock or use test DB
    expect(result).toBeDefined();
  });
});