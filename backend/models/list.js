import mongoose from "mongoose";

const listSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: [true, "Board id is required"],
    },

    position: {
      type: Number,
      default: 0,
      required: [true, "work positiion is required"],
    },
  },
  { timestamps: true },
);

const List = mongoose.model("List", listSchema);
export default List;
