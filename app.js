var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// Only run this in development
if (process.env.NODE_ENV !== "production") {
  const chokidar = require("chokidar");

  //Set up watcher to watch all files in ./server/app
  const watcher = chokidar.watch("./server/app");

  watcher.on("ready", function() {
    //On any file change event
    //You could customise this to only run on new/save/delete etc
    //This will also pass the file modified into the callback
    //however for this example we aren't using that information
    watcher.on("all", function() {
      console.log("Reloading server...");
      //Loop through the cached modules
      //The "id" is the FULL path to the cached module
      Object.keys(require.cache).forEach(function(id) {
        //Get the local path to the module
        const localId = id.substr(process.cwd().length);

        //Ignore anything not in server/app
        if(!localId.match(/^\/server\/app\//)) return;

        //Remove the module from the cache
        delete require.cache[id];
      });
      console.log("Server reloaded.");
    });
  });
}



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
