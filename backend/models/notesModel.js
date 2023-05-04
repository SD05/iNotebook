const mongoose = require("mongoose");

const notesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a text value"],
    },
    description: {
      type: String,
      required: [true, "Please add a text value"],
    },
    tag: {
      type: String,
      required: [true, "Please add a text value"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notes", notesSchema);
