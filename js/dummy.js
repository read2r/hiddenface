let json;
let URL;

$(function () {
	var themeCode = getThemeCode();
	$.getJSON('../json/' + themeCode + '.json', function(data) {
		json = data;
		addThemeContents(json.theme);
	});
});

function getThemeCode() {
	let pageUrl = window.location.href;
	let temp = pageUrl.split("/");
	let themeCode = temp[temp.length-1].split(".")[0];
	return themeCode;
}

function addThemeContents(theme) {
	addThemeEmblem(theme.emblem);
	addThemeTitle(theme.title);
	addThemeSubtitle(theme.subtitle);
}

function addThemeEmblem(emblem) {
	$("#theme-wrapper").append("<img id='theme-emblem'>");
	$('#theme-emblem').attr("src", emblem);
}

function addThemeTitle(title) {
	$("#theme-wrapper").append("<div id='theme-title'></div>");
	$("#theme-title").html(title);
}

function addThemeSubtitle(subtitle) {
	$("#theme-wrapper").append("<div id='theme-subtitle'></div>");
	$("#theme-subtitle").html(subtitle);
}

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
// the link to your model provided by Teachable Machine export panel
//const URL = 'https://teachablemachine.withgoogle.com/models/lmakvSP_g/';
let model, webcam, labelContainer, maxPredictions;
// Load the image model and setup the webcam
async function init() {
	URL = json.tm.url;
	const modelURL = URL + 'model.json';
	const metadataURL = URL + 'metadata.json';
	// load the model and metadata
	// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	// or files from your local hard drive
	// Note: the pose library adds "tmImage" object to your window (window.tmImage)
	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();
}
// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	var faceImage = document.getElementById('face-image');
	const predictions = await model.predict(faceImage);
	predictions.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
	displayResult(predictions);
	$('#result-wrap').show();
	$('.remove-image').show();
}

function readURL(input) {
	$('#result-wrap').hide();
	$('.remove-image').hide();
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$('.image-upload-wrap').hide();
			$('.loader').show();
			$('.file-upload-image').attr('src', e.target.result);
			$('.file-upload-content').show();
			$('.image-title').html(input.files[0].name);
		};
		reader.readAsDataURL(input.files[0]);
		init().then(function () {
			predict();
			$('.loader').hide();
		});
	} else {
		removeUpload();
	}
}

function removeUpload() {
	$('.file-upload-input').replaceWith($('.file-upload-input').clone());
	$('.file-upload-content').hide();
	$('.image-upload-wrap').show();
}
function displayResult(predictions) {
	resetResultTags();
	addResult(predictions[0]);
	addLabels(predictions)
}

function resetResultTags() {
	$('result-wrap').html("");
}

function addResult(prediction) {
	let result = json.results[prediction.className];
	
	$("#result-wrap").append("<img id='result-emblem'>");
	$("#result-wrap").append("<div id='result-title'></div>");
	$("#result-wrap").append("<div id='result-subtitle'></div>");
	$("#result-wrap").append("<div id='result-explain'></div>");
	
	$('#result-emblem').attr('src', result.emblem);
	$('#result-emblem').attr('class', 'result-emblem');
	$('#result-title').html(result.title);
	$('#result-subtitle').html(result.subtitle);
	$('#result-explain').html(result.explain);
}

function addLabels(predictions) {
	$("#result-wrap").append("<div id='label-container'></div>");
	for (let i = 0; i < maxPredictions; i++) {
		let prediction = predictions[i];
		let label = json.results[prediction.className];
		let labelValue = Math.round(prediction.probability * 100);
		let classPrediction = getClssPrediction(
			label.name,
			labelValue,
			label.backgroundColor,
			label.barColor
		);
		$("#label-container").append("<div id=label_" + i + "></div>");
		$('#label_' + i).html(classPrediction);
	}
}

function getClssPrediction(name, value, background, bar) {
	var classPrediction =
		"<div class='label-child-wrap'><div class='" +
		json.css.cname_o +
		" " +
		json.css.cname_s +
		"'>" +
		name +
		"</div><div class='progress-wrapper'><div class='progress-bar' style='background:" +
		background +
		"'><span class='progress-bar-fill' style='width:" +
		value +
		'%; background:' +
		bar +
		"'>" +
		value +
		'%</span></div></div></div>';
	return classPrediction;
}

$('.image-upload-wrap').bind('dragover', function () {
	$('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
	$('.image-upload-wrap').removeClass('image-dropping');
});