import express from "express";

const router = express.Router();

router.get('/songs/', (req, res) => {
    res.json({status: 'ok',})
});

export default router;
