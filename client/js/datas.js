$(function() {
	var resources = [];
	var bookings = [];

	$.ajax({
		type: "get",
		url: "/booking/Resources"
	}).then(function (data) {
		// console.log(data);
		var resObjs = JSON.parse(data);
		// console.log(resObjs);
		genResources(resObjs);
		
		// 處理個別資源核取方塊
		$("input[data-resource='cb']").click(function(o, e){
			var isCheck = $(this).prop("checked");
			if(!isCheck) {
				$("#allResoure").prop("checked", isCheck);
			}
		});
	});	
});

// 產生一批資源按鈕 - 清除，再充新產生
function genResources(ResObjs) {
	var $table = $("#resourceTable");
	$.each($("tr[data-resource='tr']"), function(ind, ele) {
		ele.remove();
	});
	$.each(ResObjs, function(ind, val) {
		genResourceTag(val).appendTo($table);
	});
}

// 產生一個資源按鈕
function genResourceTag(ResObj) {
	// console.log(ResObj);
	var $tr = $('<tr data-resource="tr"></tr>');
	var $td = $('<td></td>');
	$tr.append($td);

	var $spColor = $('<span class="badge" style="background-color:' + ResObj.Color + '">&nbsp;</span>');
	var $dvCheck = $('<div class="checkbox-inline"><label><input type="checkbox" id="' + ResObj.Resource + '" data-resource="cb">' + ResObj.Resource + '</label></div>');
	var $spBtnGp = $('<span class="btn-group pull-right" role="group" aria-label="' + ResObj.Resource + '"></span>');
	$td.append($spColor);
	$td.append('&nbsp;');
	$td.append($dvCheck);
	$td.append($spBtnGp);
	
	var $btnDel = $('<button type="button" class="btn btn-link btn-xs" data-resourceDel="' + ResObj.Resource + '"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>');
	var $btnMdy = $('<button type="button" class="btn btn-link btn-xs" data-resourceMdy="' + ResObj.Resource + '"><span class="glyphicon glyphicon-option-vertical" aria-hidden="true"></span></button>');
	$spBtnGp.append($btnDel);
	$spBtnGp.append($btnMdy);

	// 按鈕"刪除"的操作
	$btnDel.click(function(o, e) {
		var dataToServer = {Resource: ResObj.Resource};
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

// genResourceTag 的雛型範本
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
