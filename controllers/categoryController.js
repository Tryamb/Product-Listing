import categoryModel from '../models/categoryModel.js'
export const createCategoryContoller= async(req,res)=>{
    try {
       const {name}=req.body
       if(!name){
        return res.status(500).send({message:'Name is required' })
       } 
       const existingCategory=await categoryModel.findOne({name})
       if(existingCategory){
        return res.status(200).send({success:false, message:'Category Already exists'})
       }
       
       const category=await new categoryModel({name}).save()
       res.status(201).send({
        success:true, 
        message:'New Category Created',
        category,
    });
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:'Error in category'
        })
    }
}

export const updateCategoryController= async(req,res)=>{
    try {
       const {name}=req.body
       const {id}=req.params
       const existingCategory=await categoryModel.findOne({name})
       if(existingCategory){
        return res.status(200).send({success:false, message:'Category Already exists'})
       }
       const category=await categoryModel.findByIdAndUpdate(
        id,{name},
        {new:true}
        );
       
       res.status(201).send({
        success:true, 
        message:'New Category Created',
        category,
    });
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:`Error while updating category ${error}`
        })
    }
}
export const categoryController= async(req,res)=>{
   try {
    const category=await categoryModel.find({})
    return res.status(200).send({
        success:true, 
        message:'All Categories:',
        category
    }
    );

   } catch (error) {
    res.status(500).send({
        success:false,
        error,
        message:`Error while getting all categories ${error}`
    })
   }
}

export const deleteCategoryController= async(req,res)=>{
    try {
        const {id}=req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true, 
            message:'Category deleted successfully',
        }); 
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:`Error while deleting category ${error}`
        })
    }
}

