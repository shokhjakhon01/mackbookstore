const express = require("express");
const app = express();
const path = require("path");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRoutes = require("./routes/home");
const notebooksRoutes = require("./routes/notebooks");
const addRoutes = require("./routes/add");
const cardRoutes = require("./routes/card");
const ordersRoutes = require("./routes/orders");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const User = require("./models/user");
const varMiddleware = require("./middleware/var");
const userMiddleware = require("./middleware/user");
const fileMiddleware = require("./middleware/file");
const errorPage = require("./middleware/error");

const MONGODB_URI =
  "mongodb+srv://shohjahon01:77Shoh77@cluster0.7t0iy.mongodb.net/notebook-blog";

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./utils"),
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: "session",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret val",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(fileMiddleware.single("avatar"));

app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/notebooks", notebooksRoutes);
app.use("/add", addRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.use(errorPage);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
    // const candidate = await User.findOne();
    // if (!candidate) {
    //   const user = new User({
    //     email: "suyunov@gmail.com",
    //     name: "shakh",
    //     cart: { items: [] },
    //   });
    //   await user.save();
    // }

    const PORT = process.env.PORT || 2001;
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
// ``
