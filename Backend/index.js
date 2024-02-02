const port = 5000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(
  "mongodb+srv://Ishneha_85:12345@cluster0.c0y6vlk.mongodb.net/e-commerce"
);

// Check the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// IMAGE STORAGE ENGINE
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Creating upload Endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  // Change "productImage" to "product"
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", upload.single("product"), async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.file.filename,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();

    console.log("Product saved:", product);

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Error adding product" });
  }
});

// CREATING API FOR DELETING PRODUCTS
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// CREATING API FOR GETTING ALL PRODUCTS
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});
//schema creating for user model

const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating Endpoint for registering the user

app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(500).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//creating endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "wrong password" });
    }
  } else {
    res.json({ success: false, error: "wrong Email ID" });
  }
});
//creating endpoint for newcollection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-6);
  console.log("newcollection fetched");
  res.send(newcollection);
});
//creating endpoint for popular product
app.get("/popularproduct", async (req, res) => {
  let products = await Product.find({ category: "skin" });
  let popular_in_skin = products.slice(0, 8);
  console.log("popular product fetched");
  res.send(popular_in_skin);
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ errors: "please authenticate using a valid taken" });
    }
  }
};

//creating enspoint to get cartdata
app.post("/getcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
  } catch (error) {
    console.error("Error getting cart data:", error);
    res.status(500).json({ success: false, error: "Error getting cart data" });
  }
});

//creating endpoint to add products in cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ message: "Added" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, error: "Error adding to cart" });
  }
});

//creating endpoint to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await Users.findOne({ _id: req.user.id });

    // Check if the item is in the cart and its quantity is greater than 0
    if (userData.cartData[req.body.itemId] > 0) {
      userData.cartData[req.body.itemId] -= 1;
      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
      );
      res.json({ message: "Removed" });
    } else {
      res.status(400).json({ message: "Item not in cart" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, error: "Error removing from cart" });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("Error :" + error);
  }
});
