var assert = require('assert');

var equation = require('../src/equationSolver.js');

describe('Equation', function(){
    describe('calculate unknown param', function(){
        it('should return the function to calculate the unknown param', function(){
            var fnMap = {
                a: function(params){
                    return params.b * 2;
                },
                b: function(params) {
                    return params.a * 3;
                }
            };
            var params = {
                b: 3
            };
            var expected = 6;
            var result = equation._calculateUnknownParam(fnMap, params);
            assert.equal(expected, result.a);
        })
    });
	describe('equation generator', function(){
		it('should generate density calculator that calculates missing param', function(){
			var fnMap = {
				d: function(params) { return params.m / params.v; },
				m: function(params) { return params.v * params.d; },
				v: function(params) { return params.m / params.d; }
			};
			var density = equation.generator(fnMap, "d = m/v");
			assert.equal(density({m: 10, v: 2})['d'], 5);
			assert.equal(density("describe"),"d = m/v");
		})
	});
});
