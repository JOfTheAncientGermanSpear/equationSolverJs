#Equation Solver JS

##How it Works

Calculates the missing param of an equation

	var q = {m: 6, v: 2};
	density(q) // returns {m: 6, v:2, d: 3}
	var q = {m: 6, d: 3};
	density(q) // returns {m: 6, d:3, v: 2}
	
In case you forget the inputs...

	density() // returns "d = m/v"

##Objective

There were many situations while doing homework in the physical sciences that I used the same equation, just solved it for different parameters  

This was developed for two reasons

1. To facilitate getting homework done by addressing the above described issue
2. To become more proficient at functional programming in JavaScript

##Getting Started

Lets prepare for `f = m*a` Physics problems

	var eqSolver = require('equationSolver');
	var generator = eqSolver.generator;
	
	var fnMap = {
		f: function(q){ return q.m * q.a },
		m: function(q){ return q.f / q.a },
		a: function(q){ return q.f/ q.m }
	};
	
	var description = "f = m * a";
	
	//returns a function that solves for a missing param
	var firstLaw = generator(fnMap, description);
	
	var q = {m: 5, a: 10};
	firstLaw(q); //{m: 5, a: 10, f: 50}
	
	var q = {m: 3, f: 30};
	firstLaw(q); // {m: 3, f: 30, a: 10}
	
	//I forgot what the firstLaw inputs were, let me check
	firstLaw() //"f = m * a"

###Installation
	npm install -g git://github.com/JOfTheAncientGermanSpear/equationSolverJs.git
	
or add to the dependencies section of the package.json file

	"dependencies": { 
		"equationSolver": "git://github.com/JOfTheAncientGermanSpear/equationSolverJs.git"
		...

##Advanced Usage

###Sequencing Equations  
Let's say we are given an object's volume and density, now we need to find out how much it weighs. This requires a sequence of steps.

1. We calculate the mass from the volume and density
2. We calculate the weight from the mass

The `sequence` function will accept an input of functions and combines them into one function that will invoke each of the input functions sequentially.

````
	var eqnSolver = require('equationSolver');
	var generator = eqnSolver.generator;
	var sequence = eqnSolver.sequence;

	var densFnMap = {
		d: function(q){return q.m/q.v},
		m: function(q){return q.d * q.v},
		v: function(q){return q.m/q.d }
	};
	
	var G = 10;
	
	var weightFnMap = {
		w: function(q){return q.m * G},
		m: function(q){return q.w/G}
	};
	
	var density = generator(densFnMap, "d = m/v");
	var weight = generator(weightFnMap, "w = m * G");
	
	var solveProblem = sequence(density, weight);
	
	//will return {v: 4, d:2, m: 8, w: 80}
	solveProblem({v: 4, d: 2});
````
_Note:_ `sequence(b, a)(x) != b(a(x))` instead:  `sequence(b, a)(x) == a(b(x))`

###Copying Inputs to New Names
Sometimes we wish to use the output of one equation for the input of another equation. However, the parameter names may not match.
For example:

````
	conservationMomentum(); //returns "m1 * v1 = m2 * v2"
	weight(); //returns "w = m * G"
````

What if we want to feed m1 into the m param of weight? `copyInput` to the rescue. It returns a function that will copy the input into a new field

````
	var copyInput = eqnSolver.copyInput;
	
	q = {v1: 3, m2: 5, v2: 6};
	var solveProblem = sequence(conservationMomentum, copyInput({m1: "m"}),  weight);
	
	solveProblem(q); //{v1:3, m2: 5, v2: 6, m1: 10, m: 10, w: 100}
	
````

`copyInput` can also accept a function as the second argument. It will return a function that copies the input, then invokes the passed in function

````
	var copyThenWeight = copyInput({m1: "m"}, weight);
	var solveProblem = sequence(conservationMomentum, copyThenWeight);
	
	solveProblem(q); //{v1:3, m2: 5, v2: 6, m1: 10, m: 10, w: 100}
````

###Always
Sometimes you want to solve the equation for a particular parameter, even if the parameter is already defined.

````
	var always = eqnSolver.always;
	
	var alwaysMass = always("m", density);
	
	var q = {m: 4, d: 10, v: 4};
	
	alwaysMass(q);//{m:40, d: 10, v: 4}
````

###Underline
Methods with underlines in the beginning of the name, such as `_calculateUnknownParam`, are used internally. They are exposed for testing.

##References
Library heavily influenced by:

1. [Functional Programming in Javascript](http://www.amazon.com/Functional-JavaScript-Introducing-Programming-Underscore-js/dp/1449360726)
2. [Underscore.js](http://underscorejs.org)