import mongoose from 'mongoose'

const connectDB=async (DATABASE_URL)=>{
    try{
        const DB_OPTIONS={
            dbName:"grocery"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log('Connected Successfully')
    }
    catch(error){
        console.log(`error:${error}`)
    }
}
export default connectDB