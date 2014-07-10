var assert = require('assert');

var _ = require('underscore');

var equation = require('../src/equationSolver.js');

function simpleDensity(){
	var fnMap = {
		d: function(params) { return params.m / params.v; },
		m: function(params) { return params.v * params.d; },
		v: function(params) { return params.m / params.d; }
	};
	return equation.generator(fnMap, "d = m/v");
};

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
			var density = simpleDensity();
			assert.equal(density({m: 10, v: 2})['d'], 5);
			assert.equal(density(),"d = m/v");
		})
	});
	describe('always', function(){
		it('should always calculate specified param', function(){
			var q = {m: 10, d:20, v: 2};
			var expected = _.extend(q, {v: .5});

			var density = simpleDensity();
			var alwaysV = equation.always("v", density);
			var actual = alwaysV({m: 10, d:20, v: 2});

			assert.deepEqual(expected, actual);
		});
		it('should still return a function that outputs description when no params specified', function(){
			var density = simpleDensity();
			var alwaysV = equation.always("v", density);
			assert.equal(alwaysV(),"d = m/v");
		});
	});
	describe('copyInput', function() {
		it('should copy one of the inputs to be used', function(){
			var q = {m1: 6, v: 2};
			var expected = {m: 6, m1: 6, v:2, d: 3};

			var density = simpleDensity();
			var copyM1 = equation.copyInput({m1:"m"}, density);
			var actual = copyM1(q);

			assert.deepEqual(expected, actual);
		});
		it('should still return a function that outputs description when no params specified', function(){
			var density = simpleDensity();
			var copyM1 = equation.copyInput({m1: "m"}, density);
			assert.equal(copyM1(),"d = m/v");
		});
		it('should return a function that just copies values if no function paramater specified', function(){
			var q = {m1: 3};
			var expected = _.extend({m: 3}, q);

			var copyM1 = equation.copyInput({m1: "m"});
			var actual = copyM1(q);

			assert.deepEqual(actual, expected);
		});
	});
});
