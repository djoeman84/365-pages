/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

/*
 *  Value: Main class which defines a single value
 *
 */
function Value (val) {
	this.value = val;
}
Value.prototype.evaluate = function () {
	return this.value;
}
Value.prototype.toString = function () {
	return this.value.toString();
}


/*
 *  Equation: Inherits from Value. Defines a value with two subvalues
 *
 */
Operation.prototype = new Value();
Operation.prototype.constructor = Operation;
function Operation (left, right) {
	this.left = left;
	this.right = right;
	this.operatorStr = ',';
}
Operation.prototype.evaluate = function () {
	return null; //ABSTRACT
}
Operation.prototype.toString = function () {
	return '('+this.left.toString() + this.operatorStr + this.right.toString()+')';
}


AddOP.prototype = new Operation();
AddOP.prototype.constructor = AddOP;
function AddOP (left, right) {this.left = left;this.right = right;this.operatorStr = '+';};
AddOP.prototype.evaluate = function () {
	return this.left.evaluate() + this.right.evaluate();
}


SubOP.prototype = new Operation();
SubOP.prototype.constructor = SubOP;
function SubOP (left, right) {this.left = left;this.right = right;this.operatorStr = '-';};
SubOP.prototype.evaluate = function () {
	return this.left.evaluate() - this.right.evaluate();
}


MltOP.prototype = new Operation();
MltOP.prototype.constructor = MltOP;
function MltOP (left, right) {this.left = left;this.right = right;this.operatorStr = '*';};
MltOP.prototype.evaluate = function () {
	return this.left.evaluate() * this.right.evaluate();
}

DivOP.prototype = new Operation();
DivOP.prototype.constructor = DivOP;
function DivOP (left, right) {this.left = left;this.right = right;this.operatorStr = '/';};
DivOP.prototype.evaluate = function () {
	return this.left.evaluate() / this.right.evaluate();
}

var operators = [
	{'operator':'+','Obj_Class':AddOP},
	{'operator':'-','Obj_Class':SubOP},
	{'operator':'/','Obj_Class':DivOP},
	{'operator':'*','Obj_Class':MltOP}
	];
function parseEq (string) {
	if (string == '') return new Value(0);
	if (string[0] === '(' && match_paren(string,0) === string.length-1) {
		return parseEq(string.substring(1,string.length - 1));
	}
	var operator_pos =  get_next_operator(string);
	if (operator_pos) {
		var left = parseEq(string.slice(0,operator_pos.index));
		var right =parseEq(string.slice(operator_pos.index+1));
		return new operator_pos.operator.Obj_Class(left, right);
	}
	return new Value(parseFloat(string));
}

function get_next_operator (string) {
	for (var n = 0; n < operators.length; n++) {
		var depth = 0;
		for (var i = 0; i < string.length; i++) {
			if (string[i] === '(') depth++;
			if (string[i] === ')') depth--;
			if(depth === 0 && string[i] === operators[n].operator) {
				return {'index':i,'operator':operators[n]};
			}	
		};
	};
}

function match_paren(string, start) {
	depth = 0;
	for (var i = start; i < string.split('').length; i++) {
		if(string.split('')[i]==='(') depth++;
		if(string.split('')[i]===')') depth--;
		if (!depth) return i;
	}
}


