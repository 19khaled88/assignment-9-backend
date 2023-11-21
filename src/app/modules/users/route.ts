import { RoleEnumType } from '@prisma/client'
import express from 'express'
import authCheck from '../../middleware/authCheck'
import validateRequest from '../../middleware/validationMiddleware'
import { UserController } from './controller'
import { UserValidation } from './validation'

const router = express.Router()

router.post('/signUp',UserController.signUpController)

router.get('/single/:id', UserController.getSingleUserController)
router.delete('/delete/:id',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN), UserController.deleteUserControler)
router.put('/update/:id',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN,RoleEnumType.USER), UserController.updateUserController)
router.post('/signUp',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN),validateRequest(UserValidation.create), UserController.signUpController)
router.post('/signIn', UserController.signInController)
// router.get('/allUsers',UserController.getAllUsersController)

router.get('/allUsers',authCheck(RoleEnumType.ADMIN,RoleEnumType.SUPER_ADMIN),UserController.getAllUsersController)

export const UserRouter = router