const { response } = require('express');
var express = require('express');
var router = express.Router();
var userhelper=require('../helpers/user-helpers')
const admin={
  name:"admin",
  password:"admin",
  email:'admin@gmail.com'
}
let products=[
    {
    name:"Samsung Galaxy S22 Ultra ",
    productDetail:" 12GB |512GB |17.31cm (6.8) Burgundy | Infinity-O Displays",
    price:"₹1,18,999",
    image:"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTZR4WDLfRUIW3WC9sHPO4MiHBObcYH4vz3TrjLM1k6y17loXvXtZWFCUNAf6Bz5Cdl6Ihdzhf_LQ&usqp=CAc"
  },
  {
    name:"Apple iPhone 13 Pro Max",
    productDetail:" 6GB |128GB |17cm (6.7)Super Retina XDR display ",
    price:"₹1,18,999",
    image:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS3QQ80mjvBYbWGldr7a2969_pT9__77c7ih-IbwBmEfuDV7I9vQcauoj6BaoDUZ84b9tb36T9klg&usqp=CAc"
  },
  {
    name:"Google Pixel 6 Pro 5G ",
    productDetail:" 12GB |128GB |17cm (6.7) AMOLED display",
    price:"₹67,900", 
    image:"https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT1pIhg5TLajckwUqoxlz3ggP1QDesOs-q_uRTekEwqk0CqRf4xB3GBCp2Qm-HXypWFWlVcxuhC-FA&usqp=CAc"
  },
  {
    name:"iQOO 9 Pro 5G ",
    productDetail:" 12GB |256GB |17cm (6.78) Burgundy | Intelligent Display Chip",
    price:"₹69,990",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmi7TbKr2Oy7ab0NZb_dLzRN6obScMgzBpTg&usqp=CAU"
  },
]
/* GET home page. */
router.get('/', function(req, res, next) {


  
  let user=req.session.user
  // console.log(user)

  res.render('index', {products,user })


});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    
    res.render('user/login',{"loginErr":req.session.userLoginErr})
    req.session.userLoginErr=false
  }
  
})
router.get('/signup',(req,res)=>{
  if(req.session.loggedIn)
  {

    res.redirect('/')
  }else{
    res.render('user/signup')
    
  }
})
router.post('/signup',(req,res)=>{
  userhelper.doSignup(req.body).then((response)=>{
    // console.log(response)
    if(!response)  {
      signup_msg='Account or UserName already exists'
      // res.render('signup',{signup_errmsg})
      res.redirect('user/signup')
     }
     else {
      signup_msg="Now login with your Account"
      console.log("server expected false res" +response)
      res.render('user/login')
    // res.redirect('/')
    }
  })
  req.session.loggedIn=true
  req.session.user=req.body
  // res.redirect('/')
  res.render('user/login')
})
router.post('/login',(req,res)=>{
  userhelper.doLogin(req.body).then((response)=>{
    console.log(response);
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      
      res.redirect('/')
    } else if(response.user=="admin"){
        console.log("And the admin crossed the line!!")
        req.session.admin=true;
        
        res.redirect('/admin')
      }
    else
    {
      req.session.userLoginErr="invalid user name or password"
      res.redirect('/login')
    }
  })
  // console.log(req.body)
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  // req.session.admin.destroy()
  res.redirect('/')
})

module.exports = router;