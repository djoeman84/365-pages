/*
	365-pages by Joe Delgado. github.com/djoeman84
*/

function MutableTree () {
	this.new_id = 0;
}
MutableTree.prototype.evaluate = function () {
	return this.value;
}
MutableTree.prototype.toString = function () {
	return this.value.toString();
}

function MTNode (val) {
	this.value = val;
	this.id;
	var children = [];
	this.getChildren = function () {
		return children;
	}
}
