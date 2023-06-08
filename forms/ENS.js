//for express
const express = require('express');
const fs = require('fs');

//to parse request body
const app = express();
const bodyParser = require('body-parser');

//mailer
const nodemailer = require('nodemailer');

// middleware for form data parsing
app.use(bodyParser.urlencoded({ extended: true }));

//for css styling
app.use(express.static(__dirname))

//For loading pages
//login page
app.get("/", (req, res) => {
        res.sendFile(__dirname + "/login.html");
});

//home page
app.get("/home", (req, res) => {
        res.sendFile(__dirname + "/home.html");
});

//email form page page
app.get("/email", (req, res) => {
        res.sendFile(__dirname + "/email.html");
});

//logged email view
app.get("/logs", (req, res) => {
        res.sendFile(__dirname + "/logs.html");
});

///////////////

app.post('/login', function(req, res) {
    
    const uid = req.body.uid;
    const pwd = req.body.pwd;
    
    if (uid == 'admin')
        if (pwd == 'pass')
            res.sendFile(__dirname + "/home.html");
    });

app.post('/send_email', function(req, res) {
  // receive and store form data
    
  // basic email
  const templateFlag = req.body.templateFlag;
  const emailTemplate = req.body.templateOp;
  const to = req.body.to;
  const ccWhom = req.body.cc || '';
  const bccWhom = req.body.bcc || '';
  const subject = req.body.subject;
  const body = req.body.body;
  const file = req.file;
    
  //for notification
  const fname = req.body.fname || '';
  const lname = req.body.lname || '';
  const appType = req.body.appType || '';
  const appID = req.body.appID || '';
  const subDate = req.body.subDate || '';
  const appStatus = req.body.appStatus || '';
    
  //for newsletter
  const title = req.body.title || '';
  const subtitle = req.body.subtitle || '';
  const body1 = req.body.body1 || '';
  const body2 = req.body.body2 || '';
  const body3 = req.body.body3 || '';
  const body4 = req.body.body4 || '';
    
  //for request
  //nothing special
    const requestCode = Math.floor(Math.random() * 1000000);
    ourCode = requestCode.toString().padStart(6, '0');
    
    //use handlebars package to insert data to template
    const handlebars = require('handlebars');

    //for fs
    const fs = require('fs');
    
    const now = new Date();
    
    //set selected template file name
    if (templateFlag == 'Noti')
    {
        fileName = __dirname + '/templates/notification/template_notification.html';
        var jsonData = {
            email: {
            to: to,
            cc: ccWhom,
            bcc: bccWhom,
            subject: subject,
            template: templateFlag,
            },
            notification: {
            appID: ourCode,
            submissionDate: subDate,
            appStatus: appStatus,
            }
        }
    }
    else if (templateFlag == 'News')
    {
        fileName = __dirname + '/templates/newsletter/template_news.html';
        var jsonData = {
            email: {
            to: to,
            cc: ccWhom,
            bcc: bccWhom,
            subject: subject,
            template: templateFlag,
            },
            newsletter: {
            title: title,
            subtitle: subtitle,
            }
        }
    }
    else if (templateFlag == 'Req')
    {
        fileName = __dirname + '/templates/request/template_request.html';
        var jsonData = {
            email: {
            to: to,
            cc: ccWhom,
            bcc: bccWhom,
            subject: subject,
            template: emailTemplate,
            },
        }
    }
    else if  (templateFlag == 'Basic')
    {
        fileName = __dirname + '/templates/template_basic.html';
        var jsonData = {
            email: {
            to: to,
            cc: ccWhom,
            bcc: bccWhom,
            subject: subject,
            template: emailTemplate,
            },
        }
    }
    
    ////write to JSON
    const dataToJson = JSON.stringify(jsonData, null, 2);

    // Write data to 'outputJson.txt' .
    fs.writeFile('outputJson.JSON', dataToJson, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(dataToJson);
      }
    });
    //// END write to JSON
    
    const templateHTML = fs.readFileSync(fileName, 'utf8');

    //put it all together and load template
    const templateUsed = handlebars.compile(templateHTML);

    //what will go in the template
    //this example uses the ffiields in the template_basic.html template
    const data =
    {
        //for basic
        toWhom: to,
        cc: ccWhom,
        bcc: bccWhom,
        bodyText: body,
        
        //for notification
        fname: fname,
        lname: lname,
        appType: appType,
        appID: ourCode,
        subDate: subDate,
        appStatus: appStatus,
        
        //for newsletter
        profile: 'https://images.fineartamerica.com/images-medium-large-5/6-snowflake-kenneth-libbrechtscience-photo-library.jpg',
        title: title,
        subTitle: subtitle,
        bodyText: body,
        bodyText1: body1,
        bodyText2: body2,
        bodyText3: body3,
        bodyText4: body4,
        
        //for request
        randomCode: ourCode,
    }

    //output HTML again
    const outputHTML = templateUsed(data)
    
    //for sending email
    
    // instantiate nodemailer
     let transporter = nodemailer.createTransport({
       host: 'smtp-relay.sendinblue.com',
       port: 587,
       auth:
       {
         user: '',
         pass: ''
       }
     });

    // set email options
    let mailOptions = {
      from: 'awagyusteak@gmail.com',
      to: to,
      cc: ccWhom,
      bcc: bccWhom,
      subject: subject,
      text: body,
      html: outputHTML // replace with outputHTML
    };

    // send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.sendFile(__dirname + "/email_sent/failed.html");
        console.log(error);
      } else {
        res.sendFile(__dirname + "/email_sent/confirmation.html");
        console.log('Email sent: ' + info.response);
      }
    });
    
    ////////END SENDING EMAIL/////////

    //push it, all done!
});



//listening
app.listen(3000, () => {
  console.log('listening on port 3000...');
});
