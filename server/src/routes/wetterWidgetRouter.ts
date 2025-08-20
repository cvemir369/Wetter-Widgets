// ================= Wetter Widget Router ========================
// Defines Express routes for weather widget operations.
// Delegates request handling to the controller layer.
// ===============================================================

import { Router } from "express";
import * as widgetController from "../controllers/wetterWidgetController";

// Create a new Express router instance
const router = Router();

/**
 * GET /widgets
 * List all widgets
 */
router.get("/", widgetController.getWidgets);

/**
 * POST /widgets
 * Create a new widget
 */
router.post("/", widgetController.createWidget);

/**
 * DELETE /widgets/:id
 * Delete a widget by ID
 */
router.delete("/:id", widgetController.deleteWidget);

// Export the router for use in the main app
export default router;
