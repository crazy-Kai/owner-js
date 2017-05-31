define(function(require, exports, module) {

	//依赖
	var $ = require('$');
	var	Validator = require('common/validator');

	var Paginator = require('model/paginator/main');
	var	SearchList = require('model/searchList/main');

	//组件:分页
	var  paginator = new Paginator({element: '#paginator'});

	//组件:查询列表
	var heroSearchList = new SearchList({
		element: '#searchList'
	});


	var deleteUrl = "test1Rpc/delete.json";
	var addUrl = "test1Rpc/add.json";

	var validatorExp = new Validator({
        element: '#hero-form',
        failSilently: true
    });
    validatorExp.addItem({
        element: '[id=heroName]',
        required: true
    })
    .addItem({
        element: '[id=heroPower]',
        required: true,
    })
    .addItem({
        element: '[id=heroStatus]',
        required: true
    });

	$("#addHeroBtn").click(function(){
		console.log( formValidation() );
		
		$.ajax({
			url:addUrl,
			data:{
				LassenSwardmanDo:JSON.stringify(getHeroInfo())
			},
			beforeSend:function(xhr){
				return formValidation();
			},
			success:function(msg){
				$('#heroModal').modal('hide');
				heroSearchList.searchListReload();
			},
			error:function(msg){
				alert(msg);
			}
		});
		
	});

	$('#modal_add').click(function(){
		$("#heroName").val("");
		$("#heroPower").val("");
		$("#heroStatus").val('');
		validatorExp.clearError();
		$('#heroModal').modal('show');
		
	});

	$('#searchBtn').click(function(){
		heroSearchList.searchListReload();
	});

	function formValidation(){
		var valiVal = false;
		validatorExp.execute(function(flag, element){
    		if(flag){
    			valiVal = false;
    		}else{
    			valiVal = true;
    		}
    	});
		return valiVal;
	}

	function getHeroInfo(){
		var name = $("#heroName").val();
		var power = $("#heroPower").val();
		var status = $("#heroStatus").val();
		var heroInfo = {
			name : name,
			power : power,
			status : status
		}
		return heroInfo;
	}

});