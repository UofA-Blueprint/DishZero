import { Router } from 'express'
import scheduledJobsController from '../controllers/scheduledJobsController.js';

const router = Router()

router.get('/dishCheckout', async (req, res, next) => {
    let transId = req.query.transId;
    let userId = req.query.userId;
    let dishId = req.query.dishId;
    // scheduledJobsController.dishCheckoutReturnReminder(transId, userId, dishId);
    await scheduledJobsController.test();
    res.send('You have hit GET /posts endpoint')
});

export default router;