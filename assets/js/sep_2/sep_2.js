/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var lg;
function init_js () {
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push({'x':i,'y':Math.sin(i/25 * Math.PI)});
	}
	lg = new LineGraph(document.getElementById('line-graph'));
	lg.addData({'pts':arr,'units':{'x':'km','y':'km'}});
	lg.plot();
	return lg;
}