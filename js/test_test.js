$(function () {
	// 동적으로 페이지 타이틀 수정하기
	$(document).ready(function () {
		let param = getParam('content');

		$.getJSON('../json/' + param + '.json', function (data) {
			let json = data;
			
			addHtmlInfo(json.html_info);
			addMetaData(json.meta_data);

			let tm = json.tm;
			let theme = json.theme;

			//document.getElementById('theme-emblem').src = theme.emblem;
			//document.getElementById('theme-title').innerHTML = theme.title;
			//document.getElementById('theme-subtitle').innerHTML = theme.subtitle;
			//document.getElementById('theme-title').innerHTML = theme.explain;
		});
	});
});

function getParam(name) {
	var results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null) {
		return null;
	} else {
		return results[1] || 0;
	}
}

function addHtmlInfo(info) {
	document.title = info.title;
}

function addMetaData(data) {
	$("meta[property='og\\:title']").attr('content', data.title);
	$("meta[property='og\\:url']").attr('content', data.url);
	$("meta[property='og\\:description']").attr('content', data.description);
	$("meta[property='og\\:image']").attr('content', data.image);
}