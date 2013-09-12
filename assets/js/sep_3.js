/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var load_gif = document.getElementById('load-gif');
function init_js () {
	load_gif.style.display = 'none';
	$('.recipie-card').find('.edit').each(function(i, v){v.contentEditable = 'false';})
}


function edit (id) {
	if ($('.recipie-card').find('.edit[contentEditable=true]').length) {
		var i = $($('.recipie-card').find('.edit[contentEditable=true]')[0]).parents('.recipie-card').attr('id')
		if (i != id && i !== undefined) save(i);
	}
	$('.recipie-card').find('.edit').each(function(i, v){v.contentEditable = 'false';});
	$('#'+id).find('.edit').each(function(i, v){v.contentEditable = 'true';});
}

function save (id) {
	var editable = true;
	var data = {'fields':{'id':id},'type':'update'};
	$('#'+id).find('.edit[contentEditable=true]').each(function (i, v) {
		var no_returns = v.innerHTML.replace(/(\r\n|\n|\r)/gm,"")
		var arr = $(no_returns).map(function() {return $('<div>').append(this).html(); });
		var cleaned_arr = [];
		for (var i = 0; i < arr.length; i++) {var no_space = arr[i].replace(/\s+/,'');if(no_space!== '') cleaned_arr.push(arr[i].replace(/<\/?[^>]+(>|$)/g, ""));}
		data.fields[v.getAttribute('field')] = cleaned_arr;
		v.contentEditable = 'false';
	});

	if (!$.isEmptyObject(data.fields))	send_to_server(data, function (data) {
		console.log('returned');
		console.log(data);
	});
}

function new_card (elem) {
	var post_data = {'type':'new'};
	load_gif.style.display = 'block';
	send_to_server(post_data, function (data) {
		console.log('loaded');
		console.log(data.data);
		var new_card_elem = create_new_card(data.data);
		append_next(new_card_elem, elem);
		load_gif.style.display = 'none';
		$('#'+data.data.id).find('.edit').each(function(i, v){v.contentEditable = 'true';});
	});
}

function send_to_server (data, fn) {
	console.log(data);
	$.post('./3-SEP',JSON.stringify({'data':data}),fn,'json');
}

function append_next (new_elem, existing_elem) {
	if (existing_elem.nextSibling) {
		existing_elem.parentNode.insertBefore(new_elem, existing_elem.nextSibling);
	} else {
		existing_elem.parentNode.appendChild(new_elem);
	}
}

function create_new_card (template) {
	console.log(template.id);
	/* TOP */
	var top_title
			= new_elem({
				'type':'h1',
				'innerHTML':template.title
			});
	var top_title_div
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'field','value':'title'},
					{'name':'class','value':'card-titile edit'}
				],
				'children':[
					top_title
				]
			});
	var top 
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'top'}
				],
				'children':[
					top_title_div
				]
			});

	/* BOTTOM */
	var card_img 
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'card-img'}
				]
			});
	var left
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'left'}
				],
				'children':[
					card_img
				]
			});
	//card ing and card inst
	var ingredients
			= new_elem({
				'type':'div',
				'innerHTML':'Ingredients'
			});
	var ingredients_lis = [];
	for (var i = 0; i < template.ingredients.length; i++) {
		ingredients_lis.push(
			new_elem({
				'type':'li',
				'innerHTML':template.ingredients[i]
			})
		);
	};
	var ingredients_ul
			= new_elem({
				'type':'ul',
				'attributes':[
					{'name':'class','value':'edit'},
					{'name':'field','value':'ingredients'}
				],
				'children':ingredients_lis
			});
	var card_ingredients
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'card-ingredients'}
				],
				'children':[
					ingredients, ingredients_ul
				]
			});
	var instructions
			= new_elem({
				'type':'div',
				'innerHTML':'Instuctions'
			});

	var instructions_lis = [];
	for (var i = 0; i < template.instructions.length; i++) {
		instructions_lis.push(
			new_elem({
				'type':'li',
				'innerHTML':template.instructions[i]
			})
		);
	};
	var instructions_ul
			= new_elem({
				'type':'ul',
				'attributes':[
					{'name':'class','value':'edit'},
					{'name':'field','value':'instructions'}
				],
				'children':instructions_lis
			});
	var card_instructions
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'card-instructions'}
				],
				'children':[
					instructions, instructions_ul
				]
			});
	var right
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'right'}
				],
				'children':[
					card_ingredients, card_instructions
				]
			});
	var bottom 
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'bottom'}
				],
				'children':[
					left, right
				]
			});

	/* ANCHORS */
	var anchor_edit 
			= new_elem({
				'type':'a',
				'innerHTML':'edit',
				'attributes':[
					{'name':'href','value':'javascript:void(0)'},
					{'name':'onclick','value':'edit("'+ template.id +'")'},
					{'name':'class','value':'button'}
				]});
	var anchor_save 
			= new_elem({
				'type':'a',
				'innerHTML':'save',
				'attributes':[
					{'name':'href','value':'javascript:void(0)'},
					{'name':'onclick','value':'save("'+ template.id +'")'},
					{'name':'class','value':'button'}
				]});

	var card_body 
			= new_elem({
				'type':'div',
				'attributes':[
					{'name':'class','value':'recipie-card'},
					{'name':'id'   ,'value':template.id}
				],
				'children':[
					top, bottom, anchor_edit, anchor_save
				]
			});
	return card_body;
}

function new_elem (aux) {
	var ret_elem = document.createElement(aux.type);
	if (aux.attributes) {
		var attributes = aux.attributes;
		for (var i = 0; i < attributes.length; i++) {
			ret_elem.setAttribute(attributes[i].name,attributes[i].value);
		};
	}
	if (aux.innerHTML) ret_elem.innerHTML = aux.innerHTML;
	if (aux.children) {
		var children = aux.children;
		for (var i = 0; i < children.length; i++) {
			ret_elem.appendChild(children[i]);
		};
	}
	return ret_elem;
}