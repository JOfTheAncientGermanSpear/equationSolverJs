##Equation Solver JS

###How it Works

Calculates the missing param of an equation

	var q = {m: 6, v: 2};
	density(q) // returns {m: 6, v:2, d: 3}
	var q = {m: 6, d: 3};
	density(q) // returns {m: 6, d:3, v: 2}
	
In case you forget the inputs...

	density() // returns "d = m/v"

###Objective

There were many situations while doing homework in the physical sciences that I used the same equation, just solved it for different parameters  

This was developed for two reasons

1. To facilitate getting homework done by addressing the above described issue
2. To become more proficient at functional programming in JavaScript

###Simple Tutorial

Lets prepare for `f = m*a` Physics problems

	var eqSolver = require('equationSolver');
	
	var fnMap = {
		f: function(q){ return q.m * q.a },
		m: function(q){ return q.f / q.a },
		a: function(q){ return q.f/ q.m }
	};
	
	var description = "f = m * a";
	
	//returns a function that solves for a missing param
	var firstLaw = eqSolver(fnMap, description);
	
	var q = {m: 5, a: 10};
	firstLaw(q); //{m: 5, a: 10, f: 50}
	
	var q = {m: 3, f: 30};
	firstLaw(q); // {m: 3, f: 30, a: 10}
	
	//I forgot what the firstLaw inputs were, let me check
	firstLaw() //"f = m * a"

###Installation
	npm install 
