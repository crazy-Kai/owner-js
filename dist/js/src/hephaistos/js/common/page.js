$(function(){function parseParams(attrs){var rst={};return $.each(attrs,function(index,attr){var name=attr.nodeName,filedName=FIELD_MAP[name];filedName&&(rst[filedName]=attr.nodeValue)}),rst}var CLS_ACTION="page-action",FIELD_MAP={"data-id":"id",title:"title","data-href":"href","data-close":"isClose","data-search":"search","data-mid":"moduleId","data-type":"type"};top.topManager&&$("body").delegate("."+CLS_ACTION,"click",function(ev){var sender=ev.currentTarget,attrs=sender.attributes,params=parseParams(attrs);params.type&&"open"!=params.type?"setTitle"==params.type?top.topManager.setPageTitle(params.title,params.moduleId):(ev.preventDefault(),top.topManager.operatePage(params.moduleId,params.id,params.type)):(top.topManager.openPage(params),ev.preventDefault())}),$(window).on("unload",function(){BUI.Component.Manager.eachComponent(function(component){component.destroy()})})});