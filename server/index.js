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
  username: 'c58a6724-aa66-4b9c-8504-ec079fa656af',
  password: 'pib67rqkfMDP',
  url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2016-10-21',
  version: 'v1'
});
var data = JSON.parse(fs.readFileSync('../data.json', 'utf8'));

var items = [];
function flatten(prop, propertyName)
{
	if(prop.isLeaf == false)
	{
		for(var propName in prop.items) {
			flatten(prop.items[propName], propName);
		}
	}
	else {
		//console.log('added ' + propertyName);
		items[propertyName] = prop;
	}
}
flatten(data, 'data');


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

app.get('/items/:item', function (req, res) {
	makeJson(res);
	
	if(items[req.params.item] != null)
	{
		console.log(JSON.stringify(items[req.params.item], null, spaces));
		let payload = JSON.stringify(items[req.params.item], null, spaces);
		return res.send(payload);
	}
	else {
		console.log('error: undefined item ' + req.params.item);
		return res.status(404).send({ error : "item does not exists" } );
	}
})

app.get('/data/', function (req, res) {
	console.log(JSON.stringify(data.items, ignoreItems, spaces));
	
	let payload = JSON.stringify(data.items, ignoreItems, spaces);
	makeJson(res);

	return res.send(payload);
})

app.get('/data/:subcathegory', function (req, res) {
	makeJson(res);
	let prop = getProperty(data.items, [ req.params.subcathegory, "items" ] );
	if(prop == null) return res.status(404).send({ error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, ignoreItems, spaces));
		return res.send(JSON.stringify(prop, ignoreItems, spaces));
	}
})

app.get('/data/:subcathegory/:itemlist', function (req, res) {
	makeJson(res);
	let prop = getProperty(data.items, [ req.params.subcathegory, "items" , req.params.itemlist, "items"] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, ignoreItems, spaces));
		return res.send(JSON.stringify(prop, ignoreItems, spaces));
	}
})

app.get('/data/:subcathegory/:subsubcathegory/:item', function (req, res) {
	makeJson(res);
	let prop = getProperty(data.items, [ req.params.subcathegory, "items" , req.params.subsubcathegory, "items" , req.params.item] );
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
	let prop = getProperty(data.items, [ req.params.subcathegory, "items" , req.params.subsubcathegory, "items" , req.params.itemlist, "items", req.params.item] );
	if(prop == null) return res.send(404, { error : "item does not exists" } );
	else {
		console.log(JSON.stringify(prop, null, spaces));
		return res.send(JSON.stringify(prop, null, spaces));
	}
})

app.post('/watson/message', function(req, res) {
  console.log('--------------------------------\nmsg to watson: \n', JSON.stringify(req.body, null, 2));
  var workspace = '70fd87a9-5970-4f3c-be3c-8b5fbb49d086';
  
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
