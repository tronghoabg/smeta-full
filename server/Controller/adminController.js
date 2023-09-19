const userModal = require('../Modal/userModal')
const acctionModal = require('../Modal/acctionModal')
const adminController ={
    getallUser :async (req,res)=>{
        try {
            const data = await userModal.find()
            res.status(200).json({message:'sucsess',data})
        } catch (error) {
            res.status(500).json({message:'lỗi server'})
        }
    },
    getallAction : async (req,res)=>{
        try {
            const data = await acctionModal.find()
            res.status(200).json({message:'sucsess',data})
        } catch (error) {
            res.status(500).json({message:'lỗi server'})
        }
    }
}


module.exports = adminController