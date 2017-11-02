$(function(){

	// 控制 collapse 收疊展開時的按鈕圖示
	$(".collapse").on("hide.bs.collapse", function (e) {
		var parentElementId = $(e.target).data("parent");
		var bButton = $(parentElementId + " > span.glyphicon");
		bButton.removeClass("glyphicon-menu-up");
		bButton.addClass("glyphicon-menu-down");
	});
	$(".collapse").on("show.bs.collapse", function (e) {
		var parentElementId = $(e.target).data("parent");
		var bButton = $(parentElementId + " > span.glyphicon");
		bButton.removeClass("glyphicon-menu-down");
		bButton.addClass("glyphicon-menu-up");
	});

	// 處理全部資源核取方塊
	$("#allResoure").click(function(o, e){
		var isCheck = $(this).prop("checked");
		if(isCheck) {
			$("input[data-resource='cb']").each(function(){
				$(this).prop("checked", isCheck);
			});
		}
	});

	// 處理個別資源核取方塊
	$("input[data-resource='cb']").click(function(o, e){
		var isCheck = $(this).prop("checked");
		if(!isCheck) {
			$("#allResoure").prop("checked", isCheck);
		}
	});

	// 處理新增資源的按鈕
	$("#bAddResource").click(function(o, e){
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
	}).on("changeDate", function(e){
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
		// bootstrapGlyphicons: {
		// 	close: 'glyphicon-remove',
		// 	prev: 'glyphicon-chevron-left',
		// 	next: 'glyphicon-chevron-right',
		// 	prevYear: 'glyphicon-backward',
		// 	nextYear: 'glyphicon-forward'
		// },
		// aspectRatio: 2.2,
		height: "parent",
		// contentHeight: "auto",

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
		// navLinks: true,
	});


	$(window).resize(function() {
		resetMainSpaceHeight();
	});
	$(window).trigger("resize");
	// resetMainSpaceHeight();

});

function resetMainSpaceHeight() {
	var heiW = $(window).height();
	var heiH = $("#header").height();
	var heiF = $("#footer").height();
	var heiM = 60; // margin & panding
	var calHeight = heiW - heiH - heiF - heiM;
	$("#mainSpace").height(calHeight);
}