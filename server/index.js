var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
const util = require('util');
var fs = require('fs');

var Conversation = require('watson-developer-cloud/conversation/v1');

var app = express()

app.use(cors());
app.use(bodyParser.json());
const spaces = 2;

var conversation = new Conversation({
  username: 'eb0e75c5-d9f2-4c30-81c2-daaa1692ce68',
  password: 'PNuBy1Vc2lrj',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});
var data = JSON.parse(fs.readFileSync('../data.json', 'utf8'));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

function ignoreItems(key, value)
{
    if (key=="items") return undefined;
    else return value;
}

function makeJson(res)
{
    res.charset = res.charset || 'utf-8';
	res.get('Content-Type') || res.set('Content-Type', 'application/json');
}

function getProperty(base, path)
{
	let prop = base;
	path.every( propName => {
		if(prop.hasOwnProperty(propName)){
			prop = prop[propName];
			return true;
		}
		prop = null; 
		return false;
	})
	return prop;
}

app.get('/data/', function (req, res) {
	console.log(JSON.stringify(data, ignoreItems, spaces));
	
	let payload = JSON.stringify(data, ignoreItems, spaces);
	makeJson(res);

	return res.send(payload);
})

app.get('/data/:subcathegory', function (req, res) {
	makeJson(res);
	let prop = getProperty(data, [ req.params.subcathegory, "items" ] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, ignoreItems, spaces));
		return res.send(JSON.stringify(prop, ignoreItems, spaces));
	}
})

app.get('/data/:subcathegory/:itemlist', function (req, res) {
	makeJson(res);
	let prop = getProperty(data, [ req.params.subcathegory, "items" , req.params.itemlist, "items"] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, ignoreItems, spaces));
		return res.send(JSON.stringify(prop, ignoreItems, spaces));
	}
})

app.get('/data/:subcathegory/:subsubcathegory/:item', function (req, res) {
	makeJson(res);
	let prop = getProperty(data, [ req.params.subcathegory, "items" , req.params.subsubcathegory, "items" , req.params.item] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else if (prop.isLeaf === true){
		console.log(JSON.stringify(prop, null, spaces));
		return res.send(JSON.stringify(prop, null, spaces));
	}
	else {
		console.log(JSON.stringify(prop.items, ignoreItems, spaces));
		return res.send(JSON.stringify(prop.items, ignoreItems, spaces));
	}
})

app.get('/data/:subcathegory/:subsubcathegory/:itemlist/:item', function (req, res) {
	makeJson(res);
	let prop = getProperty(data, [ req.params.subcathegory, "items" , req.params.subsubcathegory, "items" , req.params.itemlist, "items", req.params.item] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, null, spaces));
		return res.send(JSON.stringify(prop, null, spaces));
	}
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