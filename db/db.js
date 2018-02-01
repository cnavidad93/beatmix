const levelup   = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown('./db/cachedb'));

const DB = {
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
    });
  },
  saveRoom: (key, room) => {
    return db.put(key, JSON.stringify(room));
  },
  getUserRoom: (userId) => {
    return new Promise((resolve, reject) => {
      console.log(userId);
      DB.getUser(userId).then((user) => {
        console.log(user);
        return DB.getRoom(user.roomId);
      })
      .then((room) => {
        resolve(room);
      })
      .catch((err) => {
        reject(err);
      })
    });
  }
};

module.exports = DB;
