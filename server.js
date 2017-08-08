/**
 * Program to start express server for dev testing.
 */
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./build/webpack.config.development')

const app = express()
const compiler = webpack(config)
const port = process.env.port || 3000

/**
 * Webpack dev and hot middleware are used during development for serving js files and hot reload
 */
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(require('webpack-hot-middleware')(compiler))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './tests/index.html'))
});

app.get('/gauge/reading',(req,res)=>{
  res.json(Math.ceil(Math.random()*100));
});

app.get('/gauge/details',(req,res)=>{
  res.json({title:'Gauge Widget',description:'Meter Gauge'});
});

app.get('/gauge/ranges',(req,res)=>{
  res.json([
    {
      id:1,
      min:0,
      max:25
    },
    {
      id:2,
      min:25,
      max:50
    },
    {
      id:3,
      min:50,
      max:75
    },
    {
      id:4,
      min:75,
      max:100
    }
  ]);
});

app.get('/sensor/status',(req,res)=>{
  const health=Math.round(Math.random()),status=[0,1,-1];
  res.json({
    reading:{
      health:health,
      status:health?status[Math.round(2*Math.random())]:undefined
    }
  });
});

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }
})
