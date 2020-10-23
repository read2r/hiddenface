let json;
$(function () {
	json = getJson();
	let theme = json['theme'];
	document.getElementById('theme-emblem').src = theme['emblem'];
	document.getElementById('theme-title').innerHTML = theme['title'];
	document.getElementById('theme-subtitle').innerHTML = theme['subtitle'];
	//document.getElementById('theme-title').innerHTML = theme['explain'];
});

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/lmakvSP_g/';
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

function getJson() {
	let json = {
		theme: {
			emblem: 'https://storage.googleapis.com/hiddenface/hogwart/hogwart_emblem.png',
			title: 'AI 호그와트 기숙사 테스트',
			subtitle: '내 이미지와 맞는 기숙사는 어딜까?',
			explain: '',
		},
		results: {
			grf: {
				name: '그리핀도르',
				emblem: '',
				title: '용기의 그리핀도르!',
				subtitle: '"용기를 지닌 아이들은 누구나 가르치도록 하세"',
				explain:
					'대담하고 용기 있는 자들을 위한 기숙사입니다. 그리핀도르의 용감함은 때때로 터무니 없어 보일 수 있습니다. 하지만 당신은 자신의 안의 두려움과 무모함을 무릅쓰고 당당히 맞서 싸워 쟁취하는 용기를 가지고 있습니다!',
				backgroundColor: '#f6b2b0',
				barColor: '#c61c17',
			},
			rvn: {
				name: '래번클로',
				emblem: '',
				title: '지혜의 래번클로!',
				subtitle: '"가장 똑똑한 아이들을 가르치도록 하세"',
				explain:
					'지혜롭고 사려깊은 자들을 위한 기숙사입니다. 래번클로는 지혜 뿐 아니라 각자의 독창성을 중요시 여기기 때문에 괴짜가 많은 곳으로도 유명합니다. 당신은 다른 사람들이 뭐라고하든 자신의 독창성을 유지하고 그에 맞는 지혜를 가지고 있습니다!',
				backgroundColor: '#a4e8fa',
				barColor: '#0982a4',
			},
			sly: {
				name: '슬리더린',
				emblem: '',
				title: '순혈의 슬리더린!',
				subtitle: '"가장 순수한 혈통을 지닌 자들만 가르치도록 하세"',
				explain:
					'야망있고 재간있는 자들을 위한 기숙사입니다. 슬리더린은 경쟁심이 강하고 높은 야망을 가지고 있습니다. 그렇기에 대부분은 과정보다는 결과를 중요시 여기기 때문에 이기적으로 보일 수도 있습니다. 하지만 당신은 자신의 목표를 위해서라면 자신의 목숨도 걸만큼 큰 야망을 지니고 있습니다.',
				backgroundColor: '#b5eeb4',
				barColor: '#124c11',
			},
			hfl: {
				name: '후플푸프',
				emblem: '',
				title: '관용의 후플푸프!',
				subtitle: '"나는 그 아이들을 똑같이 가르칠걸세"',
				explain:
					'성실하고 진실한 사람들을 위한 기숙사 입니다. 후플푸프는 모든 것을 진심으로 사랑하고 상냥합니다. 타고난 성품이 온화하기 때문에 무시 받기 쉽습니다. 하지만 당신은 옳은 것을 위해서라면 싸움도 무릅쓰지 않는 올곧은 마음과 정의를 가지고 있습니다!',
				backgroundColor: '#fbeaab',
				barColor: '#e1b50c',
			},
		},
	};

	return json;
}

function displayResult(prediction) {
	var emblem = document.getElementById('result-emblem-wrap');
	var title = document.getElementById('result-title');
	var subtitle = document.getElementById('result-subtitle');
	var explain = document.getElementById('result-explain');

	for (let i = 0; i < maxPredictions; i++) {
		var predictionObj = prediction[i];

		var resultCode = predictionObj.className;
		var resultObj = json["results"][resultCode];
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