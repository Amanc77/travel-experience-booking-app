import express from "express"
import cors from "cors"
import { PublicHandler } from "./Public/index";
import { DevHandler } from "./Dev";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/public", PublicHandler);
app.use("/api/v1/dev", DevHandler);

app.listen(4000, () => {
    console.log("Server running at port 4000");
});