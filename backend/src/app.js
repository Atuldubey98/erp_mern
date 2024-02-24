const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/users.routes");
const errorHandler = require("./handlers/error.handler");
const path = require("path");
const cors = require("cors");
const organizationRouter = require("./routes/org.routes");
const { NODE_ENV, SESSION_SECRET, MONGO_URI } = require("./config");

const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"/views"))

app.use(express.static(path.join(__dirname, 'public')))
app.use(
  express.static(path.join(__dirname, "../../frontend/dist"), {
    maxAge: "1y",
  })
);
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    next();
  } else {
    return res.sendFile(
      path.join(__dirname, "../../frontend/dist/index.html")
    );
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const whitelist = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:9000"];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

const sessionOptions = {
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    ttl: 14 * 24 * 60 * 60,
  }),
  cookie: {
    sameSite: "strict",
    secure: false,
  },
};

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
  sessionOptions.cookie.secure = true;
}
app.use(session(sessionOptions));

app.get("/api/v1/health", (_, res) => {
  return res.status(200).send("Server is running");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/organizations", organizationRouter);

app.use("*", (req, res) => {
  return res
    .status(404)
    .json({ message: `${req.originalUrl} not found on server` });
});
app.use(errorHandler);
module.exports = app;
