/**
 * Program to start express server for dev testing.
 */
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./build/webpack.config.development')
const theme = require('material-ui/styles')

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

app.use(express.static(__dirname + config.output.publicPath));

app.get('/', function (req, res) {
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

app.get('/sensor/:sensor/status',(req,res)=>{
  const health=Boolean(Math.round(Math.random())),status=Boolean(Math.round(Math.random()));
  res.json({
      id:req.params.sensor,
      idle:!health,
      status:health?status:undefined,
      color: health?(status?theme.colors.greenA700:theme.colors.redA700):undefined
  });
});


app.get('/machine/:machine',(req,res)=>{
  console.log(req.params.machine);
  const locations= [
  {name: 'Machine Schematic-01',image:'images/Auto_pallet1.png',"sensors":[{'x': 190, 'y': 100},{'x': 335, 'y': 42}, {'x': 150, 'y': 190}]},
  {name: 'Machine Schematic-02',image:'images/Auto_pallet2.PNG',"sensors":[{'x': 305, 'y': 103},{'x': 125, 'y': 182}, {'x': 380, 'y': 150}, {'x': 200, 'y': 195}]},
  {name: 'Machine Schematic-03',image:'images/Auto_pallet1.png',"sensors":[{'x': 300, 'y': 90}, {'x': 250, 'y': 245 },{'x': 214, 'y': 305},{"x":85,"y":91,},{"x":180,"y":41}]}];
  const currentMachineConfig = locations.filter(location=>location.name===req.params.machine)[0];
  currentMachineConfig.sensors = currentMachineConfig.sensors.map((sensor,i)=>{
    return Object.assign({},sensor,{
      id:i+1,
      label:i+1,
      url:`sensor/${i+1}/status`,
      updateFreq : Math.round(Math.random()*10)
    });
  });
  res.json(currentMachineConfig);
});

app.listen(port, '0.0.0.0', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://0.0.0.0:' + port)
})