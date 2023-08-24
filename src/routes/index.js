import express from "express"
import userRoute from './user.route'
import authRoute from './auth.route'
import productRoute from './product.route'
import orderRoute from './order.route'
import dashboardRoute from './dashboard.routes'
import sessionRoute from './session.route'

const router = express.Router()

router.use('/user', userRoute)
router.use('/auth', authRoute)
router.use('/product', productRoute)
router.use('/order', orderRoute)
router.use('/dashboard', dashboardRoute)
router.use('/session', sessionRoute)

export default router;