import { RoleEnumType } from '@prisma/client'
import express from 'express'
import authCheck from '../../middleware/authCheck'
import validateRequest from '../../middleware/validationMiddleware'
import { TurfController } from './controller'
import { TurfValidation } from './validation'

const router = express.Router()

router.delete('/delete/:id',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN), TurfController.deleteTurfControler)
router.put('/update/:id',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN), TurfController.updateTurfController)
router.get('/single/:id', TurfController.getSingleTurfController)
router.post('/create',  TurfController.createController)
// router.post('/create', authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN),validateRequest(TurfValidation.create), TurfController.createController)
router.get('/allTurfs', TurfController.getAllTurfsController)

export const TurfRouter = router