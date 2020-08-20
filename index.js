const express = require("express");
const app = express();
const PORT = process.env.PORT || "8080";
const mongoose = require("mongoose");
const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const exctractJwt = require("passport-jwt").ExtractJwt;
const issueJwt = require("./password_utils").issueJwt;
const genPassword = require("./password_utils").genPassword;
const validatePassword = require("./password_utils").valdatepass;
const crypto = require("crypto");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();
const api = http.createServer(app);
const io = socketio(api);
// socket.io is a real-time bydirectional communication server
// this function gets called when the client connects to the server
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("chat message", ({ msg, name }) => {
    console.log("message: " + msg + "name: " + name);
    socket.broadcast.emit("chat message",{ msg, name });
  });
});
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const chatSchema = mongoose.Schema({
  id: String,
  //first Id(  one is a ref for the current user )
  user_1Name: String,
  //second Id( one is a ref for the other user )
  user_2Name: String,
  massages: [
    {
      //Sender Id
      username: String,
      content: { type: String, required: true },
      timeDate: { type: Date, required: true },
    },
  ],
});
const Chat = mongoose.model("chats", chatSchema);
//the user schema can be what ever we want ie email full name
const userSchema = mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});
//creating the model and passing the collection name and the schema
const User = mongoose.model("User", userSchema);
//a middleware for parsing json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//setting up Cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
//a middleware for parsing cookies
app.use(cookieParser(process.env.SECRET));
// actually using the passport middleware and specifing the Strategy (JWT)

//getting the path to the public key to be able to verify the jwt token body
const pathToKey = path.join(`${__dirname}/chatapp`, "..", "id_rsa_pub.pem");
// getting the public key form the previosly declared path
const publicKey = fs.readFileSync(pathToKey, "utf-8");
//options for JWT token verifier those are the basic options and there is more
const options = {
  /* where to get the token from in the request in this case it should be :
  headers:{
    Authrzation: Bearer <token>
  }
  */
  jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
  // specifing the key to decrypt the hash with
  secretOrKey: publicKey,
  // specifing the algorithim to hash the body so we can comapre it to the token body to verify the jwt token
  algorithms: ["RS256"],
};
passport.use(
  // creating the local strategy (it's like a middleware)
  //the payload is the data in jwt web token
  new jwtStrategy(options, (payload, done) => {
    /*
   here's when the shit happens.
   - passport dosent care what you do in here if you call the following :
    * when succsess call done(null,user) null being the err and the user obj 
    * when failing to find a match of if we don't want to authenticate the user we call done(null,false)
    * and finally when we catch errors we call done(err)
   and that's it for the local strategy anyways
   */
    User.findOne({ _id: payload.sub })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        if (user) {
          //we don't valdate password becase the Jwt library does all the work for us to verify the token
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => {
        if (err) {
          return done(err);
        }
      });
  })
);
//runs everything every time the client goes to a route
app.use(passport.initialize());
api.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server started on port ${PORT}`);
  }
});
// authenticates the user based on the passed strategy and the calls the next function
app.post("/login", (req, res) => {
  //this is called when the user is authenticated
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username }).then((user) => {
    if (!user) {
      res.status(200).json({ err: "unautherized" });
    }
    const isValid = validatePassword(user.hash, user.salt, password);
    if (isValid) {
      const jwt = issueJwt(user);
      res.status(200).json({
        success: true,
        user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    } else {
      res.status(401).json({ err: "wrong password" });
    }
  });
});
app.post("/register", (req, res) => {
  const username = req.body.username;
  User.findOne({ username }).then((user) => {
    if (!user) {
      const password = req.body.password;
      //creating the hash
      const saltHash = genPassword(password);
      const userToAdd = new User({
        username: req.body.username,
        ...saltHash,
      });
      //saving it to the db
      userToAdd.save().then((user) => {
        const jwt = issueJwt(user);
        res.json({
          success: true,
          user,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
      });
    } else {
      res.json({ err: "this username exists" });
    }
  });
});
//creats a chat with a user
app.post(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Chat.findOne({
      $and: [
        {
          $or: [
            { user_1Name: req.user.username },
            { user_1Name: req.body.secondName },
          ],
        },
        {
          $or: [
            { user_2Name: req.user.username },
            { user_2Name: req.body.secondName },
          ],
        },
      ],
    }).then((chat) => {
      if (!chat) {
        User.findOne({ username: req.body.secondName }).then((user) => {
          if (user && user.username !== req.user.username) {
            const newChat = new Chat({
              id: crypto.randomBytes(16).toString("hex"),
              user_1Name: req.user.username,
              user_2Name: req.body.secondName,
              massages: [],
            });
            newChat.save().then((chat) => {
              console.log(chat);
              res.send(chat);
            });
          } else {
            res.status(404).json({ err: "user not found !" });
          }
        });
      } else {
        res.json(chat);
      }
    });
  }
);
// gets a spicefic chat based on the chat ID
app.get(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const chatId = req.body.chatId;
    Chat.findOne({ id: chatId }).then((chat) => {
      if (chat) {
        res.json(chat);
      } else {
        res.status(404).json({ err: "chat dosent exist" });
      }
    });
  }
);
//gets all the chats connected to the logged in user
app.get(
  "/chats",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const username = req.user.username;
    Chat.find({
      $or: [{ user_1Name: username }, { user_2Name: username }],
    }).then((chats) => {
      if (chats) {
        res.json(chats);
      } else {
        res.status(404).json({ err: "the user has no chats !" });
      }
    });
  }
);
//adds a message to chat
app.post(
  "/message",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const content = req.body.content;
    const username = req.user.username;
    const chatId = req.body.chatId;
    Chat.updateOne(
      {
        $and: [
          { id: chatId },
          { $or: [{ user_1Name: username }, { user_2Name: username }] },
        ],
      },
      { $push: { massages: { content, username, timeDate: new Date() } } }
    ).then(
      Chat.findOne({
        id: chatId,
      }).then((chat) => {
        if (chat) {
          res.json(chat);
        } else {
          res.status(404).json({ err: "chat doesn't exist" });
        }
      })
    );
  }
);
//getting users to start a chat
app.post(
  "/search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const query = req.body.query;
    User.findOne({ username: query }).then((user) => {
      if (user.username === req.user.username) {
        res.status(200).json({ err: "no Results" });
      } else {
        res.status(200).json(user.username);
      }
    });
  }
);
