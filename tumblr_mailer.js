var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');
var client = tumblr.createClient({
  consumer_key: 'UOjdkZjr1acVxnAE2SdOkbCYKWUjyFcgCSGEIl26yh6tI8Mlej',
  consumer_secret: 'LL7R3jfWsypykjQuNMNAnYOK47ETljNr2eDmzYCWbJGryIzmqg',
  token: '0nYlHFeP1aK0wiEPvMS17fY38rIl8wAUqdgxnazHpxgUhxGTfJ',
  token_secret: 'eFKjhTohBKzchTqSyMIrPtJWdQigFCTPzMmdFbIaqzp2jwAxz8'
});

var mandrill_client = new mandrill.Mandrill('aK2muFh1RFi5vIh6jjO6sg');

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

function csvParse(file) {
	var lines = file.split('\n');					//array of lines
	var keys = lines[0].split(',');					//0th line becomes names of keys
	var parsedArr = [];
	for (var i = 1; i < lines.length; i++) {
		if(lines[i].length > 1) {
			var elements = lines[i].split(',');		//get an array of values
			var person = {};
			for (var j = 0; j < keys.length; j++) {
				person[keys[j]] = elements[j];		//populate the object
			}
			parsedArr.push(person);					//put the object in the returned array
		}
	}
	return parsedArr;
}

//template_file_name is the name of the template w/o .html
function customizeEmail(person, emailTemplate, latestPosts) {
	var templateCopy = emailTemplate;
	var customizedTemplate = ejs.render(emailTemplate,
		{ firstName: person.firstName,
	  	  numMonthsSinceContact: person.numMonthsSinceContact,
	  	  latestPosts: latestPosts
		});
	
	return customizedTemplate;
}

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

//retrieves tumblr json
client.posts('hexandthecity015.tumblr.com', function(err, blog){
  	var seconds = (Date.parse(new Date()))/1000;
  	var latestPosts = [];
  	//puts posts into output if posted within 7 days
  	for (var i = 0; i < blog.posts.length; i++) {
		if (seconds - blog.posts[i].timestamp <= 7*24*3600) {
			latestPosts.push(blog.posts[i]);
		}
	}
	var contactList = csvParse(csvFile);
	for(var i = 0; i < contactList.length; i++) {
		var person = contactList[i];
		var to_name = person.firstName + ' ' + person.lastName;
		var to_email_address = person.emailAddress;
		var subject = 'My recent tumblr posts';
		var message_html = customizeEmail(person, emailTemplate, latestPosts);
		//send the email
		sendEmail(to_name, to_email_address, 'Mike Ingber', 'mbingber@gmail.com', subject, message_html);
	}
});
