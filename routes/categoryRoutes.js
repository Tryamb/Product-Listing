import express from 'express'
import checkAdminAuth from '../middlewares/admin-auth-middleware.js'
import {categoryController, createCategoryContoller, deleteCategoryController, updateCategoryController}  from '../controllers/categoryController.js'
const router=express.Router()

router.post('/create-category',checkAdminAuth,createCategoryContoller)
router.put('/update-category/:id',checkAdminAuth,updateCategoryController)
router.get('/all-category',categoryController)
router.delete('/delete-category/:id',checkAdminAuth,deleteCategoryController)

export default router