require('dotenv').config();

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/argus';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-argus';
exports.PORT = process.env.PORT || 8080;
exports.TEST_PORT =process.env.PORT || 8081;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';