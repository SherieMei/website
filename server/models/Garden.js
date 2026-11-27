const mongoose = require("mongoose");
const gardenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Creative soul"
    },
    ideas: [
      {
        title: {
          type: String,
          required: true,
          trim: true
        },
        content: {
          type: String,
          default: ""
        },
        mood: {
          type: String,
          enum: ["Inspired", "Calm", "Dreamy", "Focused", "Tired"],
          default: "Calm"
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    tasks: [
      {
        text: {
          type: String,
          required: true,
          trim: true
        },
        completed: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Garden", gardenSchema);
