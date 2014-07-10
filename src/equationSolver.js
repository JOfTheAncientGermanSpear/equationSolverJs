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
		if(knownParams == undefined) return fn(knownParams);
		else {
			var knownParams = _.omit(knownParams, paramToSolve);
			return fn(knownParams);
		}
	}
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
	_calculateUnknownParam: calculateUnknownParam
};
