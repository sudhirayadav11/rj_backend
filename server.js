const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const stripe = require("stripe")(
  "sk_test_51P0M0uA9t10f3qsTRjRlUvSsoI30qIXNY8EOTmULUvRkVsviTjGQTepfKjhXsSwiwxtA39tfowqTRop7lWMCHDW300utiaxmBC"
);

// databases connections
const ConnectDB = require("./DataBase/ConnectDb");
ConnectDB();
// middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: "kjhgju7658gfgh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 86400), // Expires in 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// user routes defined
const userrouter = require("./Routes/UserRoutes");
app.use("/api/v1", userrouter);

// products routes defined
const productRouter = require("./Routes/ProductRoute");
app.use("/api/v1", productRouter);



// cart routes defined
const cartRouter = require("./Routes/CartRoutes");
app.use("/api/v1", cartRouter);

// category routes defined
const categoryRouter = require("./Routes/CategoryRoute");
app.use("/api/v1", categoryRouter);

// wishlist routes defined
const wishlistRouter = require("./Routes/WishlistRoutes");
app.use("/api/v1", wishlistRouter);





// Payments api routes
app.post("/api/v1/checkout", async (req, res) => {
  try {
    const productsData = JSON.parse(req.body.body);
    const lineItems = productsData.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qty,
    }));
    console.log("lineItems data", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/success", // Change the success and cancel URLs as needed
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(PORT, () => {
  console.log(` Server listening on ${PORT}`);
});
