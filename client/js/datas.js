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
		// console.log(date);
		$('#calendar').fullCalendar('gotoDate', date)
	});

	var resObj = new Resources($("#resourceTable"));
	resObj.refreshResources();

	// 設定主畫面行事曆
	$('#calendar').fullCalendar({
		header: {
			left: "today prev,next",
			center: "title",
			right: "month,agendaWeek,agendaDay"
		},
		views: {
			month: {
				title: "",
				titleFormat: "YYYY / M",
				eventLimit: 3,
			},
		},
		// defaultView: "agendaWeek",
		navLinks: true, 
		themeSystem: "bootstrap3",
		selectable: true,
		selectHelper: true,
		editable: true, 
		eventLimit: true,
		height: "parent",
		nowIndicator: true,
		locale: "zh-tw",
		timezone: 'local',

		eventResize: function(event) {
			Calendar.eventResize(event);
		},
		eventDrop: function(event) {
			console.log('eventDrop');
		},
	});

	$('#calendar').fullCalendar('addEventSource', function(start, end, timezone, callback) {
		var ress = resObj.getDisplayResources();
		Booking.getBookings(start, end, ress, callback);
	});

	// $('#calendar').fullCalendar('eventResize', function(event, delta, revertFunc) {
	// 	console.log('eventResize - dy');
	// 	// Booking.updateBooking(event, function(events) {
	// 	// 	if (events.lenght <= 0) {
	// 	// 		revertFunc();
	// 	// 		return;
	// 	// 	}
	// 	// 	$('#calendar').fullCalendar('updateEvents', events);
	// 	// });
	// });

	// $('#calendar').fullCalendar('eventDrop', function(event, delta, revertFunc) {
	// 	console.log('eventDrop - dy');
	// });

	// $('#calendar').fullCalendar('select', function(start, end) {
		
	// });

	// $('#calendar').fullCalendar('eventClick', function(event) {
		
	// });

	// 確認修改資源按鈕
	$('#btnMdyResConfim').click(function(e) {
		var resOld = $('#toMdyResIdHide').val();
		var resNew = $('#toMdyResId').val();
		var colNew = $('#toMdyResCl').val();
		resObj.modifyResource(resOld, resNew, colNew, function() {
			var events = $('#calendar').fullCalendar('clientEvents',  function(event) {
				return (event.useResource == resOld);
			});
			$.each(events, function(ind, item) {
				Booking.changeResAndColor(item, resNew, colNew);
			});
			$('#calendar').fullCalendar('updateEvents', events);
			var trg = $('span[id="' + resOld + '"]');
			var prv = trg.parent().parent().prev();
			trg.text(resNew);
			prv.css('background-color', colNew)
		});
	});

	// 確認刪除資源按鈕
	$('#btnDelResConfim').click(function(e) {
		var resId = $('#toDelRes').text();
		resObj.deleteResource(resId, function() {
			$('#calendar').fullCalendar('removeEvents', function(event) {
				return (event.useResource == resId);
			});
			$('tr[data-resource="' + resId + '"]').remove();
		});
	});

	// 測試按鈕
	// $('#btnTest').click(function(e) {
	// 	var data = genParams('2017-11-01', '2017-11-05');
	// 	$.ajax({
	// 		type: "get",
	// 		url: "/booking",
	// 		data: data,
	// 	}).then(function (data, status) {
	// 		var ret = JSON.parse(data);
	// 		console.log(ret);
	// 	});
	// });

	$(window).resize(function() {
		resetMainSpaceHeight();
	});
	$(window).trigger("resize");

	// 設定 calcendar 所在的 div 高度
	function resetMainSpaceHeight() {
		var heiW = $(window).height();
		var heiH = $("#header").height();
		var heiF = $("#footer").height();
		var heiM = 60; // margin & panding
		var calHeight = heiW - heiH - heiF - heiM;
		$("#mainSpace").height(calHeight);
	}
});

class Resources {
	constructor(table) {
		this.resources = [];
		this.table = table;
	}

