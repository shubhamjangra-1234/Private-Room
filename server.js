const express = require("express");
var app = (module.exports = express());
const http = require("http").createServer(app);
var router = express.Router();
const userModel = require("./user");
const flash = require("connect-flash");
var expressSession = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
var usersRouter = require("./user");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(flash());
//express-session
app.use(
  expressSession({
    reSave: false,
    saveUninitialized: false,
    secret: "secret",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.set("views", __dirname + "/views"); // general config
app.set("view engine", "html");

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
app.use(express.static(__dirname + "/public"));

app.get("/room", isLoggedIn, (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
//register route
app.post("/register", function (req, res) {
  var chatInfo = new userModel({
    username: req.body.username,
    password: req.body.password,
  });

  userModel.register(chatInfo, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/room");
    });
  });
});
//code for login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/room",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {}
);
// code for logout

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

//code for isLoggedIn Middleware

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/room");
}

app.get("/:username", function (req, res) {
  res.send(`${req.params.username} page is not built yet`);
});
// Socket
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
module.exports = router;
