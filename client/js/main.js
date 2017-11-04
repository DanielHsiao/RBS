$(function() {

	// 控制 collapse 收疊展開時的按鈕圖示
	$(".collapse").on("hide.bs.collapse", function(e) {
		var parentElementId = $(e.target).data("parent");
		var bButton = $(parentElementId + " > span.glyphicon");
		bButton.removeClass("glyphicon-menu-up");
		bButton.addClass("glyphicon-menu-down");
	});
	$(".collapse").on("show.bs.collapse", function(e) {
		var parentElementId = $(e.target).data("parent");
		var bButton = $(parentElementId + " > span.glyphicon");
		bButton.removeClass("glyphicon-menu-down");
		bButton.addClass("glyphicon-menu-up");
	});

	// 處理全部資源核取方塊
	$("#allResoure").click(function(o, e) {
		var isCheck = $(this).prop("checked");
		if (isCheck) {
			$("input[data-resource='cb']").each(function() {
				$(this).prop("checked", isCheck);
			});
		}
	});

	// // 處理個別資源核取方塊
	// $("input[data-resource='cb']").click(function(o, e){
	// 	var isCheck = $(this).prop("checked");
	// 	if(!isCheck) {
	// 		$("#allResoure").prop("checked", isCheck);
	// 	}
	// });

	// 處理新增資源的按鈕
	$("#bAddResource").click(function(o, e) {
		var resName = $("#tResourceName").val();
		console.log(resName);
	});

	// 設定 小月曆 的樣式，並取得選取的日期
	$("#dtpMain").datepicker({
		format: "yyyy/mm/dd",
		language: "zh-TW",
		orientation: "top auto",
		todayHighlight: true,
		toggleActive: true
	}).on("changeDate", function(e) {
		// 並取得小月曆選取的日期
		var aa = $("#dtpMain").datepicker("getFormattedDate");
		console.log(aa);
	});

	// 設定主畫面行事曆
	$('#calendar').fullCalendar({
		header: {
			left: "today prev,next",
			center: "title",
			right: "month,agendaWeek,agendaDay"
		},
		themeSystem: "bootstrap3",
		// aspectRatio: 2.2,
		height: "parent",

		eventLimit: true,
		views: {
			month: {
				title: "",
				titleFormat: "YYYY / M",
				eventLimit: 3,
			},
		},
		// defaultView: "agendaWeek",
		nowIndicator: true,

		locale: "zh-tw",
		events: function(start, end, timezone, callback) {
			console.log(start);
			// var dataToServer = JSON.stringify(genParams(start, end));
			dataToServer = genParams(start.unix(), end.unix());
			$.ajax({
				url: '/booking',
				type: 'get',
				data: dataToServer,
				success: function(doc) {
					var events = [];
					callback(events);
				}
			}).then(function (result, status) {
				var events = [];
				console.log(result);
				var ret = JSON.parse(result);
				console.log(ret);
				callback(events);
			});
		}
	});


	$(window).resize(function() {
		resetMainSpaceHeight();
	});
	$(window).trigger("resize");
	// resetMainSpaceHeight();

	$('#btnTest').click(function(e) {
		var data = genParams('2017-11-01', '2017-11-05');
		$.ajax({
			type: "get",
			url: "/booking",
			data: data,
		}).then(function (data, status) {
			var ret = JSON.parse(data);
			console.log(ret);
		});
	});

});

function resetMainSpaceHeight() {
	var heiW = $(window).height();
	var heiH = $("#header").height();
	var heiF = $("#footer").height();
	var heiM = 60; // margin & panding
	var calHeight = heiW - heiH - heiF - heiM;
	$("#mainSpace").height(calHeight);
}

function getDisplayResources() {
	var resources = [];
	$.each($('input:checked[data-resource="cb"]'), function(ind, cb) {
		resources.push(cb.id);
	});
	return resources;
}

function genParams(start, end) {
	var data = {
		DateStr: start,
		DateEnd: end,
	};
	var resources = getDisplayResources();
	if (resources.length > 0) {
		data.Resources = resources;
	}
	console.log(data);
	return data;
}

