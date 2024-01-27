import productModel from '../models/productModel.js'
import fs from 'fs'
export const createProductController= async(req,res)=>{
    try {
        console.log('req.body:', req);
        const {name,slug,description,price,category,quantity,shipping}=req.fields
        const {photo}=req.files
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required',})
            case !description:
                return res.status(500).send({error:'Description is Required',})
            case !price:
                return res.status(500).send({error:'Price is Required',})
            case !category:
                return res.status(500).send({error:'Category is Required',})
            case !quantity:
                return res.status(500).send({error:'Quantity is Required',})
            case photo && photo.size>1*1024*1024:
                return res.status(500).send({error:'Photo is required and should be less than 1 mb',})
        }
        const products= new productModel({name:name,description:description,price:price,category:category,quantity:quantity})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product created successfully',
            products,
        });
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:`Error in creating product ${error}`
        })
    }
};
export const getProductController= async(req,res)=>{
    try {
        
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:`Error in creating product ${error}`
        })
    }
}

//get all products

export const getAllProductsController= async(req,res)=>{
        try {
            const products=await productModel.find({})
            .populate('category')
            .select("-photo")
            .limit(10)
            .sort({createdAt:-1});
            res.status(200).send({
                success:true,
                message:'Product fetched successfully',
                productsCount:products.length,
                products
            })
        } catch (error) {
            res.status(500).send({
                success:false,
                error,
                message:`Error in getting product ${error}`
            })
        }
}

//get photo
export const getProductPhotoController= async(req,res)=>{
    try {
        const product=await productModel.findById(req.params.pid)
        .select("photo");
        if(product.photo.data){
            res.set('content-type',product.photo.contentType)
            res.status(200).send(product.photo.data);
        }else{
            res.status(404).send({
                success:true,
                message:'Image not found',
             })
        }
       
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:`Error in getting product ${error}`
        })
    }
}

    //delete product
        export const deleteProductController= async(req,res)=>{
                try {
                    await productModel.findByIdAndDelete(req.params.pid)
                    .select("photo");
                        res.status(200).send({
                            success:true,
                            message:'Product Deleted Successfully',
                        })
                    
                
                } catch (error) {
                    res.status(500).send({
                        success:false,
                        error,
                        message:`Error while deleting product ${error}`
                    })
                }
        }

        //update product
        export const updateProductController= async(req,res)=>{
            try {
                console.log('req.body:', req);
                const {name,slug,description,price,category,quantity,shipping}=req.fields
                const {photo}=req.files
                switch(true){
                    case !name:
                        return res.status(500).send({error:'Name is Required',})
                    case !description:
                        return res.status(500).send({error:'Description is Required',})
                    case !price:
                        return res.status(500).send({error:'Price is Required',})
                    case !category:
                        return res.status(500).send({error:'Category is Required',})
                    case !quantity:
                        return res.status(500).send({error:'Quantity is Required',})
                    case photo && photo.size>1*1024*1024:
                        return res.status(500).send({error:'Photo is required and should be less than 1 mb',})
                }
                const products = await productModel.findByIdAndUpdate(req.params.pid,
                    {...req.fields},
                    {new:true})
                if(photo){
                    products.photo.data=fs.readFileSync(photo.path)
                    products.photo.contentType=photo.type
                }

                res.status(201).send({
                    success:true,
                    message:'Product updated successfully',
                    products,
                });
            } catch (error) {
                res.status(500).send({
                    success:false,
                    error,
                    message:`Error while updating product ${error}`
                })
            }
        };