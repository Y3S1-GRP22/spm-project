import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import databaseConnection from "./config/database.mjs";
import logger from "./utils/logger.mjs";
import virtualTryOnRouter from "./routes/virtualtryon.route.mjs";
import ratingRouter from "./routes/rating.route.mjs";
import DeliveryDriverRoute from "./routes/DeliveryDriverRoute.mjs";
import DeliveryRoute from "./routes/DeliveryRoute.mjs";
import PaymentRoute from "./routes/PaymentRoute.mjs";
import CategoryRoute from "./routes/CategoryRoute.mjs";
import ProductRoute from "./routes/ProductRoute.mjs";
import AdminRouter from "./routes/AdminRoute.mjs";
import UserRouter from "./routes/UserRoute.mjs";
import LoginRouter from "./routes/LoginRoute.mjs";

const app = express();
const PORT = process.env.PORT || "8080";

dotenv.config();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

app.use("/delivery-driver", DeliveryDriverRoute);
app.use("/delivery", DeliveryRoute);
app.use("/payment", PaymentRoute);

app.use("/category", CategoryRoute);
app.use("/product", ProductRoute);

app.use("/admin", AdminRouter);
app.use("/login", LoginRouter);
app.use("/user", UserRouter);

app.listen(PORT, () => {
    logger.info(`Server is up and running on port ${PORT}`)
    databaseConnection();
})

app.use("/try-on", virtualTryOnRouter)
app.use("/rating", ratingRouter)



//routes
app.use("/admin", AdminRouter);
app.use("/login", LoginRouter);
app.use("/user", UserRouter);