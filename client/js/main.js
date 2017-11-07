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
		displayBooking();
	});

	// 處理新增資源的按鈕
	// $("#bAddResource").click(function(o, e) {
	// 	var resName = $("#tResourceName").val();
	// 	console.log(resName);
	// });

	// 設定 小月曆 的樣式，並取得選取的日期
	$("#dtpMain").datepicker({
		format: "yyyy/mm/dd",
		language: "zh-TW",
		orientation: "top auto",
		todayHighlight: true,
		toggleActive: true
	}).on("changeDate", function(e) {
		// 並取得小月曆選取的日期
		var date = $("#dtpMain").datepicker("getFormattedDate");
		console.log(date);
		$('#calendar').fullCalendar('gotoDate', date)
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
		selectable: true,
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
		eventClick: function(calEvent, jsEvent, view) {
			alert('Event: ' + calEvent.title);
			alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			alert('View: ' + view.name);
		},
		dayClick: function(date, jsEvent, view) {
			alert('Clicked on: ' + date.format());
			alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			alert('Current view: ' + view.name);
		},
	});


	$(window).resize(function() {
		resetMainSpaceHeight();
	});
	$(window).trigger("resize");

});

function resetMainSpaceHeight() {
	var heiW = $(window).height();
	var heiH = $("#header").height();
	var heiF = $("#footer").height();
	var heiM = 60; // margin & panding
	var calHeight = heiW - heiH - heiF - heiM;
	$("#mainSpace").height(calHeight);
}

