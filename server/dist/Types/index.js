"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoInputSchema = exports.ExperienceInputSchema = exports.SlotInputSchema = void 0;
const zod_1 = require("zod");
exports.SlotInputSchema = zod_1.z.object({
    date: zod_1.z.string().refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
    time: zod_1.z.string().min(3, "Time is required"),
    available: zod_1.z.boolean().optional().default(true),
});
exports.ExperienceInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters long"),
    image: zod_1.z.string().url("Invalid image URL"),
    price: zod_1.z.number().positive("Price must be positive"),
    description: zod_1.z.string().min(10, "Description too short"),
    location: zod_1.z.string().min(2, "Location required"),
    about: zod_1.z.string().min(10, "About section too short"),
    slots: zod_1.z.array(exports.SlotInputSchema).optional(),
});
exports.PromoInputSchema = zod_1.z.object({
    code: zod_1.z.string().min(3, "Promo code must be at least 3 characters long"),
    discountType: zod_1.z.enum(["PERCENTAGE", "FLAT"]),
    value: zod_1.z.number().positive("Value must be greater than 0"),
    isActive: zod_1.z.boolean().optional().default(true),
});
