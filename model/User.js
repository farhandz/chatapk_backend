const db = require('../connection/db');
const { promise } = require('../connection/db');

module.exports = {
  getall: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * from user", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  getbyid: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM user WHERE id=${id}`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  update: (username, alamat, phone_number, country, image, id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE user SET username='${username}', alamat='${alamat}', phone_number='${phone_number}', country='${country}', image='${image}' WHERE id = '${id}'`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  register: (username, email, hashpassword) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO user (username, email, image, password) VALUES ('${username}', '${email}',  'defalt.jpg',  '${hashpassword}')`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  verification: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE user SET is_active=1 WHERE email = '${email}' `,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
  refreshToken: (newtokenrefresh, email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE user set  RefreshToken = '${newtokenrefresh}'  WHERE email = '${email}'  `,
        (err, resullt) => {
          if (err) {
            reject(err);
          } else {
            resolve(resullt);
          }
        }
      );
    });
  },
  login: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * from user WHERE email = '${email}'`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  addfriends: (id, id_friends) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO friends (user_id, friend_id) VALUES ('${id}', '${id_friends}')`,
        (err, resullt) => {
          if (err) {
            reject(err);
          } else {
            resolve(resullt);
          }
        }
      );
    });
  },
  idemail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT id from user WHERE email='${email}'`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  displayfriend: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT friends.id, u.id AS id_user,u1.image AS image, u1.id AS id_friend, u.username AS user, u1.username AS friend FROM friends INNER JOIN user u ON u.id = friends.user_id INNER JOIN user u1 ON u1.id = friends.friend_id WHERE (friends.user_id = ${id} OR friends.friend_id = ${id} )`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },
};  