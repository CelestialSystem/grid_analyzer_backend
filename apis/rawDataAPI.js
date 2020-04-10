import express from 'express';
import data from '../data/dataFileRaw.json';
const router = express.Router();

/**
 * Generates and Sends the raw Data over the client on the basis of direct size.
 * @type {[type]}
 */
router.get('/getData', (req, res, next) => {
    const targetSize = parseInt(req.query.size, 10);
    let result = [];
    
    if (targetSize <= 1000000) {
      if (targetSize > 5000) {
        const multiplier = targetSize/5000;
        
        for(let i = 1; i <= multiplier; i++) {
          result = result.concat(JSON.parse(JSON.stringify(data.users)));
        }
        
        for (let j = 1; j < targetSize; j++) {
          result[j].id = j;
        }
      } else {
        result = JSON.parse(JSON.stringify(data.users)).filter((user) => {
          return user.id >= 0 && user.id < targetSize
        });
      }
      
      res.send(result);
    } else {
      res.send({ error: 'Max 1 million users can be fetched.' });
    }
      
});

/**
 * Generates and Sends the Data over the client on the basis of pagination.
 * @type {[type]}
 */
router.get('/getPageData', (req, res, next) => {
    let {
        start,
        limit
    } = req.query;
    
    start = parseInt(start, 10);
    limit = parseInt(limit, 10);
    
    
    if (limit > 5000) {
      res.send({
        error: 'Max Limit is 5000'
      })
    }
    
    const newStart = start % 5000;
    
    const result = JSON.parse(JSON.stringify(data.users)).filter((user) => {
      return user.id >= newStart && user.id < newStart + limit
    });
    
    for (let j = 0; j < limit; j++) {
      result[j].id = start + j;
    }
    
    res.send(result);
});

export default router;
