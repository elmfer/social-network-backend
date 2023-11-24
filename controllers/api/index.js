const router = require('express').Router();
const userRouter = require('./user');
const thoughtRouter = require('./thought');

router.use('/users', userRouter);
router.use('/thoughts', thoughtRouter);

module.exports = router;