	// 產生一批資源按鈕，清除，再充新產生
	genResourcesInTable() {
		var th = this;
		$("tr[data-resource='tr']").each(function(ind, item) {
			item.remove();
		});

		$.each(th.resources, function(ind, item) {
			th.genResourceTr(item).appendTo(th.table);
		});

		// 處理全部資源核取方塊
		$("#allResoure").click(function(o, e) {
			var isCheck = $(this).prop("checked");
			if (isCheck) {
				$("input[data-resource='cb']").each(function(ind, item) {
					$(this).prop("checked", isCheck);
				});
			}
			$('#calendar').fullCalendar('refetchEvents');
		});

		// 處理個別資源核取方塊
		$("input[data-resource='cb']").click(function(o, e) {
			var isCheck = $(this).prop("checked");
			if(!isCheck) {
				$("#allResoure").prop("checked", isCheck);
			}
			$('#calendar').fullCalendar('refetchEvents');
		});

		$("#allResoure").trigger("click");
	}

	// 產生一批資源按鈕 - 清除，再充新產生
	genResourceTr(resource){
		// console.log(resource);
		var $tr = $('<tr data-resource="' + resource.Resource + '"></tr>');
		var $td = $('<td></td>');
		$tr.append($td);

		var $spColor = $('<span class="badge" style="background-color:' + resource.Color + '">&nbsp;</span>');
		// var $dvCheck = $('<div class="checkbox-inline"><label><input type="checkbox" id="' + resource.Resource + '" data-resource="cb">' + resource.Resource + '</label></div>');
		var $dvCheck = $('<div class="checkbox-inline"><label><input type="checkbox" data-resource="cb"><span  id="' + resource.Resource + '">' + resource.Resource + '</span></label></div>');
		var $spBtnGp = $('<span class="btn-group pull-right" role="group" aria-label="' + resource.Resource + '"></span>');
		$td.append($spColor);
		$td.append('&nbsp;');
		$td.append($dvCheck);
		$td.append($spBtnGp);
		
		var $btnDel = $('<button type="button" class="btn btn-link btn-xs" data-resource="' + resource.Resource + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
		var $btnMdy = $('<button type="button" class="btn btn-link btn-xs" data-resource="' + resource.Resource + '"><span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span></button>');
		$spBtnGp.append($btnDel);
		$spBtnGp.append($btnMdy);

		// 按鈕"修改"的操作
		$btnMdy.click(function(e) {
			// 顯示修改用的表單，確認後修改
			// var resId = $(this).data("resource");
			$('#toMdyResIdHide').val(resource.Resource);
			$('#toMdyResId').val(resource.Resource);
			$('#toMdyResCl').val(resource.Color);
			var modal = $("#modalModifyResource");
			modal.modal('show');
		});

		// 按鈕"刪除"的操作
		$btnDel.click(function(e) {
			// 跳出確認對話框，確認後刪除
			// var resId = $(this).data("resource");
			$('#toDelRes').text(resource.Resource);
			var modal = $("#modalDeleteResource");
			modal.modal('show');
		});

		return $tr;
	}

	// 取得畫面上要顯示的資源清單
	getDisplayResources() {
		var ress = [];
		$.each($('input:checked[data-resource="cb"] span'), function(ind, item) {
			ress.push(item.id);
		});
		return ress;
	}

	// 取得所有的 Resource 清單 - 資料庫
	refreshResources() {
		var th = this;
		$.ajax({
			type: "get",
			url: "/booking/Resources"
		}).then(function (data) {
			th.resources = JSON.parse(data);
			th.genResourcesInTable();
		});
	}

	// 修改一個 Resource - 資料庫
	modifyResource(resOld, resNew, colNew, callback) {
		var dataToServer = {
			NewResource: resNew,
			NewColor: colNew,
			OldResource: resOld,
		};
		$.ajax({
			type: "put",
			url: "/booking/Resource",
			data: JSON.stringify(dataToServer),
			contentType: "application/json; charset=utf8",
		}).then(function (data, status) {
			var ret = JSON.parse(data);
			if (ret.rbsResult == "success") {
				if(callback) {
					callback();
				}
			}
		});
	}

	// 刪除一個 Resource - 資料庫
	deleteResource(resId, callback) {
		var dataToServer = {Resource: resId};
		$.ajax({
			type: "delete",
			url: "/booking/Resource",
			data: JSON.stringify(dataToServer),
			contentType: "application/json; charset=utf8",
		}).then(function (data, status) {
			var ret = JSON.parse(data);
			if (ret.rbsResult == "success") {
				if(callback) {
					callback();
				}
			}
		});
	}
}

class Calendar {
	static eventResize(event) {
		Booking.updateBooking(event, function(events) {
			if (events.lenght <= 0) {
				revertFunc();
				return;
			}
			$('#calendar').fullCalendar('updateEvents', events);
		});
	}
}

class Booking {

