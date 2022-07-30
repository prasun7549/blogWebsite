const express=require('express');
const bodyPraser=require('body-parser');
const ejs=require('ejs');
const _=require('lodash');

 const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog');




const app=express();
app.set('view engine', 'ejs');
app.use(bodyPraser.urlencoded({extended: true}));
app.use(express.static("public"));

const blogSchema=mongoose.Schema({
    heading:String,
    content:String
    
});

const Post=mongoose.model('Post',blogSchema);



const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const homeStartingContent=new Post({
    heading:"homeStartingContent",
    content:"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

app.get('/',(req,res)=>{
   Post.find({},function(err,foundItem){
       if(err){
           console.log(err);
       }else{
           if(Post.length===0)
           {
              homeStartingContent.save();
           }
           res.render('home',{posts:foundItem});
       }
   })

   
});

app.get('/about',(req,res)=>{
    res.render('about',{ aboutContent : aboutContent});
});

app.get('/contact',(req,res)=>{
    res.render('contact',{contactContent:contactContent})
});

app.get('/compose',(req,res)=>{
    res.render('compose');
});

// app.get('/posts/:topic',(req,res)=>{
    
//     const customPostName=req.params.topic;
//     Post.findOne({heading:customPostName},function(err,foundPost){
//         if(err)
//         {
//             console.log(err);
//         }else{
//             if(foundPost)
//             res.render('post',{post:foundPost});
//         }
//     })
    
// });

app.get('/posts/:topic',(req,res)=>{
    const customPostName=_.lowerCase(req.params.topic);
    Post.find({},function(err,posts){
        posts.forEach(function(post){
            const storedPostName=_.lowerCase(post.heading);
            if(customPostName===storedPostName)
            {
                res.render('post',{post:post});
            }
        });
    });
    
});


app.post('/compose',(req,res)=>{
    var newPost=new Post({
        heading:req.body.postTitle,
        content:req.body.content
    });
    newPost.save();
    res.redirect('/');
});

app.post('/delete',(req,res)=>{
    const id=req.body.id;
    Post.findByIdAndRemove(id,function(err){
        if(err)
        {
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});