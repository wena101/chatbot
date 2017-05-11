var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors')

var Conversation = require('watson-developer-cloud/conversation/v1');

var app = express()

app.use(cors());
app.use(bodyParser.json());

var conversation = new Conversation({
  username: 'eb0e75c5-d9f2-4c30-81c2-daaa1692ce68',
  password: 'PNuBy1Vc2lrj',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/watson/message', function(req, res) {
  console.log('--------------------------------\nmsg to watson: \n', JSON.stringify(req.body, null, 2));
  var workspace = 'b6a1fd52-dd30-44e8-9741-986521a1cb87';
  
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
		console.log(err);
		return res.status(err.code || 500).json(err);
    }
	console.log('--------------------------------\nmsg from watson: \n', JSON.stringify(data, null, 2));
    return res.json(data);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})