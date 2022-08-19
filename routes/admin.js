// const { result } = require('express');
var express = require('express');
var router = express.Router();
var userhelper=require('../helpers/user-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let admin = req.session.admin
  if (admin) {
    userhelper.getAllUser().then((users)=>{
      res.render('admin/view-user',{admin,users});
      })
  }
  else{
    res.redirect('/login')
  }
 
 
});
router.get('/add-user',function(req,res){
res.render('admin/add-user')
})
router.post('/add-user',(req,res) => {
  
  // console.log(req.body);
  userhelper.addUser(req.body).then((response)=>{
   res.redirect("/admin")
  
})
})
router.get('/delete-user/:id',(req,res)=>{
  let userId=req.params.id
  userhelper.deleteUser(userId).then((response)=>{
    res.redirect("/admin")
  })
})
router.get('/edit-user/:id',async(req,res)=>{
  let user=await userhelper.getUser(req.params.id)
  // console.log(user)
  res.render('admin/edit-user',{user})
})
router.post('/edit-user/:id',(req,res)=>{
  userhelper.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})

module.exports = router;
