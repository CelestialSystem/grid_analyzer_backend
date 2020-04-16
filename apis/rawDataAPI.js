import express from 'express';
import { createConnection } from '../helper/sqlHelper';
const router = express.Router();

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = parseInt(req.query.filter, 10);

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
        connection.query(`SELECT * FROM celestial_data where id <= ${targetSize}`, ( err, rows, b ) => {
        res.send({ users: rows, totalCount: 1000000 });
      });  
    }
    connection.end();
  });
});

router.post('/getData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = parseInt(req.query.filter, 10);

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      connection.query(`SELECT * FROM celestial_data where id <= ${targetSize}`, ( err, rows, b ) => {
        res.send({ result: rows, count: 2000 });
      });  
    }
    connection.end();
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getFilterDataExtClassic', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = JSON.parse(req.query.filter)[0];

  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      let query = '';

      if (filter) {
        const field = filter.property;
        const value = filter.value;


        query = `SELECT * FROM celestial_data where ${field} like "${value}%"`;
      } else {
        query = `SELECT * FROM celestial_data where id <= ${targetSize}`;
      }

      connection.query(`SELECT * FROM celestial_data where id <= ${targetSize}`, ( err, rows, b ) => {
        res.send(rows);
      });  
    }
    connection.end();
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getDevExtremeData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = JSON.parse(req.query.filter);
  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
      if(err) {
          res.send(err);
      } else {
        let query = '';

        if (filter) {
          const field = filter[0];
          const value = filter[2];
          const type = filter[1];

          if (type === '=') {
            query = `SELECT * FROM celestial_data where id <= ${targetSize} AND ${field}="${value}"`;
          } else if (type === 'contains') {

            query = `SELECT * FROM celestial_data where id <= ${targetSize} AND ${field} like "${value}%"`;
          }
        } else {
          query = `SELECT * FROM celestial_data where id <= ${targetSize}`;
        }

        connection.query(query, ( err, rows, b ) => {
          res.send(rows);
        });  
      }
  });
});

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getKendoUIData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = JSON.parse(req.query.filter);
  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
      if(err) {
          res.send(err);
      } else {
        let query = '';

        if (filter) {
          const field = filter[0];
          const value = filter[2];
          const type = filter[1];

          if (type === 'equal') {
            query = `SELECT * FROM celestial_data where id <= ${targetSize} AND ${field}="${value}"`;
          } else if (type === 'contains') {
            

            query = `SELECT * FROM celestial_data where id <= ${targetSize} AND ${field} like "${value}%"`;
          }
        } else {
          query = `SELECT * FROM celestial_data where id <= ${targetSize}`;
        }

        connection.query(query, ( err, rows, b ) => {
          res.send(rows);
        });  
      }
  });
});

/**
 * Generates and Sends the Data over the client on the basis of pagination.
 * @type {[type]}
 */
router.get('/getPageData', (req, res, next) => {
  let {
      start,
      limit,
      filter,
      page,
  } = req.query;
  
  const filterVal = JSON.parse(filter)[0];
  start = parseInt(start, 10);
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  if (limit > 5000) {
    res.send({
      error: 'Max Limit is 5000'
    })
  }
  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (filter) {
        connection.query(`SELECT count(*) as totalCount FROM celestial_data where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit}`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM celestial_data where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit} OFFSET ${limit * page};`, ( err, rows, b ) => {
            res.send({ users: rows, totalCount: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM celestial_data where id >= ${start} && id < ${start + limit}`, ( err, rows, b ) => {
          res.send({ users: rows, totalCount: 1000000 });
        });  
      }
    }
  });
});

export default router;