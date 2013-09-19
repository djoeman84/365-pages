/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var lg;
function init_js () {
	var arr = [];
	for (var i = 0; i < 100; i++) {
		arr.push({'x':i,'y':Math.sin(i/25 * Math.PI)});
	}
	lg = new LineGraph(document.getElementById('line-graph-hook'),{'fix':{'x':2,'y':2}});
	lg.addData({'pts':arr,'units':{'x':'km','y':'m'}});
	lg.plot();
	return lg;
}