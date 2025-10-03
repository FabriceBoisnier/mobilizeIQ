import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// --- GET /vehicles (liste des véhicules de l'orga courante)
router.get("/", requireAuth, async (req, res) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { orgId: Number(req.user!.orgId) },
  });
  res.json(vehicles);
});

// --- POST /vehicles (ajout d'un véhicule)
router.post("/", requireAuth, async (req, res) => {
  const { typeId, registration, brand, model, energy, status } = req.body;

  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        orgId: Number(req.user!.orgId),
        typeId,
        registration,
        brand,
        model,
        energy,
        status,
      },
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: "Could not create vehicle", details: err });
  }
});

// --- PATCH /vehicles/:id (update d'un véhicule)
router.patch("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const vehicle = await prisma.vehicle.updateMany({
      where: { id, orgId: Number(req.user!.orgId) },
      data: req.body,
    });

    if (vehicle.count === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle updated" });
  } catch (err) {
    res.status(400).json({ error: "Could not update vehicle", details: err });
  }
});

// --- DELETE /vehicles/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const vehicle = await prisma.vehicle.deleteMany({
      where: { id, orgId: Number(req.user!.orgId) },
    });

    if (vehicle.count === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted" });
  } catch (err) {
    res.status(400).json({ error: "Could not delete vehicle", details: err });
  }
});

export default router;
