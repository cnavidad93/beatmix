const levelup   = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown('./db/cachedb'));

module.exports = db;
