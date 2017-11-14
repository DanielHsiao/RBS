var resObj;
// var bookings = [];
// var bookingFiltes = [];

$(function() {

	resObj = new Resources($("#resourceTable"));
	resObj.refreshResources();

	// 取得所有的 Resource 清單
	// $.ajax({
	// 	type: "get",
	// 	url: "/booking/Resources"
	// }).then(function (data) {
	// 	// console.log(data);
	// 	var resObjs = JSON.parse(data);
	// 	// console.log(resObjs);
	// 	resources = resObjs;
	// 	genResources(resObjs);
		
	// 	// 處理個別資源核取方塊
	// 	$("input[data-resource='cb']").click(function(o, e){
	// 		var isCheck = $(this).prop("checked");
	// 		if(!isCheck) {
	// 			$("#allResoure").prop("checked", isCheck);
	// 		}
	// 		displayBooking();
	// 	});
	// 	$("#allResoure").trigger("click");
	// });

	// $('#calendar').fullCalendar('addEventSource', function(start, end, timezone, callback) {
	// 	var dts = start.format("YYYY-MM-DD HH:mm:ss");
	// 	var dte = end.format("YYYY-MM-DD HH:mm:ss");
	// 	var dataToServer = genParams(dts, dte);
	// 	$.ajax({
	// 		url: '/booking',
	// 		type: 'get',
	// 		data: dataToServer,
	// 	}).then(function (result, status) {
	// 		bookings = JSON.parse(result);
	// 		var events = displayBooking();
	// 		// displayBooking();
	// 		callback([]);
	// 	});
	// });

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
});

class Resources {
	constructor(table) {
		this.resources = [];
		this.table = table;
	}

	// 取得所有的 Resource 清單
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

	// 產生一批資源按鈕 - 清除，再充新產生
	genResourcesInTable() {
		var th = this;
		$.each($("tr[data-resource='tr']"), function(ind, ele) {
			ele.remove();
		});

		$.each(this.resources, function(ind, val) {
			th.genResourceTr(val).appendTo(th.table);
		});

		// 處理個別資源核取方塊
		$("input[data-resource='cb']").click(function(o, e) {
			var isCheck = $(this).prop("checked");
			if(!isCheck) {
				$("#allResoure").prop("checked", isCheck);
			}
		});

		$("#allResoure").trigger("click");
	}

	// 產生一批資源按鈕 - 清除，再充新產生
	genResourceTr(resource){
		// console.log(resource);
		var $tr = $('<tr data-resource="tr"></tr>');
		var $td = $('<td></td>');
		$tr.append($td);

		var $spColor = $('<span class="badge" style="background-color:' + resource.Color + '">&nbsp;</span>');
		var $dvCheck = $('<div class="checkbox-inline"><label><input type="checkbox" id="' + resource.Resource + '" data-resource="cb">' + resource.Resource + '</label></div>');
		var $spBtnGp = $('<span class="btn-group pull-right" role="group" aria-label="' + resource.Resource + '"></span>');
		$td.append($spColor);
		$td.append('&nbsp;');
		$td.append($dvCheck);
		$td.append($spBtnGp);
		
		var $btnDel = $('<button type="button" class="btn btn-link btn-xs" data-resourceDel="' + resource.Resource + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
		var $btnMdy = $('<button type="button" class="btn btn-link btn-xs" data-resourceMdy="' + resource.Resource + '"><span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span></button>');
		$spBtnGp.append($btnDel);
		$spBtnGp.append($btnMdy);

		// 按鈕"刪除"的操作
		$btnDel.click(function(o, e) {
			var dataToServer = {Resource: resource.Resource};
			$.ajax({
				type: "delete",
				url: "/booking/Resource",
				data: JSON.stringify(dataToServer),
				contentType: "application/json; charset=utf8",
			}).then(function (data, status) {
				var ret = JSON.parse(data);
				if (ret.rbsResult == "success") {
					$tr.remove();
				}
			});
		});

		// 按鈕"修改"的操作
		$btnMdy.click(function(o, e) {
			
		});

		return $tr;
	}

	getDisplayResources() {
		var ress = [];
		$.each($('input:checked[data-resource="cb"]'), function(ind, cb) {
			ress.push(cb.id);
		});
		return ress;
	}
}

function displayBooking() {
	// $("#calendar").fullCalendar('renderEvents', []);
	// var ress = resObj.getDisplayResources();
	// var events = [];
	// $.each(bookings, function(ind, booking) {
	// 	if ($.inArray(booking.Resource, ress) <= -1)
	// 		return;
	// 	var event = {
	// 		id: booking.Id,
	// 		title: booking.Name,
	// 		start: booking.DateStr,
	// 		end: booking.DateEnd,
	// 		backgroundColor: booking.Color,
	// 		desc: booking.Cont,
	// 		editable: true,
	// 	};
	// 	events.push(event);
	// 	$("#calendar").fullCalendar('renderEvent', event);
	// });
	// bookingFiltes = events;
	// // $.each(events, function(ind, event) {
		
	// // });
	// //$('#calendar').fullCalendar('updateEvents', events);
	// //$('#calendar').fullCalendar('rerenderEvents');
	// return events;
}

function genParams(start, end) {
	var data = {
		DateStr: start,
		DateEnd: end,
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
