/*
	365-pages by Joe Delgado. github.com/djoeman84
*/
var gaeChannel;
var username = 'unknown';
var channel_active = false;
function init_js () {
	gaeChannel = new GAEChannel('haymessage','general',async_messsage_recieved);
	gaeChannel.subscribe(function () {
		channel_active = true;
	});
}

function async_messsage_recieved (data) {
	var message_json = JSON.parse(data.data);
	new_message(message_json.sender, message_json.message);
}

function send_message () {
	if (channel_active) {
		var message_body = document.getElementsByName('message-body')[0];
		if (message_body && message_body.value && message_body.value !== '') {
			var message_json = {
				'sender':{
					'username':username,
					'channel_id':gaeChannel.id
				},
				'message':message_body.value
			}
			if (gaeChannel){
				gaeChannel.post(message_json);
			}
		}
		message_body.value = '';
	}
	return false;
}

function username_change () {
	var username_input = document.getElementById('username');
	username = username_input.value;
}

function new_message (sender, message) {
	var mine = (gaeChannel.id === sender.channel_id);
	var now = new Date();
	var sender_name = (mine ? 'me' : sender.username);
	var meta_text = sender_name + ' ' + now.customFormat('#DDD# #h#:#mm#');
	var meta 
		= new_elem({
			'type':'div',
			'attributes':[
				{'name':'class','value':'meta '+( mine?'mine':'theirs')}
			],
			'innerHTML':meta_text
		});
	var message_body_elem
		= new_elem({
			'type':'p',
			'attributes':[
				{'name':'class','value':'message '+( mine?'mine':'theirs')}
			],
			'innerHTML':message
		});
	var li 
		= new_elem({
			'type':'li',
			'attributes':[
				{'name':'class','value':( mine?'mine':'theirs')}
			],
			'children': [
				meta, message_body_elem
			]
		});
	document.getElementById('messages-ul').appendChild(li);
	li.scrollIntoView();

}