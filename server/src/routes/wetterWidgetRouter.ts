import { Router } from "express";
import * as widgetController from "../controllers/wetterWidgetController";

const router = Router();

// GET /widgets - List all widgets
router.get("/", widgetController.getWidgets);

// POST /widgets - Create a new widget
router.post("/", widgetController.createWidget);

// DELETE /widgets/:id - Delete a widget by ID
router.delete("/:id", widgetController.deleteWidget);

export default router;
