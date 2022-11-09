const express= require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");


const app=express();

//all the static materials (images and css files) loaded through public folder
app.use(express.static("public"));

//body-parser that gets the form input variables after post
app.use(bodyParser.urlencoded({extended:true}));



app.post("/",function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;
    console.log(firstname);
    console.log(lastname);
    console.log(email);
    var data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields :{
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }
    const jsonData=JSON.stringify(data);
    const url ="https://us<dc>.api.mailchimp.com/3.0/lists/AUDIENCE_ID";
    const options={
        method :"POST",
        auth: "string:API_KEY"
    }

    const request=https.request(url,options,function(response){
        if (response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res,sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();

});


app.post("/failure",function(req,res){
    res.redirect("/");

})


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});


app.listen(process.env.PORT || 3000,function(){
    console.log("server");
});
