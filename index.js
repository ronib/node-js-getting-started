const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');
const {Pool} = require('pg');

// check that github is working
let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

let timesHandler = (req,res) => {
  let result = '';
  const times = process.env.TIMES || 7;
  for (let i=0; i<times; i++){
    result +=i + ' ';
  }

  res.send(result);
}

let dbHandler = async(req, res) =>{

  let mock =  { 
       command: 'SELECT', 
       rowCount: 2, 
       oid: null, 
       rows: [ { id: 1, name: 'hello db' }, { id: 2, name: 'roni' } ], 
       fields:  
        [ { 
            name: 'id', 
            tableID: 5819032, 
            columnID: 1, 
            dataTypeID: 23, 
            dataTypeSize: 4, 
            dataTypeModifier: -1, 
            format: 'text' }, 
         { 
            name: 'name', 
            tableID: 5819032, 
            columnID: 2, 
            dataTypeID: 25, 
            dataTypeSize: -1, 
            dataTypeModifier: -1, 
            format: 'text' } ], 
       _parsers: [ ], 
       RowCtor: null, 
       rowAsArray: false 
      };

  try{
     const client = await pool.connect();
     const results = await client.query('SELECT * FROM test_table');
     console.log("result is ", results);
     console.log("db url", process.env.DATABASE_URL);
     res.render('pages/db', results);
     client.release();
  


  } catch(err){
     console.error(err);
     res.send("Error: " + err);
  }
}

const myName = process.env.name || 'default';


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req,res)=>res.send(cool()))
  .get('/roni', (req, res)=> res.send("hi roni, name parameter is " + myName))
  .get('/times',timesHandler)
  .get('/db', dbHandler)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  