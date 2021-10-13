import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateAndTime: { type: Date },
    status: { type: String },
    requestDateAndTime: { type: Date },
    ResponseDateAndTime: { type: Date },
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
