import { Router } from "express";
import { PrismaClient } from "@prisma/client"
import { ExperienceInputSchema, PromoInputSchema } from "../Types";

const prisma = new PrismaClient();
export const DevHandler = Router();



DevHandler.get("/Health", (req, res) => {
    return res.status(200).json({
        Message: "Dev Route Up and Running"
    });
});


DevHandler.post("/experiences", async (req, res) => {
  try {
    
    const parsed = ExperienceInputSchema.parse(req.body);
    const { title, image, price, description, location, about, slots } = parsed;

    
    const existingExperience = await prisma.experience.findFirst({
      where: { title },
    });

    if (existingExperience) {
      return res.status(409).json({
        message: "Experience already exists",
      });
    }

    
    const experience = await prisma.experience.create({
      data: {
        title,
        image,
        price,
        description,
        location,
        about,
        slots: slots
          ? {
              create: slots.map((slot) => ({
                date: new Date(slot.date),
                time: slot.time,
                available: slot.available,
              })),
            }
          : undefined,
      },
      include: { slots: true },
    });

    return res.status(201).json({
      message: "Experience added successfully",
      data: experience,
    });
  } catch (error: any) {
    
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors,
      });
    }

    console.error("Error creating experience:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

DevHandler.post("/promos", async (req, res) => {
  try {
    const parsed = PromoInputSchema.safeParse(req.body);

   
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid promo data",
        errors: parsed.error,
      });
    }

    
    const { code, discountType, value, isActive } = parsed.data;

    
    const existingPromo = await prisma.promo.findUnique({
      where: { code },
    });

    if (existingPromo) {
      return res.status(409).json({
        message: "Promo code already exists",
      });
    }

    
    const promo = await prisma.promo.create({
      data: {
        code,
        discountType,
        value,
        isActive,
      },
    });

    return res.status(201).json({
      message: "Promo added successfully",
      data: promo,
    });
  } catch (error: any) {
    console.error("Error adding promo:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
