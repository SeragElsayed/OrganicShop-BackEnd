const { Router } = require('express');
const orderRouter = Router();
const orderModel = require("../models/OrderModel");
const userModel = require("../models/userModel");
const mongoose=require("mongoose")
const isAdmin = require('../middlewares/isAdmin')
const authMiddelware=require('../middlewares/authentication')
// const isUser = require('../middlewares/isUser')
// const bcrypt = require("bcryptjs");
// const util = require('util');
// const hashPassword = util.promisify(bcrypt.hash);
// const compareHashPassword = util.promisify(bcrypt.compare);
// const saltRounds = 7;
// const { verify, sign} = require('../helpers/tokenHelper');
// const authMiddelware = require('../middlewares/authorization')
// orderRouter.use("/",isAdmin);

orderRouter.use(authMiddelware);

orderRouter.post("/Create/:userId",async (req, res, next) => {
        try {
            let order=req.body.order
            order.userId=req.user._id;

            let orderAsModel = new orderModel(order)
            console.log("orderRouter::",orderAsModel,order.userId)
            const orderDbInstace=await orderAsModel.save()
            req.user.Orders.push(orderDbInstace._id)
            // delete req.user.__v
            const updatedUser=await userModel.findByIdAndUpdate({_id:req.user._id},req.user)
            // const updatedUser=await req.user
            console.log(orderDbInstace,updatedUser)
            res.status(200).json(orderDbInstace)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    
    })
    
    // orderRouter.delete("/order/:userId",orderRouter.user.delete)
orderRouter.delete("/Delete/:userId/:orderId",async (req, res, next) => {
        try {
            const {orderId,userId} = req.params
            console.log(orderId,"ccc")
            const orderDbInstance = await orderModel.findOneAndRemove({_id:orderId,status:"Pending"},{useFindAndModify:false})
            res.status(200).json(orderDbInstance)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    })
    
    

    // orderRouter.use('/',isAdminMiddelware)
    
    // orderRouter.patch("/order/admin/:userId",orderRouter.admin.patch)
orderRouter.patch("/admin/Update/:userId/:orderId/:status",isAdmin,async (req, res, next) => {
        try {
            
            const {orderId,status} = req.params
            
            const orderDbInstance = await orderModel.findOneAndUpdate({_id:orderId,status:'Pending'},{$set:{status:status}},{new:true,runValidators:true,setDefaultsOnInsert:true,useFindAndModify:false})
            res.status(200).json(orderDbInstance)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    })
    
    
    // orderRouter.get("/order/admin/:userId/allorders",orderRouter.admin.get)
orderRouter.get("/admin/allorders/:userId",isAdmin,async (req, res, next) => {
        try {
            const orderDbInstance = await orderModel.find({$or:[{status:'Pending'},{status:'Accepted'}]})//.find()
            //  const orderDbInstace=req.user.Orders;
            res.status(200).json(orderDbInstance)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    })
    orderRouter.get("/orders/:userId",async (req, res, next) => {
        try {
            console.log(req.user._id,JSON.stringify(req.user._id))
            // const orderDbInstance = await orderModel.find()//.findMany({$or:[{_id:userId,status:'Pending'},{_id:userId,status:'Accepted'}]})
            // const uuserId=req.user._id
            const orderDbInstace=await orderModel.find({'userId':req.user._id}) //req.user.Orders;
            res.status(200).json(orderDbInstace)
        } catch (err) {
            console.log(err)
            res.status(400).json(err)
        }
    })    
    
module.exports=orderRouter
// module.exports={
//     user:{
//         create:orderRouter.post("/Create", async (req, res, next) => {
//             try {
//                 const allProducts=await orderModel.find()
//                 console.log("fffffffffffff")
//                 res.status(200).json(allProducts)
//             } catch (err) {
//                 console.log(err)
//                 res.status(400).json(err)
//             }

//         }),

//         delete:orderRouter.delete("/Delete/:orderId", async (req, res, next) => {
//             try {
//                 const {orderId} = req.params
//                 const orderDbInstance = await orderModel.findByIdAndRemove({id:orderId,status:"Pending"})
//                 res.status(200).json(orderDbInstance)
//             } catch (err) {
//                 console.log(err)
//                 res.status(400).json(err)
//             }
//         }),
//     },

//     admin:{
//         patch:orderRouter.patch("/Update/:orderId/:status", async (req, res, next) => {
//             try {
//                 const {orderId,status} = req.params
                
//                 const orderDbInstance = await orderModel.findByIdAndUpdate(orderId,status,{upsert:true},{new:true},{runValidators:true},{setDefaultsOnInsert:true})
//                 res.status(200).json(orderDbInstance)
//             } catch (err) {
//                 console.log(err)
//                 res.status(400).json(err)
//             }
//         }),
//         get:orderRouter.get("/", async (req, res, next) => {
//             try {
//                 const orderDbInstance = await orderModel.find()
//                 res.status(200).json(orderDbInstance)
//             } catch (err) {
//                 console.log(err)
//                 res.status(400).json(err)
//             }
//         })

        
//     }
// }
