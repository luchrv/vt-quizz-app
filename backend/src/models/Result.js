import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { handleE11000 } from "../libs/errors";

const resultSchema = new Schema(
  {
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    questions: [
      {
        question: String,
        answer: String,
        correct: Boolean,
      },
    ],
    totalQuestions: Number,
    score: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

resultSchema.plugin(mongoosePaginate);

resultSchema.index({ quiz: 1, user: 1 }, { unique: true });

resultSchema.post("save", handleE11000);
resultSchema.post("findByIdAndUpdate", handleE11000);
resultSchema.post("findOneAndUpdate", handleE11000);

export default model("Result", resultSchema);
