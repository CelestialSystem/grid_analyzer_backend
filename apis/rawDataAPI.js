import express from 'express';
import { getCount, createConnection } from '../helper/sqlHelper';
const router = express.Router();

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getData', (req, res, next) => {
  const targetSize = parseInt(req.query.size, 10);
  const filter = parseInt(req.query.filter, 10);
  const tableName = req.query.tableName;
  const count = getCount(tableName);

  let result = [];
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
        connection.query(`SELECT * FROM ${tableName} where id <= ${targetSize}`, ( err, rows, b ) => {
        res.send({ users: rows, totalCount: count });
      });  
    }
    connection.end();
  });
});


/**
 * For SyncFusion.
 * @type {[type]}
 */
router.post('/getData', (req, res, next) => {
  const connection = createConnection();
  let { skip, take, where } = req.body;
  skip = parseInt(skip, 10);
  take = parseInt(take, 10);
  const tableName = req.query.tableName;
  const count = getCount(tableName);
  
  // { requiresCounts: true, skip: 0, take: 20 }

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (where) {
        const filter = where[0];

        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${filter.field} like "${filter.value}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${filter.field} like "${filter.value}%" LIMIT ${take} OFFSET ${skip};`, ( err, rows, b ) => {
            res.send({ result: rows, count: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id >= ${skip+1} && id < ${skip + take + 1}`, ( err, rows, b ) => {
          res.send({ result: rows, count: count });
          connection.end();
        });  
      }
    }
  });
});


/**
 * For Kendo UI Buffering.
 * @type {[type]}
 */
router.get('/getDataBuffering', (req, res, next) => {
  const connection = createConnection();
  let { skip, take, where, tableName } = req.query;
  
  if (tableName) {
    tableName = "mega_100000";
  }

  const count = getCount(tableName);
  skip = parseInt(skip, 10);
  take = parseInt(take, 10);

  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      connection.query(`SELECT * FROM ${tableName} where id >= ${skip+1} && id < ${skip + take + 1}`, ( err, rows, b ) => {
        res.send({ results: rows, count: count });
        connection.end();
      });  
    }
  });
});

/**
 * Generates and Sends data for Felx Grid Buffered Data.
 * @type {[type]}
 */
router.get('/getFlexGridBufferedData', (req, res, next) => {
  let {
    start,
    pageSize,
    filter,
    tableName
  } = req.query;

  if (tableName) {
    tableName = "mega_100000";
  }

  const count = getCount(tableName);
  start = parseInt(start, 10);
  pageSize = parseInt(pageSize, 10);

  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (filter) {
        var filter = JSON.parse(filter);
        const field = filter.key;
        const value = filter.value;
        connection.query(`SELECT count(*) as totalCount FROM celestial_data where ${field} like "${value}%"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM celestial_data where ${field} like "${value}%" LIMIT ${pageSize} OFFSET ${start};`, ( err, rows, b ) => {
            res.send({ result: rows, count: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + pageSize}`, ( err, rows, b ) => {
          res.send({ result: rows, count: count });
          connection.end();
        });  
      }
    }
  });
});


/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getFilterDataExtClassic', (req, res, next) => {
  let {
    size, filter, tableName
  } = req.query;

  size = parseInt(size, 10);
  filter = JSON.parse(filter)[0];
  if (tableName) {
    tableName = "mega_100000";
  }

  const count = getCount(tableName);
  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      let query = '';

      if (filter) {
        const field = filter.property;
        const value = filter.value;


        query = `SELECT * FROM ${tableName} where ${field} like "${value}%"`;
      } else {
        query = `SELECT * FROM ${tableName} where id <= ${size}`;
      }

      connection.query(`SELECT * FROM ${tableName} where id <= ${size}`, ( err, rows, b ) => {
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
  let {
    size, filter, tableName
  } = req.query;

  size = parseInt(size, 10);

  if (tableName) {
    tableName = "mega_100000";
  }

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
            query = `SELECT * FROM ${tableName} where id <= ${size} AND ${field}="${value}"`;
          } else if (type === 'contains') {
            query = `SELECT * FROM ${tableName} where id <= ${size} AND ${field} like "${value}%"`;
          }
        } else {
          query = `SELECT * FROM ${tableName} where id <= ${size}`;
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
  const targetSize = parseInt(req.query.pageSize, 10);
  const skip = parseInt(req.query.skip, 10);
  let tableName = req.query.tableName;

  if (tableName) {
    tableName = "mega_100000";
  }

  const count = getCount(tableName);
  const filter = req.query.filter;
  const connection = createConnection();

  connection.connect((err) => {
    if(err) {
      res.send(err);
    } else {
      if (filter) {
        const filters = filter.filters[0];
        const field = filters.field;
        const value = filters.value;

        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${field}="${value}"`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${field}="${value}" LIMIT ${targetSize} OFFSET ${skip};`, ( err, rows, b ) => {
            res.send({ users: rows, totalCount: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} LIMIT ${targetSize} OFFSET ${skip};`, ( err, rows, b ) => {
          res.send({ users: rows, totalCount: count });
          connection.end();
        });  
      }
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
      tableName
  } = req.query;
  
  const count = getCount(tableName);
  const filterVal = filter ? JSON.parse(filter)[0] : null;
  start = parseInt(start, 10);
  limit = parseInt(limit, 10);
  page = parseInt(page, 10);

  if (limit > 50000) {
    res.send({
      error: 'Max Limit is 50000'
    })
  }
  const connection = createConnection();
  connection.connect((err) => {
    if(err) {
        res.send(err);
    } else {
      if (filter) {
        connection.query(`SELECT count(*) as totalCount FROM ${tableName} where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit}`, ( err, rowCounter, b ) => {
          const rowCount = rowCounter[0].totalCount;
          connection.query(`SELECT * FROM ${tableName} where ${filterVal.property} like "${filterVal.value}%" LIMIT ${limit} OFFSET ${limit * (page - 1)};`, ( err, rows, b ) => {
            res.send({ users: rows, totalCount: rowCount });
            connection.end();
          });
        });  
      } else {
        connection.query(`SELECT * FROM ${tableName} where id > ${start} && id <= ${start + limit}`, ( err, rows, b ) => {
          res.send({ users: rows, totalCount: count });
          connection.end();
        });  
      }
    }
  });
});

export default router;