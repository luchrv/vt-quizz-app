import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { handleE11000 } from "../libs/errors";

const quizSchema = new Schema(
  {
    name: { type: String, trim: true, minlength: 3, unique: true },
    description: String,
    questions: [
      {
        question: String,
        answers: [
          {
            answer: String,
            correct: Boolean,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    emitIndexErrors: true,
  }
);

quizSchema.plugin(mongoosePaginate);

quizSchema.post("save", handleE11000);
quizSchema.post("findByIdAndUpdate", handleE11000);
quizSchema.post("findOneAndUpdate", handleE11000);

export default model("Quiz", quizSchema);
