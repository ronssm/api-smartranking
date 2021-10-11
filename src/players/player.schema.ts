import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    name: { type: String },
    ranking: { type: String },
    rankingPosition: { type: Number },
    photoUrl: { type: String },
  },
  { timestamps: true, collection: 'players' },
);
