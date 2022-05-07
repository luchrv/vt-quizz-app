import Result from "../models/Result";
import { setResponse } from "../libs/responses";
import { getPagination } from "../libs/pagination";
import Quiz from "../models/Quiz";

export const createResult = async (req, res) => {
  try {
    const newResult = new Result(req.body);

    const quiz = await Quiz.findById(newResult.quiz);

    if (!quiz) {
      return res.status(404).json(setResponse(404, "Quiz not found"));
    }

    newResult.totalQuestions = quiz.questions.length;
    let score = 0;

    if (newResult.totalQuestions === 0) {
      return res.status(400).json(setResponse(400, "Quiz has no questions"));
    }

    if (newResult.questions.length === 0) {
      return res.status(400).json(setResponse(400, "No answers submitted"));
    }

    if (quiz.questions.length !== newResult.questions.length) {
      return res
        .status(400)
        .json(setResponse(400, "Questions length does not match"));
    }

    let err = false;

    newResult.questions.forEach((question) => {

      const findedQuestion = quiz.questions.find((q) => q._id.toString() === question._id.toString());

      if (findedQuestion === undefined) {
        err = true;
      } else {

        question.correct = false;

        findedQuestion.answers.forEach((answer) => {
          if (answer.correct && question.answer === answer.answer) {
            question.correct = true;
            score++;
          }
        });
      }

    });

    if (err) {
      return res.status(400).json(setResponse(400, "Question not found"));
    }

    newResult.score = score;

    const resultSave = await newResult.save();
    res
      .status(201)
      .json(setResponse(201, "Result created successfully", resultSave));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(setResponse(500, "Internal server error", error.message));
  }
};

export const getResults = async (req, res) => {
  try {
    let { page, size, name } = req.query;

    page = page ? page : 0;
    size = size ? size : 5;
    name = name ? name : "";

    var condition = name
      ? {
          user: req.userId,
          name: { $regex: new RegExp(name.trim()), $options: "i" },
        }
      : { user: req.userId };

    const { limit, offset } = getPagination(page, size);

    const results = await Result.paginate(condition, {
      sort: { createdAt: -1 },
      limit,
      offset,
    });

    res
      .status(200)
      .json(setResponse(200, "Results fetched successfully", results));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(setResponse(500, "Internal server error", error));
  }
};

export const getResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId).populate("quiz");
    res
      .status(200)
      .json(setResponse(200, "Result fetched successfully", result));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(setResponse(500, "Internal server error", error));
  }
};
