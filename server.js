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

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './tests/index.html'))
})

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

app.get('/machine/config',(req,res)=>{
  res.json([
    {
      id:1,
      name: 'Machine Schematic - 01',
      backgoundMap:'https://encrypted-tbn0.gstatic.com/images?' +
      'q=tbn:ANd9GcTQehDUC9hh3QRSmuMdZuTpi7Q3s0TPNsXCKK7tJwSUiAKhNBI54A'
    },
    {
      id:2,
      name: 'Machine Schematic - 01',
      backgoundMap:'https://encrypted-tbn0.gstatic.com/images?' +
      'q=tbn:ANd9GcTQehDUC9hh3QRSmuMdZuTpi7Q3s0TPNsXCKK7tJwSUiAKhNBI54A'
    },
    {
      id:3,
      name: 'Machine Schematic - 01',
      backgoundMap:'https://encrypted-tbn0.gstatic.com/images?' +
      'q=tbn:ANd9GcTQehDUC9hh3QRSmuMdZuTpi7Q3s0TPNsXCKK7tJwSUiAKhNBI54A'
    }
  ]);
});

app.get('/sensor/:machine_id/location',(req,res)=>{
  res.json([
    {
      machine_id: 1,
      sensorDetails: [
        {
          id: 1,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 2,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 3,
          x: 85,
          y: 91,
          state: 0
        }
      ]
    },
    {
      machine_id: 2,
      sensorDetails: [
        {
          id: 1,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 2,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 3,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 4,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 5,
          x: 85,
          y: 91,
          state: 0
        }
      ]
    },
    {
      machine_id: 3,
      sensorDetails: [
        {
          id: 1,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 2,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 3,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 4,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 5,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 6,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 7,
          x: 85,
          y: 91,
          state: 0
        },
        {
          id: 8,
          x: 85,
          y: 91,
          state: 0
        }
      ]
    }
  ]);
});


app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://0.0.0.0:' + port)
})