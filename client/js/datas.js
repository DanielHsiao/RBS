$(function() {

	var resObj = new Resources($("#resourceTable"));
	resObj.refreshResources();

	$('#calendar').fullCalendar('addEventSource', function(start, end, timezone, callback) {
		var ress = resObj.getDisplayResources();
		Booking.getBookings(start, end, ress, callback);
	});

	// $('#modalDeleteResource').on('show.bs.modal', function(event) {
	// 	var btn = event.relatedTarget;
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
				// item.useResource = resNew;
				// item.backgroundColor = colNew;
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

		$.each(this.resources, function(ind, item) {
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
