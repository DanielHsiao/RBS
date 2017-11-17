var resObj = {};
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

	//設定及處理小月曆
	$("#dtpMain").datetimepicker({
		dayViewHeaderFormat: "YYYY / M",
		format: "YYYY-M-D",
		inline: true,
	}).on('dp.change', function(e) {
		var dt = e.date;
		$('#calendar').fullCalendar('gotoDate', dt);
	});

	resObj = new Resources($("#resourceTable"));
	// resObj.refreshResources(resObj.genResourcesInTable);
	resObj.refreshResources(function() {
		resObj.genResourcesInTable();
		
		$('#calendar').fullCalendar('addEventSource', function(start, end, timezone, callback) {
			var ress = resObj.getDisplayResources();
			Booking.getBookings(start, end, ress, callback);
		});
	});

	// 確認修改資源按鈕
	$('#btnMdyResConfim').click(function(e) {
		Button.btnMdyResConfim_click(e);
	});

	// 確認刪除資源按鈕
	$('#btnDelResConfim').click(function(e) {
		Button.btnDelResConfim_click(e);
	});

	// 確認新增紀錄按鈕
	$('#btnInsBok').click(function(e) {
		Button.btnInsBok_click(e);
	});

	// 確認修改紀錄按鈕
	$('#btnMdyBok').click(function(e) {
		Button.btnMdyBok_click(e);
	});

	// 確認刪除紀錄按鈕
	$('#btnDelBok').click(function(e) {
		Button.btnDelBok_click(e);
	});

	// 搜尋按鈕
	$('#btnSearch').click(function(e) {
		Button.btnSearch_click(e);
	});
	$('#txtSearch').keyup(function(e) {
		if (e.keyCode == 13) {
			Button.btnSearch_click(e);
		}
	});

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
		defaultView: "agendaWeek",
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

		eventResize: function(event, delta, revertFunc) {
			Calendar.eventResize(event, delta, revertFunc);
		},
		eventDrop: function(event, delta, revertFunc) {
			Calendar.eventDrop(event, delta, revertFunc);
		},
		eventClick: function(event) {
			Calendar.eventClick(event);
		},
		select: function(start, end) {
			Calendar.select(start, end);
		},
	});

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

	$('#bookingDateStr').datetimepicker({
		dayViewHeaderFormat: "YYYY / M",
		format: "YYYY-M-D HH:mm",
		stepping: 15,
		sideBySide: true,
	});
	$('#bookingDateEnd').datetimepicker({
		dayViewHeaderFormat: "YYYY / M",
		format: "YYYY-M-D HH:mm",
		stepping: 15,
		sideBySide: true,
		useCurrent: false, //Important! See issue #1075
	});
	$("#bookingDateStr").on("dp.change", function (e) {
		$('#bookingDateEnd').data("DateTimePicker").minDate(e.date);
	});
	$("#bookingDateEnd").on("dp.change", function (e) {
		$('#bookingDateStr').data("DateTimePicker").maxDate(e.date);
	});
});

class Button {

	// 變更一個 Resource - 資料庫 (呼叫 Resource)
	static btnMdyResConfim_click(e) {
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
	}

	// 刪除一個 Resource - 資料庫 (呼叫 Resource)
	static btnDelResConfim_click(e) {
		var resId = $('#toDelRes').text();
		resObj.deleteResource(resId, function() {
			$('#calendar').fullCalendar('removeEvents', function(event) {
				return (event.useResource == resId);
			});
			$('tr[data-resource="' + resId + '"]').remove();
		});
	}
	static btnInsBok_click(e) {
		var event = Calendar.getEventModalValue();
		Booking.insertBooking(event, function(event0) {
			$('#calendar').fullCalendar('refetchEvents');
			// $('#calendar').fullCalendar('renderEvents', event0, true);
		});
	}
	static btnMdyBok_click(e) {
		var event = Calendar.getEventModalValue();
		Booking.updateBooking(event, function(event0) {
			$('#calendar').fullCalendar('refetchEvents');
			// $('#calendar').fullCalendar('updateEvents', event0);
			// $.each(event0, function(ind, item) {
			// 	$('#calendar').fullCalendar('updateEvent', event);
			// });
		});
	}
	static btnDelBok_click(e) {
		var event = Calendar.getEventModalValue();
		Booking.deleteBooking(event, function() {
			$('#calendar').fullCalendar('refetchEvents');
			// $('#calendar').fullCalendar('removeEvents', [event0]);
		});
	}

