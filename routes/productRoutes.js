import express from 'express'
import { createProductController, deleteProductController, getAllProductsController, getProductPhotoController, updateProductController } from '../controllers/productController.js'
import checkAdminAuth from '../middlewares/admin-auth-middleware.js'
import ExpressFormidable from 'express-formidable'

const router=express.Router()

//protected
router.post('/create-product',checkAdminAuth, ExpressFormidable(),createProductController)
router.get('/get-products',getAllProductsController)
router.get('/get-product-image/:pid',getProductPhotoController)
router.post('/delete-product/:pid',deleteProductController)
router.post('/update-product/:pid',ExpressFormidable(),updateProductController)



export default router