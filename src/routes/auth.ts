import express from 'express';

const router = express.Router();



router.get('/login', async (req, res) => {
    res.send({ message: "you've reached login" })
})



export default router;