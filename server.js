"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)(); // Load environment variables
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
// Telegram Webhook Route
app.post("/webhook", (req, res) => {
    console.log("Received Telegram Update:", req.body);
    res.sendStatus(200);
});
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
