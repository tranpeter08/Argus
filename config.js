exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/employees';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-employees';
exports.PORT = process.env.PORT || 8080;