"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicHandler = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.PublicHandler = (0, express_1.Router)();
exports.PublicHandler.get("/Health", (req, res) => {
    return res.status(200).json({
        message: "Public Route Up and Running"
    });
});
exports.PublicHandler.get("/experiences", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield prisma.experience.findMany({
            select: {
                id: true,
                title: true,
                image: true,
                description: true,
                price: true,
                location: true,
                about: true,
                slots: {
                    select: {
                        id: true,
                        date: true,
                        time: true,
                        available: true
                    }
                }
            }
        });
        return res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    }
    catch (error) {
        console.error("Error fetching experiences:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}));
exports.PublicHandler.get("/experiences/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const experience = yield prisma.experience.findUnique({
            where: { id: id },
            select: {
                id: true,
                title: true,
                image: true,
                description: true,
                price: true,
                location: true,
                about: true,
                slots: {
                    select: {
                        id: true,
                        date: true,
                        time: true,
                        available: true
                    }
                }
            }
        });
        if (!experience) {
            return res.status(404).json({ success: false, message: "Experience not found" });
        }
        return res.status(200).json({ success: true, data: experience });
    }
    catch (error) {
        console.error("Error fetching experience:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}));
exports.PublicHandler.get("/promos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promos = yield prisma.promo.findMany({
            select: {
                id: true,
                code: true,
                discountType: true,
                value: true,
                isActive: true
            }
        });
        return res.status(200).json({
            success: true,
            count: promos.length,
            data: promos
        });
    }
    catch (error) {
        console.error("Error fetching promos:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}));
exports.PublicHandler.get("/promos/:code", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.params;
        const promo = yield prisma.promo.findUnique({
            where: { code: code.toUpperCase() },
            select: {
                id: true,
                code: true,
                discountType: true,
                value: true,
                isActive: true
            }
        });
        if (!promo) {
            return res.status(404).json({ success: false, message: "Invalid promo code" });
        }
        // check if active
        if (!promo.isActive) {
            return res.status(400).json({ success: false, message: "Promo code is no longer active" });
        }
        return res.status(200).json({ success: true, data: promo });
    }
    catch (error) {
        console.error("Error fetching promo:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}));
exports.PublicHandler.post("/bookings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { experienceId, slotId, fullName, email, totalPrice, promoCode } = req.body;
        if (!experienceId || !slotId || !fullName || !email || !totalPrice) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Find experience
        const experience = yield prisma.experience.findUnique({
            where: { id: experienceId },
        });
        if (!experience) {
            return res.status(404).json({ error: "Experience not found" });
        }
        // Find slot
        const slot = yield prisma.slot.findUnique({
            where: { id: slotId },
        });
        if (!slot) {
            return res.status(404).json({ error: "Slot not found" });
        }
        if (!slot.available) {
            return res.status(400).json({ error: "Slot is not available" });
        }
        if (slot.experienceId !== experienceId) {
            return res.status(400).json({ error: "Slot does not belong to this experience" });
        }
        if (promoCode) {
            const promo = yield prisma.promo.findUnique({
                where: { code: promoCode.toUpperCase() },
            });
            if (!promo) {
                return res.status(400).json({ error: "Invalid promo code" });
            }
            if (!promo.isActive) {
                return res.status(400).json({ error: "Promo code is no longer active" });
            }
            let expectedPrice = experience.price;
            if (promo.discountType === "PERCENTAGE") {
                expectedPrice = experience.price * (1 - promo.value / 100);
            }
            else if (promo.discountType === "FLAT") {
                expectedPrice = experience.price - promo.value;
            }
            if (Math.abs(expectedPrice - totalPrice) > 0.01) {
                return res.status(400).json({
                    error: "Total price does not match expected price after discount",
                    expectedPrice: expectedPrice.toFixed(2)
                });
            }
        }
        else {
            if (Math.abs(experience.price - totalPrice) > 0.01) {
                return res.status(400).json({
                    error: "Total price does not match experience price",
                    expectedPrice: experience.price.toFixed(2)
                });
            }
        }
        const booking = yield prisma.booking.create({
            data: {
                experienceId,
                slotId,
                fullName,
                email,
                totalPrice,
                promoCode: promoCode ? promoCode.toUpperCase() : null,
                status: "CONFIRMED"
            },
        });
        yield prisma.slot.update({
            where: { id: slotId },
            data: {
                available: false,
            },
        });
        return res.status(201).json({
            message: "Booking successful",
            booking,
        });
    }
    catch (err) {
        console.error(err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: "You have already booked this slot" });
        }
        res.status(500).json({ error: "Something went wrong" });
    }
}));
exports.PublicHandler.post("/promos/validate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Promo code is required" });
        }
        const promo = yield prisma.promo.findUnique({
            where: { code: code.toUpperCase() },
        });
        if (!promo) {
            return res.status(404).json({ valid: false, message: "Invalid promo code" });
        }
        if (!promo.isActive) {
            return res.status(400).json({ valid: false, message: "Promo code is no longer active" });
        }
        return res.status(200).json({
            valid: true,
            discountType: promo.discountType,
            value: promo.value,
            message: "Promo code is valid",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