	static btnSearch_click(e) {
		var msg = "Searching.....";
		alert(msg);
	}
}

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
		$("#allResoure").click(function(e) {
			var isCheck = $(this).prop("checked");
			if (isCheck) {
				$("input[data-resource='cb']").each(function(ind, item) {
					$(this).prop("checked", isCheck);
				});
			}
			$('#calendar').fullCalendar('refetchEvents');
		});

		// 處理個別資源核取方塊
		$("input[data-resource='cb']").click(function(e) {
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
		var $dvCheck = $('<div class="checkbox-inline"><label><input type="checkbox" data-resource="cb"><span id="' + resource.Resource + '">' + resource.Resource + '</span></label></div>');
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
		$.each($('input:checked[data-resource="cb"]'), function(ind, item) {
			ress.push($(item).next("span").text());
		});
		return ress;
	}

	// 取得所有的 Resource 清單 - 資料庫 (select)
	refreshResources(callback) {
		var th = this;
		$.ajax({
			type: "get",
			url: "/booking/Resources"
		}).then(function (data) {
			th.resources = JSON.parse(data);
			if (callback)
				callback();
		});
	}

	// 修改一個 Resource - 資料庫 (update)
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

	// 刪除一個 Resource - 資料庫 (delete)
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

	// 變更一個 紀錄 的時間 - 資料庫 (呼叫 Booking)
	static eventResize(event, delta, revertFunc) {
		Booking.updateBooking(event, function(events) {
			if (events.lenght <= 0) {
				revertFunc();
				return;
			}
			// $('#calendar').fullCalendar('updateEvents', events);
		});
	}

	// 變更一個 紀錄 的時間 - 資料庫 (呼叫 Booking)
	static eventDrop(event, delta, revertFunc) {
		Booking.updateBooking(event, function(events) {
			if (events.lenght <= 0) {
				revertFunc();
				return;
			}
			// $('#calendar').fullCalendar('updateEvents', events);
		});
	}

	// 顯示修改紀錄的對話框，呼叫 showEventModal
	static eventClick(event) {
		// var e = event;
		Calendar.showEventModal(event);
	}

	// 顯示新增紀錄的對話框，呼叫 showEventModal
	static select(start, end) {
		var event = {start: start, end: end,};
		Calendar.showEventModal(event);
	}

	// 紀錄修改對話框的資源下拉選單
	static setEventModalColorList() {
		$('#bookingResourceDropdown > li').click(function(e) {
			e.preventDefault();
			var resid = $(this).text();
			var color = $(this).data("color");
			$('#bookingResource').val(resid);
			$('#bookingColor').val(color);
		});
	}

	// 顯示紀錄的對話框
	static showEventModal(event) {
		var resources = [];
		var ro = new Resources();

		// 從資料庫重新取得資源清單，將之加入資源下拉選單中 -- 注意，這裡可能會有資料同步的問題
		ro.refreshResources(function() {
			resources = ro.resources;
			$('#bookingResourceDropdown > li').remove();
			$.each(resources, function(ind, item) {
				$('#bookingResourceDropdown').append('<li data-color="' + item.Color + '"><a href="#">' + item.Resource + '</a></li>')
			});
			Calendar.setEventModalColorList();
		});

		$('#bookingId').val(event.id);
		$('#bookingName').val(event.title);
		$('#bookingCont').val(event.desc);
		$('#bookingResource').val(event.useResource);
		$('#bookingColor').val(event.backgroundColor);
		$('#bookingDateStr').data("DateTimePicker").date(moment(event.start));
		$('#bookingDateEnd').data("DateTimePicker").date(moment(event.end));

		if (event.id) {
			$('#modalBookingLabel').text("修改紀錄")
			$('#btnDelBok').show();
			$('#btnInsBok').hide();
			$('#btnMdyBok').show();
		} else {
			$('#modalBookingLabel').text("新增紀錄")
			$('#btnDelBok').hide();
			$('#btnInsBok').show();
			$('#btnMdyBok').hide();
		}
		$("#modalBooking").modal("show");
	}

	static getEventModalValue() {
		var event = {
			id: $('#bookingId').val(),
			title: $('#bookingName').val(),
			desc: $('#bookingCont').val(),
			useResource: $('#bookingResource').val(),
			backgroundColor: $('#bookingColor').val(),
			start: $('#bookingDateStr').data("DateTimePicker").date(),
			end: $('#bookingDateEnd').data("DateTimePicker").date(),
		};
		return event;
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
		var booking = {
			Id: event.id,
			Name: event.title,
			Cont: event.desc,
			Resource: event.useResource,
			DateStr: moment(event.start).format("YYYY-MM-DD HH:mm:ss"),
			DateEnd: moment(event.end).format("YYYY-MM-DD HH:mm:ss"),
			Color: event.backgroundColor,
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

	static insertBooking(event, callback) {
		var booking = Booking.genBooking(event);
		var dataToServer = {Booking: booking,};
		$.ajax({
			url: '/booking',
			type: 'post',
			data: JSON.stringify(dataToServer),
			contentType: "application/json; charset=utf8",
		}).then(function(data, status) {
			var bookings = JSON.parse(data);
			var ret = Booking.genEvents(bookings);

			if(callback) {
				callback(ret);
			}		
		});
	}

	static updateBooking(event, callback) {
		var booking = Booking.genBooking(event);
		var dataToServer = {Booking: booking,};
		$.ajax({
			url: '/booking',
			type: 'put',
			data: JSON.stringify(dataToServer),
			contentType: "application/json; charset=utf8",
		}).then(function(data, status) {
			var bookings = JSON.parse(data);
			var ret = Booking.genEvents(bookings);

			if(callback) {
				callback(ret);
			}		
		});
	}

	static deleteBooking(event, callback) {
		var dataToServer = {Id: event.id,};
		$.ajax({
			url: '/booking',
			type: 'delete',
			data: JSON.stringify(dataToServer),
			contentType: "application/json; charset=utf8",
		}).then(function(data, status) {
			var ret = JSON.parse(data);

			if (ret.rbsResult == "success") {
				if(callback) {
					callback();
				}
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
