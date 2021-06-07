const express =require('express')
const bodyParser=require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const cors=require ('cors')
const app=express()
const port=require('./constants/constant')
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



var swaggerDefinition = {
  info: {
      title: 'Training 0',
      version: '2',
      description: '',

  },
  host: `localhost:3000`,
  basePath: '/',
  schemes: [
      'http',
      'https'
  ],
  securityDefinitions: {
      Bearer: {
          type: 'apiKey',
          in: 'header',
          name: 'auth-token'
      }
  }

};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};


const swaggerSpec = swaggerJSDoc(options);


const user = require('./routes/user');
const homeRoutes = require('./routes/home-routes');

const db = require('./models');
require('ejs');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

db.sequelize.sync({force:false})
  .then(()=> console.log('successfully synced with DB'))
  .catch((err)=> console.log("Sync error", err))


app.use('/training', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', user);
app.use('/home',homeRoutes);


// set port, listen for requests
app.listen(port,()=>{
  console.log("Localhost 3000 server is running....");
})