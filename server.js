var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/quoting_dojo_crud');

var QuoteSchema = new mongoose.Schema({
	name: String,
	quote: String,
	date: Date
});

mongoose.model('Quote', QuoteSchema);

var Quote = mongoose.model('Quote');

app.use(express.static(__dirname+'/static'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


app.get('/', function(req, res){
	res.render('index');
});

app.get('/quotes', function(req, res){
	Quote.find({}, function (err, quotes){
		if (err){
			console.log(err);
		}else{
			res.render('quotes', {quotes: quotes});
		}
	})
});

app.post('/quotes', function(req, res){
	var date = new Date();
	var quote = new Quote({name: req.body.name, quote: req.body.quote, date: date.toString()});
	quote.save(function(err){
		if (err){
			console.log(err);
		}else{
			console.log('quote saved');
			res.redirect('/quotes');
		}
	});
});

app.get('/quotes/:id', function(req, res){
	Quote.findOne({_id: req.params.id}, function (err, quote){
		if (err){
			console.log(err);
		}else{
			res.render('show', {quote: quote});
		}
	});
});

app.get('/quotes/:id/edit', function(req, res){
	Quote.findOne({_id: req.params.id}, function (err, quote){
		if (err){
			console.log(err);
		}else{
			res.render('edit', {quote: quote});
		}
	});
});

app.post('/quotes/:id', function(req, res){
	Quote.findOneAndUpdate({_id: req.params.id}, {quote: req.body.quote}, function (err, quote){
		if (err){
			console.log(err);
		}else{
			res.redirect('/quotes/'+req.params.id);
		}
	});
});

app.get('/quotes/:id/destroy', function (req, res){
	Quote.findOneAndRemove({_id: req.params.id}, function(err){
		if (err){
			console.log(err);
		}else{
			res.redirect('/quotes');
		}
	});
});

var server = app.listen(6789);