function likeCake(product_id){
	$.post("/productapi/like", {product_id:product_id},
		    function(data){
	    	    if(data.status.code == '1') {
                    $("#like-icon").html(data.info.favorite_count);
	    	    	return;
	        	}
		    });
}

function addShoppingcar(product_id,count,price,spec,callbackid){
	$.post("/shoppingcarapi/add", {product_id:product_id,count:count,price:price,spec:spec},
		    function(data){
	    	    if(data.status.code != '1') {
                        if(data.status.code=='9') {
                            window.location.href= '/user/login';
                        }else{
                            alert(data.status.message);
                        }
                    
	    	    	return;
	        	}else{
	        		if(callbackid!='') {
	        			$(callbackid).html(data.info.count);
	        		}
	        		//if($(".mesgDiv")!=undefined) {
	        		//	$(".mesgDiv").removeClass("hidden");
	        		//}
	        		//$("#show_box").click(function(){
	        		//$("#p_shadow").css('display','block');
	        		//$("#p_popbox").fadeIn('slow');
	        		//});
	        		//alert("添加成功");
	        	}
		    });
}

function login() {
	$.post("/userapi/login", {username: $("#telNo").val(), password: $("#pwd").val(), qrcode: $("#qrcode").val()},
	    function(data){
    	        if(data.status.code != '1') {
    	    	    alert(data.status.message);
                    return;
        	}
                if(data.info.redirect != '') {
                    window.location.href = data.info.redirect;
                    return;
                }
                
        	window.location.href = '/index/index';
	    });
}

function register() {
	$.post("/userapi/register", {username: $("#telNo1").val(), password: $("#pwd1").val(), invite_code: $("#invite_code").val(),qrcode: $("#qrcode").val(),telCode: $("#telCode").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
                return;
        	}else{
        	    alert(data.status.message);
                    if(data.info.redirect != '') {
                        window.location.href = data.info.redirect;
                        return;
                    }
        	}
        	window.location.href = '/index/index';
	    });
}

function shareCoupon() {
	$.post("/userapi/sharecoupon", {},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
                return;
        	}
        	//window.location.href = '/index/index';
	    });
}

var icounter = 0;
var iintval = null;
function sendVerifycode() {
	if(icounter>0) {
		return false;
	}
	icounter = 60;
	
	if ($("#telNo").val().length != 11) {
        $("#step2").find(".errorMesg").html("请输入正确的手机号码");
        setTimeout(function () {
            $("#step2").find(".errorMesg").html("");
        }, 2000);
        return;
    }
	
	iintval = setInterval("counttime()",1000);
	
	$.post("/appapi/sendverifycode", {mobile: $("#telNo").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
                return;
        	}
        	//window.location.href = '/index/index';
	    });
}

function counttime() {
	if(icounter>0) {
		icounter--;
		$(".changeCode").html(icounter);
		if(icounter==0) {
			clearInterval(iintval);
			$(".changeCode").html("点击发送");
		}
	}
}

function checkVerifycode() {
	if ($("#telNo").val().length == 0) {
        $("#step2").find(".errorMesg").html("请输入手机号码");
        setTimeout(function () {
            $("#step2").find(".errorMesg").html("");
        }, 2000);
        return;
    }
	if ($("#telCode").val().length == 0) {
        $("#step2").find(".errorMesg").html("请输入短信验证码");
        setTimeout(function () {
            $("#step2").find(".errorMesg").html("");
        }, 2000);
        return;
    }
	$.post("/appapi/checkverifycode", {mobile: $("#telNo").val(), code: $("#telCode").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	//alert(data.status.message);
    	    	$("#step2").find(".errorMesg").html(data.status.message);
    	        setTimeout(function () {
    	            $("#step2").find(".errorMesg").html("");
    	        }, 2000);
                return;
        	}else{
        		$(".enableStep").removeClass("enableStep");
                $("#tdStep3").addClass("enableStep");
                $("#step2").hide();
                $("#step3").show();
        	}
        	//window.location.href = '/index/index';
	    });
}

function resetpass() {
	$.post("/userapi/resetpass", {mobile: $("#telNo").val(), code: $("#telCode").val(), pass: $("#pwd").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	//alert(data.status.message);
    	    	$("#step3").find(".errorMesg").html(data.status.message);
    	        setTimeout(function () {
    	            $("#step3").find(".errorMesg").html("");
    	        }, 2000);
                return;
        	}else{
        		$(".enableStep").removeClass("enableStep");
                $("#tdStep4").addClass("enableStep");
                $("#step3").hide();
                $("#step4").show();
        	}
        	//window.location.href = '/index/index';
	    });
}

function delShoppingcar(ids) {
	$.post("/shoppingcarapi/muldelete", {ids: ids},
	    function(data){
    	    if(data.status.code == '1') {
    	    	var price = $(".cakeItemSel").find(".money").attr("money");
                var resMoney = $(".resMoney").attr("money");
                //resMoney = parseInt(resMoney);
                //price = parseInt(price);
                //resMoney -= price;
                //$(".resMoney").attr("money", resMoney);
                //$(".resMoney").html("￥" + resMoney);
                //$(".cakeItemSel").remove();
        	}
	    });
}

function couponCallback(code) {
	$.post("/couponapi/couponcallback", {invite_code:code},
	    function(data){
		    //alert(data.status.message);
	    });
}

function minusNum(car_id, count) {
	$.post("/shoppingcarapi/minusproductcount", {car_id:car_id, count: count},
	    function(data){
		    //alert(data.status.message);
	    });
}

function addNum(car_id, count) {
	$.post("/shoppingcarapi/addproductcount", {car_id:car_id, count: count},
	    function(data){
		    //alert(data.status.message);
	    });
}

function addAddress() {
	var address = $("#province option:selected").text() + ',' + $("#city option:selected").text() + ',' + $("#country option:selected").text();
	$.post("/shoppingcarapi/addaddr", {address: address, street: $('#street').val(), building: $('#building').val(), layer: $('#layer').val(), house:$("#house").val(), tel_name: $('#tel_name').val(),tel: $('#tel').val(),addr_id: $("#addr_id").val(), area: $("#area").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
                return;
        	}
    	    var returnurl = $("#returnurl").val();
    	    returnurl = Base64.decode(returnurl);    	    
    	    if(returnurl != '') {
    	    	window.location.href = returnurl + "&addr_id=" + data.info.id;
    	    	return;
        	}
            
        	window.location.href = '/user/addrlist';
	    });
}

function deleteAddress(addr_id) {
	//if(!confirm("确定删除吗？")) {
    //    return false;
	//}
	
	$.post("/userapi/deladdr", {addr_id: addr_id},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
                return;
        	}
        	//window.location.href = '/user/addrlist';
	    });
}

function delbyproduct(id) {
	$.post("/shoppingcarapi/delbyproduct", {product_id: id},
	    function(data){
    	    if(data.status.code != '1') {
    	    	alert(data.status.message);
        	}
	    });
}

function clearShoppingcar() {
    $.post("/shoppingcarapi/clear", {},
        function(data){
        if(data.status.code == '1') {
            //var price = $(".cakeItemSel").find(".money").attr("money");
            //var resMoney = $(".resMoney").attr("money");
            //resMoney = parseInt(resMoney);
            //price = parseInt(price);
            //resMoney -= price;
            //$(".resMoney").attr("money", resMoney);
            //$(".resMoney").html("￥" + resMoney);
            //$(".cakeItemSel").remove();
            }
        });
}