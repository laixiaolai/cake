function likeCake(product_id){
	$.post("/productapi/like", {product_id:product_id},
		    function(data){
	    	    if(data.status.code == '1') {
                    $("#like-icon").html(data.info.favorite_count);
	    	    	return;
	        	}
		    });
}

function addShoppingcar(product_id,count,price,spec,buy){
    $.post("/shoppingcarapi/add", {product_id:product_id,count:count,price:price,spec:spec},
        function(data){
        if(data.status.code != '1') {
            if(data.status.code=='9') {
                window.location.href= '/index/login';
            }else{
                alert(data.status.message);
            }
            return;
            }else{
                if(buy == '1') {
                    window.location.href= '/order/order';
                }
            }
        });
}

function login() {
    $.post("/userapi/login", {username: $("#mobile").val(), password: $("#password").val()},
        function(data){
            if(data.status.code != '1') {
                alert(data.status.message);
                return;
            }
 
            if(data.info.redirect != '' && data.info.redirect!=undefined) {
                window.location.href = data.info.redirect;
                return;
            }

            window.location.href = '/index/index';
        });
}

function register() {
	$.post("/userapi/register", {username: $("#mobile").val(), password: $("#pwd1").val(), code: $("#code").val()},
	    function(data){
    	    if(data.status.code != '1') {
    	    	    alert(data.status.message);
                    return;
        	}else{
        	    alert(data.status.message);
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
    var mobile = $("#mobile").val();
    if(validatemobile(mobile) == false) {
        alert("请输入正确的手机号码");
        return;
    }
    
    if(icounter>0) {
        return false;
    }
    icounter = 60;
	
    iintval = setInterval("counttime()",1000);

    $.post("/appapi/sendverifycode", {mobile: $("#mobile").val()},
        function(data){
            if(data.status.code != '1') {
                alert(data.status.message);
                clearInterval(iintval);
		$("#sendcode").html("发送短信验证码");
                return;
            }
        });
}

function counttime() {
    if(icounter>0) {
        icounter--;
        $("#sendcode").html(icounter);
        if(icounter==0) {
                clearInterval(iintval);
                $("#sendcode").html("发送短信验证码");
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
        	}
	    });
}

function delShoppingcarproduct(pid) {
	$.post("/shoppingcarapi/delbyproduct", {product_id: pid},
	    function(data){
    	    if(data.status.code == '1') {
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
	var province = $("#province").val();
        var city = $("#city").val();
        var country = $("#country").val();
        var street = $("#street").val();
        var tel_name = $("#tel_name").val();
        var tel = $("#tel").val();
        var address =  province+','+city+','+country;
        var aid = $("#aid").val();
        
	$.post("/shoppingcarapi/addaddr", {address: address, street: street, tel_name: tel_name,tel: tel,addr_id: aid},
	    function(data){
                if(data.status.code != '1') {
                    alert(data.status.message);
                    return;
                }
                
                $(".address").each(function () {
                    $(this).removeClass("addresssel").addClass("addressunsel");
                })
                $("#addressid").val(data.info.id);
                var html='<dl class="address addresssel" id="address'+data.info.id+'" aid="'+data.info.id+'">';
                    html+='<dt><b>'+tel_name+'</b></dt>';
                    html+='<dd><span>'+tel+'</span></dd>';
                    html+='<dt><i>'+address+street+'</i></dt>';
                    html+='<dt class="xg"><a href="javascript:$(\'#fancybox\').click();getAddress('+data.info.id+')">修改</a></dt>'; 
                    html+='<dd class="sc"><a href="javascript:void(0)" onclick="deleteAddress('+data.info.id+');"><img src="http://danggao.cn/resource/images/sc.jpg" alt=""/></a></dd>';
                    html+='</dl>';
                if(aid=='0') {
                    $("#addresslist").before(html);
                     $("#fancybox-close").click();
                    return;
                }
                $(".address").each(function () {
                   if($(this).attr("aid") == data.info.id) {
                       //$("#addresslist").replaceChild(html,$(this));
                       $(this).before(html);
                       $(this).remove();
                   }
                })
                
                $("#fancybox-close").click();
                //$("#addresslist").before(html);
	    });
            
}

function deleteAddress(addr_id) {
     if(!confirm("确定删除吗？")) {
         return false;
    }
	
    $.post("/userapi/deladdr", {addr_id: addr_id},
        function(data){
        if(data.status.code != '1') {
            alert(data.status.message);
            return;
            }
            
            $(".address").each(function () {
                   if($(this).attr("aid") == addr_id) {
                       $(this).remove();
                   }
                })
                $("#fancybox-close").click();
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


function validatemobile(mobile) 
{
    if(mobile.length==0) 
    { 
       return false;
    }
    if(mobile.length!=11) 
    {
        return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if(!myreg.test(mobile)) 
    {
        return false;
    }
    return true;
}


function getAddress(aid) {
    if(aid==0) {
        $("#country").val('');
        $("#street").val('');
        $("#tel").val('');
        $("#tel_name").val('');
        $("#aid").val('0');
        return;
    }
    
    $.post("/userapi/getaddress", {aid: aid},
        function(data){
            if(data.status.code == '1') {
                $("#province").val(data.info.province);
                $("#city").val(data.info.city);
                $("#street").val(data.info.address);
                $("#country").val(data.info.country);
                $("#tel").val(data.info.tel);
                $("#tel_name").val(data.info.tel_name);
                $("#aid").val(data.info.id);
            }
        });
}

function getCoupon() {
    var sn = $("#sn").val();
    if(sn == '') {
        alert("请输入兑换码");
        return;
    }
    
    $.post("/userapi/getcoupon", {sn: sn},
        function(data){
            if(data.status.code != '1') {
                alert(data.status.message);
                return;
            }
            $("#couponid").val(data.info.couponid);
            $("#couponamt").html('-￥'+data.info.amt);
            $("#couponid").attr("amt",data.info.amt);
            calcaluate();
            alert("使用成功");
            
        });
}

function getAddress2(aid) {
    $("#aid").val(aid);
    $.post("/userapi/getaddress", {aid: aid},
        function(data){
            if(data.status.code == '1') {
                $("#province").val(data.info.province);
                $("#city").val(data.info.city);
                $("#street").val(data.info.address);
                $("#country").val(data.info.country);
                $("#tel").val(data.info.tel);
                $("#tel_name").val(data.info.tel_name);
                $("#aid").val(data.info.id);
            }
        });
}

function editAddress() {
	var province = $("#province").val();
        var city = $("#city").val();
        var country = $("#country").val();
        var street = $("#street").val();
        var tel_name = $("#tel_name").val();
        var tel = $("#tel").val();
        var address =  province+','+city+','+country;
        var aid = $("#aid").val();
        
	$.post("/shoppingcarapi/addaddr", {address: address, street: street, tel_name: tel_name,tel: tel,addr_id: aid},
	    function(data){
                if(data.status.code != '1') {
                    alert(data.status.message);
                    return;
                }
                
                var html='<dl class="address addresssel" id="address'+data.info.id+'" aid="'+data.info.id+'">';
                    html+='<dt><b>'+tel_name+'</b></dt>';
                    html+='<dd><span>'+tel+'</span></dd>';
                    html+='<dt><i>'+address+street+'</i></dt>';
                    html+='<dt class="xg"><a href="javascript:$(\'#fancybox\').click();getAddress('+data.info.id+')">修改</a></dt>'; 
                    html+='<dd class="sc"><a href="javascript:void(0)" onclick="deleteAddress('+data.info.id+');"><img src="http://danggao.cn/resource/images/sc.jpg" alt=""/></a></dd>';
                    html+='</dl>';
                
                $(".address").each(function () {
                   if($(this).attr("aid") == data.info.id) {
                       $(this).html("地址："+tel_name+'/'+tel+'/'+address+street);
                   }
                })
                $("#fancybox-close").click();
	    });
            
}

function kuaisuzhaohui() {
    $.post("/userapi/resetpass", {username: $("#mobile").val(), password: $("#pwd1").val(), code: $("#code").val()},
        function(data){
        if(data.status.code != '1') {
                alert(data.status.message);
                return;
            }else{
                alert(data.status.message);
            }
            window.location.href = '/index/login';
        });
}


function fanye(f) {
    var page = parseInt($("#page").val());
    if(f == '-1') {
        if(page<=1) {
            return;
        }
        --page;
    }else{
        ++page;
    }
    
    $.get("/productapi/pagelist", {page: page},
        function(data){
        if(data.status.code != '1') {
                alert(data.status.message);
                return;
            }
            if(parseInt(data.info.count)<=1) {
                return;
            }
            var html = '';
            
            for(var i=0;i<data.info.count;i++) {
                var lic = 'pic01';
                if(i>=3) {
                    lic = 'pic02';
                }
                var pricearr = data.info.list[i].price.split('/');
                html +='<li class="'+lic+'"><a href="/index/product?id='+data.info.list[i].id+'"><img src="'+data.info.list[i].cover+'" width="250" height="200"  alt=""/></a><span><img src="http://danggao.cn/resource/images/icon01.jpg" alt=""/></span>';
                html +='<h2><a href="/index/product?id='+data.info.list[i].id+'">'+data.info.list[i].product_name+'</a></h2><h3>￥'+pricearr[0]+'</h3>';
                html +='</li>';
            }
            $("#productlist").html(html);
            $("#page").val(page);
            
        });
}

function qypj() {
    var company_name = $("#name").val();
    var address = $("#address").val();
    var count = $("#count").val();
    var username = $("#username").val();
    var mobile = $("#mobile").val();
    
    $.post("/shichiapi/qyapply", {company_name: company_name,user_count:count,company_address:address,reserve_name:username,tel:mobile},
        function(data){
        if(data.status.code != '1') {
                alert(data.status.message);
                return;
            }
            alert("申请成功!");
            window.location.href = '/index/index';
            
        });
}

function alipay(orderno) {
    window.location.href = '/pay/alipaysubmit/?orderno='+orderno;
}