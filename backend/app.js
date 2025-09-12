const path = require('path');
const express = require('express');
const sequelize = require('./util/database.js');
const multer = require('multer');

const app = express();

const recipesRouter = require('./routes/recipes.js')
const usersRouter = require('./routes/users.js')

const Recipe = require('./models/recipe')
const User = require('./models/user')
const session = require('express-session')
const cors = require('cors');
app.use("/images", express.static(path.join(process.cwd(), "images")));
const fileStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb( null, 'images')
  },
  filename: (req,file,cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else{
    cb(null,false);
  }
}

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(cors());
app.use(express.json())
app.use(session({secret: 'my secret', resave:false, saveUninitialized: false}));
app.use(recipesRouter);
app.use(usersRouter);

Recipe.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});

sequelize.sync({force: true})
  .then( result => {
    app.listen(3001,'0.0.0.0')

  }
);



