const mongoose= require('mongoose')

const staffSchema = new mongoose.Schema({
    staff_id:{type:String,required:true},
    staff_name:{type:String,required:true},
    department:{type:String,required:true},
    designation:{type:String,required:true},
    category:{type:String,required:true},
    phone_no:{type:Number,required:true,unique:true},
    email:{type:String,required:true},
    college:{type:String,required:true},
    bank_acc_no:{type:String,required:true,unique:true},
    ifsc_code:{type:String,required:true},
    employment_type:{type:String,required:true},
    bank_name:{type:String,required:true},
    branch_name:{type:String,required:true},
    branch_code:{type:String,required:true}
})

const Staff = mongoose.model('staff_manage',staffSchema)

module.exports = Staff




