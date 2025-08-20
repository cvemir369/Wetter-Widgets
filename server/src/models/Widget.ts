import mongoose, { Document, Schema, Model } from "mongoose";

// ========================= Widget Model =========================
// This file defines the Mongoose schema and TypeScript interface for the Widget entity.
// The Widget represents a weather widget instance, associated with a user and a location.
// Schema-level validation and documentation are provided for maintainability and clarity.
// ===============================================================

/**
 * IWidget interface extends Mongoose Document for type safety.
 * - location: Name or identifier for the widget's location (required, unique).
 * - createdAt: Timestamp of widget creation (auto-generated).
 * - userId: Optional reference to the User who owns the widget.
 */
export interface IWidget extends Document {
  location: string;
  createdAt: Date;
  userId?: mongoose.Types.ObjectId;
}

/**
 * WidgetSchema defines the structure and validation for Widget documents.
 * - location: Required, unique string (2-100 chars), trimmed, with custom error messages.
 * - createdAt: Date, defaults to now.
 * - userId: Optional ObjectId reference to User.
 */
const WidgetSchema: Schema<IWidget> = new Schema({
  location: {
    type: String,
    required: [true, "Location is required."],
    unique: true,
    minlength: [2, "Location must be at least 2 characters."],
    maxlength: [100, "Location must be at most 100 characters."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

// Export the compiled Widget model for use in services/controllers
const Widget: Model<IWidget> = mongoose.model<IWidget>("Widget", WidgetSchema);

export default Widget;
