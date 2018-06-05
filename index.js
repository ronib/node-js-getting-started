const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const cool = require('cool-ascii-faces');

let timesHandler = (req,res) => {
  let result = '';
  const times = process.env.TIMES || 7;
  for (let i=0; i<times; i++){
    result +=i + ' ';
  }

  res.send(result);
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  