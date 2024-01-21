const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.MysqlHost,
  user: process.env.MysqlUser,
  password: process.env.MysqlPassword,
  database: process.env.MysqlDb,
});

// ----------------------------------
// Sessions
// ----------------------------------

function addSession(userid, access_token, expiry, refresh_token) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO sessions VALUES ("${userid}", "${access_token}", ${expiry}, "${refresh_token}")`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function getUser(userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM sessions WHERE userid = ${userid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function updateSession(userid, access_token, expiry, refresh_token) {
  return new Promise((resolve, reject) => {
    con.query(
      `UPDATE sessions SET access_token = "${access_token}", expiry = ${expiry}, refresh_token = "${refresh_token}" WHERE userid = ${userid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function removeSession(userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `DELETE FROM sessions WHERE userid = ${userid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

// ----------------------------------
// Homeworks
// ----------------------------------

function addHomework(title, description, date, important) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO homeworks (title, description, date, important) VALUES ("${title}", "${description}", ${date}, ${important})`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function removeHomework(id) {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM homeworks WHERE id = ${id}`, (error, result) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(result);
      }
    });
  });
}

function listFutureHomeworks() {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM homeworks WHERE date > ${Date.now()}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function setHomeworkDone(id, userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `INSERT INTO done (userid, homeworkid) VALUES (${userid}, ${id})`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function setHomeworkNotDone(id, userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `DELETE FROM done WHERE userid = "${userid}" and homeworkid = ${id}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

function getDone(userid) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT * FROM done WHERE userid = ${userid}`,
      (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = {
  addSession,
  getUser,
  updateSession,
  removeSession,

  addHomework,
  removeHomework,
  listFutureHomeworks,
  setHomeworkDone,
  setHomeworkNotDone,
  getDone,
};
