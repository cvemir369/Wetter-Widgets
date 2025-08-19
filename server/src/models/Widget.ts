import mongoose, { Document, Schema, Model } from "mongoose";

// TypeScript interface for Widget document
export interface IWidget extends Document {
  location: string;
  createdAt: Date;
  userId?: mongoose.Types.ObjectId;
}

const WidgetSchema: Schema<IWidget> = new Schema({
  location: {
    type: String,
    required: true,
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

const Widget: Model<IWidget> = mongoose.model<IWidget>("Widget", WidgetSchema);

export default Widget;
