import mongoose from "mongoose";

const boardSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Board title is required"],
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Collaborators who has access to this board
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const Board = mongoose.model("Board", boardSchema);
export default Board;
