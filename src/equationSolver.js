var _ = require("underscore");

var calculateUnknownParam = function(fnMap, params){
    function curryKnownParams(fn){
        return _.partial(fn, params);
    }

    var unknownParam = _.chain(fnMap).
        keys().
        difference(_.keys(params)).
        first().
        value();

    var res = {};
    res[unknownParam] = curryKnownParams(fnMap[unknownParam])();
    
    return res;
};

var always = function(paramToSolve, fn){
	return function(knownParams) {
		if(knownParams) {
			knownParams = _.omit(knownParams, paramToSolve);
		}
		return fn(knownParams);
	}
};

var copyInput = function(paramMap, fn){
	var paramToCopy = _.chain(paramMap).keys().first().value();
	var newParam = paramMap[paramToCopy];

	return function(knownParams) {
		if(! _.isEmpty(knownParams)) {
			knownParams = _.clone(knownParams);
			knownParams[newParam] = knownParams[paramToCopy]; 
		}
		if(fn) return fn(knownParams);
		else return knownParams;
	}
};

var combine = function(){
	var functions = _.toArray(arguments);
	return _.compose.apply(null, functions.reverse());
};

var generator = function(fnMap, description){
	return function(knownParams){
		if(knownParams == undefined) return description;
		else return _.extend(knownParams, calculateUnknownParam(fnMap, knownParams));
	};
};

module.exports = {
	generator: generator,
	always: always,
	copyInput: copyInput,
	combine: combine,
	_calculateUnknownParam: calculateUnknownParam
};
