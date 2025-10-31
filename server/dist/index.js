"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./Public/index");
const Dev_1 = require("./Dev");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/public", index_1.PublicHandler);
app.use("/api/v1/dev", Dev_1.DevHandler);
app.listen(4000, () => {
    console.log("Server running at port 4000");
});