	// 從一群 booking 物件產生一群 event 物件
	static genEvents(bookings) {
		var events = [];
		$.each(bookings, function(ind, booking) {
			var event = Booking.genEvent(booking);
			events.push(event);
		});
		return events;
	}
	// 從 booking 物件產生 event 物件
	static genEvent(booking) {
		var event = {
			id: booking.Id,
			title: booking.Name,
			start: booking.DateStr,
			end: booking.DateEnd,
			backgroundColor: booking.Color,
			desc: booking.Cont,
			editable: true,
			useResource: booking.Resource,
			booking: booking,
		};
		return event;
	}
	// 從 event 物件產生 booking 物件
	static genBooking(event) {
		if (event.booking) {
			return event.booking;
		}
		var booking = {
			Id: event.id,
			Name: event.title,
			Cont: event.desc,
			Resource: useResource,
			DateStr: start,
			DateEnd: end,
			Color: backgroundColor,
		};
		return booking;
	}

	// 變更 event 資源以及顏色
	static changeResAndColor(event, res, color) {
		event.useResource = res;
		event.backgroundColor = color;
	}

	// 查詢 booking (dStr:起始日, dEnd:結束日, ress:資源列舉[, callback:回呼函數]) - 資料庫
	static getBookings(dStr, dEnd, ress, callback) {
		var dts = dStr.format("YYYY-MM-DD HH:mm:ss");
		var dte = dEnd.format("YYYY-MM-DD HH:mm:ss");
		var dataToServer = genParams(dts, dte, ress);
		var bookings = [];
		$.ajax({
			url: '/booking',
			type: 'get',
			data: dataToServer,
		}).then(function (result, status) {
			bookings = JSON.parse(result);
			var events = Booking.genEvents(bookings);
			if(callback) {
				callback(events);
			}
		});
	}

	static updateBooking(event, callback) {
		var event = genBooking(event);
		var dataToServer = JSON.stringify(event);
		$.ajax({
			url: '/booking',
			type: 'put',
			data: dataToServer,
			contentType: "application/json; charset=utf8",
		}).then(function(data, status) {
			var bookings = JSON.parse(data);
			var ret = [];
			
			if (bookings.rbsResult && bookings.rbsResult == "success") {
				ret = [event];	
			} else if (bookings.lenght) {
				ret = Booking.genEvents(bookings);		
			}

			if(callback) {
				callback(ret);
			}		
		});
	}

}

function genParams(dStr, dEnd, ress) {
	var data = {
		DateStr: dStr,
		DateEnd: dEnd,
		Resources: ress,
	};
	return data;
}




// genResourceTag 的雛型範本
function foo() {
	// <tr>
	// 	<td>
	// 		<span class="badge " style="background-color:#3fbb54">&nbsp;</span>&nbsp;
	// 		<div class="checkbox-inline">
	// 			<label>
	// 				<input type="checkbox" id="res01" name="res01" data-resource="cb">會議室1
	// 			</label>
	// 		</div>
	// 		<span class="btn-group pull-right" role="group" aria-label="會議室1">
	// 			<button type="button" class="btn btn-link btn-xs">
	// 				<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
	// 			</button>
	// 			<button type="button" class="btn btn-link btn-xs">
	// 				<span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span>
	// 			</button>
	// 		</span>
	// 	</td>
	// </tr>
}
