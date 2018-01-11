const levelup   = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown('./db/cachedb'));

module.exports = {
  getUser: (userId) => {
    return new Promise((resolve, reject) => {
      return db.get(userId, { asBuffer: false }).then((user) => {
        resolve(JSON.parse(user));
      });
    })
  },
  saveUser: (key, user) => {
    return db.put(key, JSON.stringify(user));
  },
  getRoom: (roomId) => {
    return new Promise((resolve, reject) => {
      return db.get(roomId, { asBuffer: false }).then((room) => {
        resolve(JSON.parse(room));
      });
    })
  },
  saveRoom: (key, room) => {
    return db.put(key, JSON.stringify(room));
  }
};
