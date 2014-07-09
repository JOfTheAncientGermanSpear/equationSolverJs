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

var generator = function(fnMap){
	return function(knownParams){
		return _.extend(knownParams, calculateUnknownParam(fnMap, knownParams));
	};
};

module.exports = {
	generator: generator,
	_calculateUnknownParam: calculateUnknownParam
};
