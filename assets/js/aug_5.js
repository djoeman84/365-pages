
var arabic = ['انا احب الجبن','ابني يعيش في السيارة','احبك','انا اسمي يوسف','اهلان','لا اتكلم العربي', 'لا افهم اي شيء بالعربي','انا امريكي', 'لست عرب', 'اهلان، انا من امريكة','لا افهم', 'اصف، لست عرب'];
var german = ['Jou Alta','Hallo','Hier kommt die Maus','Ich verstehe nichts', 'Ich bin Auslander','Ich habe keine Idee, was du gesagt hast', 'Ich bin kein Deutscher', 'Ich spriche kein Deutsch', 'Was hast du gerade gesagt', 'Wie Bitte','Ich habe Hunger'];
var end_punctuation = ['.','?','!'];
var eng_to_arb = {'?':'؟', ',':'،'};
var rtl_lang = ['arabic'];

function get_end_punctuation (input_text) {
	if ($.inArray(input_text[input_text.length - 1], end_punctuation) != -1) {
		return input_text[input_text.length - 1];
	}
	return "";
}

function eng_to_arb_punctuation (end_punctuation) {
	if (end_punctuation in eng_to_arb) {
		return eng_to_arb[end_punctuation];
	}
	return end_punctuation;
}

function remove_end_punctuation (input_text) {
	if ($.inArray(input_text[input_text.length - 1], end_punctuation) != -1) {
		return input_text.substring(0, input_text.length - 1);
	}
	return input_text;
}

function get_translation (input_text, input_language, output_language) {
	if (input_text.length == 0) {
		return "";
	}
	var end_punctuation = get_end_punctuation(input_text);
	var hash = CryptoJS.MD5(remove_end_punctuation(input_text)+input_language);
	if (output_language == 'arabic') {
		return arabic[(parseInt("0x"+hash))%arabic.length] + eng_to_arb_punctuation(end_punctuation);
	}
	if (output_language == 'german') {
		return german[(parseInt("0x"+hash))%german.length] + end_punctuation;
	}
	return "";
}

function format_for_direction (output_language) {
	if ($.inArray(output_language, rtl_lang) != -1) {
		$("#output-text").css('direction','rtl');
	} else {
		$("#output-text").css('direction','ltr');
	}
}

function translate () {
	var corpus = $("#input-text").val();
	console.log(corpus);
	var output_language = $("#language-to option:selected").val();
	var input_language = $("#language-from option:selected").val();
	format_for_direction(output_language);
	$("#output-text").html(get_translation(corpus, input_language, output_language));
}
