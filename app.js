const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// express.static: pull up files in out local file system. eg: sigin.css, images... in the folder names "public".
app.use(express.static("public"));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})


app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  // transfer javascript object to json string
  const jsonData = JSON.stringify(data);

  // API: endpoint + list ID
  const url = "https://us17.api.mailchimp.com/3.0/lists/ea64553a43"

  const options = {
    method: "POST",
    auth: "Beryl:f53af48fab0345571fb2fe8cc56d189b-us17" // username: api key
  }

  // post data to other servers using API
  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

})

// If failure, redirect user to the home page
app.post("/failure", function(req, res){
  res.redirect("/");
})

// process.env.PORT: allow heroku to choose a port for us
// ||: both on heroku and local host
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
})
