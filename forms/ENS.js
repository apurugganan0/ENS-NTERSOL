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
//home page
app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
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

app.post('/send_email', function(req, res) {
  // receive and store form data
    
  // basic email
  const templateFlag = req.body.templateFlag;
  const emailTemplate = req.body.templateOp;
  const fromPerson = req.body.fromE;
  const to = req.body.to;
  const ccWhom = req.body.cc || '';
  const bccWhom = req.body.bcc || '';
  const subject = req.body.subject;
  const body = req.body.body;
  const file = req.file;
    
  //for notificatioin
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

    //use handlebars package to insert data to template
    const handlebars = require('handlebars');

    //for fs
    const fs = require('fs');

    //set selected template file name
    if (templateFlag == 'Notification')
    {
        fileName = '/Users/austinfp/Downloads/ENS-NTERSOL-main/forms_test/templates/notifcation/template_notifcation.html';
    }
    else if (templateFlag == 'Newsletter')
    {
        fileName = '/Users/austinfp/Downloads/ENS-NTERSOL-main/forms_test/templates/newsletter/template_news.html';
    }
    else if (templateFlag == 'Request')
    {
        fileName = 'templates/request/template_request.html';
    }
    else
    {
        fileName = '/Users/austinfp/Downloads/ENS-NTERSOL-main/forms_test/templates/template_basic.html';
    }
    
    const templateHTML = fs.readFileSync(fileName, 'utf8');

    //put it all together
    const templateUsed = handlebars.compile(templateHTML);

    //what will go in the template
    //this example uses the ffiields in the template_basic.html template
    const data =
    {
        //for basic
        toWhom: to,
        fromWhome: fromPerson,
        cc: ccWhom,
        bcc: bccWhom,
        bodyText: body,
        
        //for notificatioin
        fname: fname,
        lname: lname,
        appType: appType,
        appID: appID,
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
    }

    //output HTML again
    const outputHTML = templateUsed(data)

    //push it, all done!
    console.log(outputHTML)
    res.send(outputHTML);

});

//listening
app.listen(3000, () => {
  console.log('listening on port 3000...');
});
