function default_param (check_val, default_val) {
	return (typeof check_val == 'undefined' ? default_val : check_val);
}

function escape (text) {
	return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

}

function Corpus_statistic (freq, upcoming, begin_sentence) {
	this.freq = freq;
	this.upcoming = upcoming;
	this.begin_sentence = begin_sentence;
}

function is_mid_sentence (output) {
	var last = output[output.length - 1];
	var last_char = last[last.length - 1];
	return (last_char != '.' && last_char != '!' && last_char != '?');
}

function build_text (corpus, output_length, avg_p_len, add_paragraphs, wait_for_period) {
	add_paragraphs = default_param(add_paragraphs, true);
	wait_for_period = default_param(wait_for_period, true);
	var first = corpus.begin_sentence[Math.floor(Math.random()*corpus.begin_sentence.length)];
	var output = [first];
	for (var i = 1; i < output_length || (wait_for_period && is_mid_sentence(output)); i++) {
		var last_elem = output[output.length - 1];
		var next_elems = corpus.upcoming[last_elem];
		var next;
		if (next_elems == undefined) {
			next = corpus.begin_sentence[Math.floor(Math.random()*corpus.begin_sentence.length)];
		} else {
			var next = next_elems[Math.floor(Math.random()*next_elems.length)];
		}
		output.push(next);
		if(next[next.length - 1]=='.' || next[next.length - 1]=='!' || next[next.length - 1]=='?'){
			if(add_paragraphs && Math.random()<1/avg_p_len){
				output.push("<p>");
			}
		}
	};
	return output.join(" ");
}


function parse_corpus (corpus_text) {
	if (corpus_text[corpus_text.length - 1]!='.' && corpus_text[corpus_text.length - 1]!='?' && corpus_text[corpus_text.length - 1]!='!') {
		corpus_text+='.';
	}
	var corpus_split = corpus_text.split(" ");
	var freq_dict = {};
	var upcoming = {};
	var begin_sentence = [];
	for (var i = 0; i < corpus_split.length; i++) {
		var word = corpus_split[i];
		//freq_dict
		if(word in freq_dict) {
			freq_dict[word]++;
		} else {
			freq_dict[word] = 1;
		}
		//upcoming word
		var next = "";
		if(i+1 < corpus_split.length) {
			next = corpus_split[i+1];
		}
		if (word != undefined) {
			if (word in upcoming) {
				upcoming[word].push(next);
			} else {
				upcoming[word] = [next];
			}	
		}
		//begin sentence
		if(word[word.length - 1] == '.' || word[word.length - 1] == '!' || word[word.length - 1] == '?') {
			if(i+1 < corpus_split.length && corpus_split[i+1]!= "") {
				begin_sentence.push(corpus_split[i+1]);
			}
		}
		if (i==0) {
			begin_sentence.push(corpus_split[0]);
		}
	};
	var freq = freq_dict;
	var corpus = new Corpus_statistic(freq, upcoming, begin_sentence);
	return corpus;
}

$(document).ready(function () {
	$("#corpus-selection").on("change",function (argument) {
		console.log($("#corpus-selection option:selected").val());
	})
	$("#submit-button").on("click", function () {
		var corpus = parse_corpus($("#input-text").val());
		console.log("parsed");
		var length = $("#output-length").val();
		var avg_p  = $("#output-p-length").val();
		var text = build_text(corpus, length, avg_p);
		console.log("built text");
		var title = build_text(corpus, 1, 1, false, true);
		var count = 0;
		while (count < 20 && (title.length > 150 || title.length < 20)) {
			title = build_text(corpus, 1, 1, false, true);
			count++;
		}
		console.log("built title");
		$("#article-title").html(escape(title));
		$("#output-p").html(escape(text));
	});
});