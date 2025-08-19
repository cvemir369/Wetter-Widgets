import express, { Request, Response } from "express";
import wetterWidgetRouter from "./routes/wetterWidgetRouter";
import errorHandler from "./middleware/errorHandler";
import "./db/index"; // Ensure database connection is established
import { PORT } from "./config";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Mount widget routes
app.use("/widgets", wetterWidgetRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
