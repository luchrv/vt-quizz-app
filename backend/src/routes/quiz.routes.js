import { Router } from "express";
import * as QuizCtrl from "../controllers/quiz.controller";


const router = Router();

router.post("/", QuizCtrl.createQuiz);
router.get("/", QuizCtrl.getQuizes);
router.get("/:quizId", QuizCtrl.getQuizById);
router.put("/:quizId", QuizCtrl.updateQuizById);
router.delete("/:quizId", QuizCtrl.deleteQuizById);
router.post("/:quizId/question", QuizCtrl.createQuizQuestionById);
router.put("/:quizId/question/:questionId", QuizCtrl.updateQuizQuestionById);
router.delete("/:quizId/question/:questionId", QuizCtrl.deleteQuizQuestionById);

export default router;
