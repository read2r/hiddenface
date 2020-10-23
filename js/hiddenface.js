let json;
let URL;

$(function () {
	json = getThemeDataByJson();
	let tm = json.tm;
	let theme = json.theme;
	
	URL = tm.url;
	document.getElementById('theme-emblem').src = theme.emblem;
	document.getElementById('theme-title').innerHTML = theme.title;
	document.getElementById('theme-subtitle').innerHTML = theme.subtitle;
	//document.getElementById('theme-title').innerHTML = theme.explain;
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
// the link to your model provided by Teachable Machine export panel
//const URL = 'https://teachablemachine.withgoogle.com/models/lmakvSP_g/';
let model, webcam, labelContainer, maxPredictions;
// Load the image model and setup the webcam
async function init() {
	const modelURL = URL + 'model.json';
	const metadataURL = URL + 'metadata.json';
	// load the model and metadata
	// Refer to tmImage.loadFromFiles() in the API to support files from a file picker
	// or files from your local hard drive
	// Note: the pose library adds "tmImage" object to your window (window.tmImage)
	model = await tmImage.load(modelURL, metadataURL);
	maxPredictions = model.getTotalClasses();
	labelContainer = document.getElementById('label-container');
	for (let i = 0; i < maxPredictions; i++) {
		// and class labels
		labelContainer.appendChild(document.createElement('div'));
	}
}
// run the webcam image through the image model
async function predict() {
	// predict can take in an image, video or canvas html element
	var faceImage = document.getElementById('face-image');
	const prediction = await model.predict(faceImage);
	prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
	displayResult(prediction);
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

function getImage(code) {
	var img =
		"<image src='https://storage.googleapis.com/hiddenface/hogwart/" +
		code +
		".png' class='result-emblem'>";
	return img;
}

function getClssPrediction(name, value, background, bar) {
	var classPrediction =
		"<div class='label-child-wrap'><div class='cname'>" +
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

function displayResult(prediction) {
	var emblem = document.getElementById('result-emblem-wrap');
	var title = document.getElementById('result-title');
	var subtitle = document.getElementById('result-subtitle');
	var explain = document.getElementById('result-explain');

	for (let i = 0; i < maxPredictions; i++) {
		var predictionObj = prediction[i];

		var resultCode = predictionObj.className;
		var resultObj = json.results[resultCode];
		var resultName = resultObj.name;

		var resultTitle = resultObj.title;
		var resultSubtitle = resultObj.subtitle;
		var resultExplain = resultObj.explain;

		var resultBackgroundColor = resultObj.backgroundColor;
		var resultBarColor = resultObj.barColor;
		var resultValue = Math.round(predictionObj.probability * 100);

		if (i == 0) {
			emblem.innerHTML = getImage(resultCode);
			title.innerHTML = resultTitle;
			title.style.color = resultBarColor;
			subtitle.innerHTML = resultSubtitle;
			explain.innerHTML = resultExplain;
		}

		var classPrediction = getClssPrediction(
			resultName,
			resultValue,
			resultBackgroundColor,
			resultBarColor
		);
		
		labelContainer.childNodes[i].innerHTML = classPrediction;
	}
}

$('.image-upload-wrap').bind('dragover', function () {
	$('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
	$('.image-upload-wrap').removeClass('image-dropping');
});