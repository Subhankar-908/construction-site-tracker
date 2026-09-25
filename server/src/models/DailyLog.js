import mongoose from "mongoose";

const schema=new mongoose.Schema({
  project:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true},
  date:{type:Date,required:true},
  supervisor:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  manpower:{
    total:{type:Number,default:0,min:0},
    skilled:{type:Number,default:0,min:0},
    unskilled:{type:Number,default:0,min:0}
  },
  workCompleted:[{description:String,progress:{type:Number,min:0,max:100}}],
  overallProgress:{type:Number,min:0,max:100,default:0},
  delay:{hasDelay:{type:Boolean,default:false},reason:String,hours:{type:Number,default:0,min:0}},
  issues:[String],
  photos:[{url:String,publicId:String}],
  status:{type:String,enum:["DRAFT","SUBMITTED","APPROVED","REJECTED"],default:"DRAFT"},
  managerComment:String,
  submittedAt:Date,
  reviewedAt:Date
},{timestamps:true});

export default mongoose.model("DailyLog",schema);
