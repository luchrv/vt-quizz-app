import { Router } from "express";
import * as ResultCtrl from "../controllers/result.controller";


const router = Router();

router.post("/", ResultCtrl.createResult);
router.get("/", ResultCtrl.getResults);
router.get("/:resultId", ResultCtrl.getResultById);

export default router;
