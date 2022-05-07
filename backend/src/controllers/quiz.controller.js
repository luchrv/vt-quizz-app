import Quiz from "../models/Quiz";
import { setResponse } from "../libs/responses";
import { getPagination } from "../libs/pagination";

export const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);

    const quizSave = await newQuiz.save();
    return res
      .status(201)
      .json(setResponse(201, "Quiz created successfully", quizSave));
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json(
        setResponse(500, "Internal server error", { error: error.message })
      );
  }
};

export const getQuizes = async (req, res) => {
  try {
    let { page, size, name } = req.query;

    page = page ? page : 0;
    size = size ? size : 5;
    name = name ? name : "";

    var condition = name
      ? { name: { $regex: new RegExp(name.trim()), $options: "i" } }
      : {};

    const { limit, offset } = getPagination(page, size);

    const quizes = await Quiz.paginate(condition, {
      sort: { createdAt: -1 },
      limit,
      offset,
    });

    return res
      .status(200)
      .json(setResponse(200, "Quizes fetched successfully", quizes));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    res.status(200).json(setResponse(200, "Quiz fetched successfully", quiz));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const updateQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
      new: true,
    });
    return res
      .status(200)
      .json(setResponse(200, "Quiz updated successfully", updatedQuiz));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const createQuizQuestionById = async (req, res) => {
  try {
    const { quizId } = req.params;

    const { question, answers } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      {_id: quizId},
      {$push: {questions: {question, answers}}},
      { new: true }
    );

    return res
      .status(200)
      .json(setResponse(200, "Quiz question pushed successfully", updatedQuiz));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const updateQuizQuestionById = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;


    const { question, answers } = req.body;

    const updatedQuiz = await Quiz.findOneAndUpdate(
      {_id: quizId, "questions._id": questionId},
      {$set: {
        "questions.$.question": question,
        "questions.$.answers": answers
      }},
      { new: true }
    );
    return res
      .status(200)
      .json(setResponse(200, "Quiz updated successfully", updatedQuiz));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const deleteQuizQuestionById = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      {_id: quizId},
      {$pull: {"questions": {"_id": questionId}}},
      { new: true }
    );
    return res
      .status(200)
      .json(setResponse(200, "Quiz updated successfully", updatedQuiz));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};

export const deleteQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndDelete(quizId);
    res.status(204).json(setResponse(204, "Quiz deleted successfully", null));
  } catch (error) {
    console.log(error);
    res.status(500).json(setResponse(500, "Internal server error", error));
  }
};
