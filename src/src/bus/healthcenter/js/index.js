var PAGE_SIZE = 10;
var UNFINISHED = {
    index: 0,
    param: {
        status: "unfinished",
        pageSize: PAGE_SIZE,
        currentPage: 1
    }
};
var FINISH = {
    index: 1,
    param: {
        status: "finish",
        pageSize: PAGE_SIZE,
        currentPage: 1
    }
};
var CASE_STATUS_MAP = {
    "submit": "已提交",
    "audit": "立案审核",
    "correction": "立案补正",
    "cased": "已立案",
    "allot_case": "分案",
    "put_proof": "举证",
    "oppugn_proof": "质证",
    "wait_trial": "等待庭审",
    "trial_ing": "庭审",
    "wait_decision": "待判决",
    "sentenced": "已判决",
    "bring_up_objection": "被告提起管辖异议",
    "objection_to_jurisdiction": "原告提起撤诉",
    "dropped": "原告已撤诉",
    "jurisediction_objection": "管辖异议成立",
    "conciliate": "和解",
    "not_accepted": "不予受理",
    "not_be_served": "被告无法送达",
    "cancel_apply": "撤销申请",
    "return": "退回",
    "unpaid_dropped": "未缴费撤诉"
};

var REQUEST_TYPE_MAP = {
    "refund_ten": "退一赔十",
    "refund_three": "退一赔三",
    "refund_one": "退一赔一",
    "ten_times": "十倍赔偿",
    "three_times": "三倍赔偿",
    "other": "其他",
    "stop_infringement": "停止侵害",
    "eliminate_effects": "消除影响",
    "amends_apology": "赔礼道歉",
    "pay_loss": "赔偿损失",
    "loan_principal": "借款本金",
    "interest": "利息",
    "penalty": "违约金",
    "open_dq": "公开道歉",
    "creditCard": "信用卡(花呗)",
    "loan": "贷款",
    "privateLending": "民间借贷"
};
var URL = window.pageData ? window.pageData.url : "/data/data.txt";
$(function() {
    var $statusDetailDivs = $(".status-detail");
    var $dataContainers = $(".data-container");
    var $finishCount = $("#finish-count");
    var $unfinishedCount = $("#unfinished-count");
    var $dataDiv = $("#data-main");
    var $dataTabsUl = $dataDiv.find("ul").eq(0);
    var $dataTabs = $dataTabsUl.find("li");
    var $dataTables = $dataDiv.find("table");
    var $paginations = $(".pages");
    var $modal = $("#modal");
    var opts = {
        url: URL,
        tabs: $dataTabs,
        containers: $dataContainers,
        tables: $dataTables,
        paginations: $paginations,
        dataDiv: $dataDiv,
        modal: $modal,
        unfinishedCount: $unfinishedCount,
        finishCount: $finishCount,
        pageSize: PAGE_SIZE,
        triggerCls: ".modal-trigger",
        modalCloseCls: ".modal-close",
        modalConfirmCls: ".modal-confirm",
        statusDetailDivs: $statusDetailDivs
    };
    getData(opts, UNFINISHED);
    initModal(opts);
});


function getData() {
    var args = [].slice.call(arguments);
    args.unshift({});
    var options = $.extend.apply(null, args);
    $.get(options.url, options.param, function(data) {
        var page = JSON.parse(data);
        var totleCount = getMainCount(page, options);
        if(!totleCount){
            $("#handbooktwo").css("display","inline-block");
        }
        fillDataMain(page, options);
    });
}
//data-detail render

function fillDataMain(page, options) {
    var finishCount = +page["finishCount"];
    var unfinishedCount = +page["unfinishedCount"];
    var mainCount = finishCount + unfinishedCount;
    if (!mainCount)
        return;
    if (!fillDataMain.filled) {
        _fillTab(page);
        _change(options.tabs, options.containers);
        fillDataMain.filled = true;
    }
    if (!unfinishedCount && finishCount && !fillDataMain.autoChanged) {
        options.tabs.eq(1).trigger("click");
        fillDataMain.autoChanged = true;
    }
    if (!fillDataMain[options.param.status]) {
        _fillPagination(page);
        fillDataMain[options.param.status] = true;
    }
    _fillTable(page);


    options.dataDiv.show();


    function _fillTab() {
        options.tabs.eq(0).find("span").text(unfinishedCount);
        options.tabs.eq(1).find("span").text(finishCount);
    }

    function _fillTable() {
        var data = page.datas;
        var doMainName = page.yunCourtDoMainName;
        var imgDoMainName = page.imgDoMainName;
        var count = data && data.length;
        if (!count) {
            return _hideDataContainer(options.index);
        }
        var $tbody = options.tables.eq(options.index).find("tbody");
        var dataIndex = 0;
        $tbody.html("");
        $.each(data, function(k, v) {
            if (v != null) {
                var orderList = resolveObj(v, "disputeOrderList")[0];
                var entityList = resolveObj(v, "lassenEntityList");
                // var basisdo = resolveObj(v, "lassenLegalBasisDo");
                var receiveConfirm = resolveObj(v, "lassenReceiveConfirm");
                var requestList = resolveObj(v, "lassenSuitRequestList");
                var submitTime = formatDate(v.submitTime);
                var filingTime = formatDate(v.filingTime);
                var account = _getAccuser(entityList);
                var title = resolveObj(v, "title");
                var $tr = $("<tr/>");
                //generate html string but i do not think this is a good way
                $tr.append("<td class=\"first-td\"> <p class=\"title\">" + title + "</p>" + "<p class=\"case-num\">案号: <span>" + resolveObj(v, "caseCode") + " </span></p> </td> <td>" + resolveObj(account, "accuser") + "</td> <td>" + resolveObj(v, "amount") + "元 </td> <td>" + submitTime + "</td> <td>" + filingTime + "</td> <td>" + CASE_STATUS_MAP[v.status] + "</td> <td class=\"last-td\"><a href=\"javascript:void(0)\" data-index=\"" + dataIndex++ + "\" class=\"modal-trigger\">展开详情</a></td>");
                $tbody.append($tr);
                //bind current data to current tr,than i can get them 
                $tr.data("obj", {
                    account: account,
                    submitTime: submitTime,
                    filingTime: filingTime,
                    receiveConfirm: receiveConfirm,
                    requestList: requestList,
                    orderList: orderList,
                    title: title,
                    caseCode: v.caseCode,
                    status: v.status,
                    amount: v.amount,
                    caseNumber: v.caseNumber,
                    doMainName: doMainName,
                    securityCaseId: v.securityCaseId,
                    imgDoMainName: imgDoMainName

                });
            }
        });
        //add click event handler to links in tables
        $tbody.on("click", options.triggerCls, function(e) {
            var obj = $(e.target).parent().parent().data("obj");
            initModal.fillModal(obj);
            options.modal.fadeIn("fast");
        });

        function _getAccuser(array) {
            var accuser = [],
                accused = [],
                positionMap = { "1": "被告一：", "2": "被告二：", "3": "被告三：", "4": "被告四：" },
                pos;
            $.each(array, function(i, obj) {
                if (obj.entityRole && obj.entityRole === "accuser") {
                    if (obj.entityType === "legal")
                        accuser.push(obj.companyName);
                    else if (obj.entityType === "normal")
                        accuser.push(obj.name);
                } else if (obj.entityRole && obj.entityRole === "accused") {
                    pos = obj.entityPosition;
                    if (obj.entityType === "legal") {
                        accused.push(positionMap[pos] + obj.companyName);
                    } else if (obj.entityType === "normal") {
                        accused.push(positionMap[pos] + obj.name);
                    }
                }
            });
            return {
                accused: accused.join("<br/>"),
                accuser: accuser.join(" ")
            };
        }
    }

    function _fillPagination() {
        var count = options.index ? finishCount : unfinishedCount;
        var pageNum = Math.ceil(count / options.pageSize);
        var $pagination = options.paginations.eq(options.index);
        var $pre = $pagination.find(".pre");
        var $next = $pagination.find(".next");
        var $jump = $pagination.find(".jump-btn");
        var $target = $pagination.find(".current-page").find("input");
        var $total = $pagination.find(".total-page").find("span");
        var $page;
        _genPageButton(1, options.pageSize);
        $total.html(pageNum);


        $pagination.on("click", ".page", function() {
            var $self = $(this);
            var i = $self.html();
            var $ptable = options.tables.eq(options.index);
            var param = $.extend({}, options.param);
            param.currentPage = i;
            $target.val(i);
            getData(options, { param: param });
            toggleActive($page, $self);
            blin($ptable);

        });
        $pre.on("click", function() {
            var $active = $page.filter(".active");
            var $p = $active.prev(".page");
            if ($p.length) {
                $p.trigger("click");
            } else {
                _checkList($active);
            }
        });
        $next.on("click", function() {
            var $active = $page.filter(".active");
            var $n = $active.next(".page");
            if ($n.length) {
                $n.trigger("click");
            } else {
                _checkList($active);
            }
        });
        $jump.on("click", function() {
            var target = +$target.val();
            if(target > pageNum) target = pageNum;
            if(target < 1) target = 1;
            var start = target - target % options.pageSize + 1;
            var eq = target % options.pageSize - 1;
            _genPageButton(start);
            $page.eq(eq).trigger("click");
        });

        function _checkList($p) {
            var n = parseInt($p.text(), 10);
            if (n >= pageNum || n === 1) return;
            var eq = $page.index($p);
            if (eq === 0) {
                _genPageButton(n - options.pageSize);
                $page.eq($page.length - 1).trigger("click");

            } else if (eq === $page.length - 1) {
                _genPageButton(n + 1);
                $page.eq(0).trigger("click");
            }
        }

        function _genPageButton(start, end) {
            $pagination.find(".page").remove();
            if (!start || start < 1) start = 1;
            if (!end) end = start + options.pageSize - 1;
            if (end > pageNum) end = pageNum;

            var $frag = $("<div>");
            for (var i = start; i <= end; i++) {
                if (i === start)
                    $frag.append("<li class=\"active page\">" + i + "</li>");
                else if (i <= end)
                    $frag.append("<li class=\"page\">" + i + "</li>");
            }
            $pre.after($frag.children("li"));
            $frag = null;
            $page = $pagination.find(".page");
        }
    }

    function _change() {
        options.tabs.on("click", function() {
            var $self = $(this);
            var index = $(this).index();
            var param = $.extend({}, index == 0 ? UNFINISHED : FINISH);
            var $container = options.containers.eq(index);
            var $currentPage = $container.find(".page.active");
            var currentPage = $currentPage.text();
            param.param.currentPage = currentPage;
            getData(options, param);
            toggleActive(options.tabs, $self);
            toggleShow(options.containers, index);
        });

    }

    function _hideDataContainer() {
        options.containers.eq(options.index).html("<h3 style=\"text-align:center\">您当前状态下没有案件</h3>");
    }



}
//shop-status render
function getMainCount(page, options) {
    var mainCount = +page["finishCount"] + (+page["unfinishedCount"]);
    _fillCount(page);
    _changeStatusTitle(mainCount);

    function _fillCount(page) {
        options.finishCount.html(page["finishCount"]);
        options.unfinishedCount.html(page["unfinishedCount"]);
    }

    function _changeStatusTitle(count) {
        var hasIssue = !!count;
        options.statusDetailDivs.eq(+hasIssue).show();
        options.statusDetailDivs.eq(+!hasIssue).hide();
    }
    return mainCount;
}
//modal init
function initModal(options) {
    var $tbody = options.modal.find("tbody");
    options.modal.on("click", options.modalCloseCls, function() {
        options.modal.fadeOut("fast", function() {
            $tbody.html("");
        });
    });
    initModal.fillModal = function(v) {
        var confirm = resolveObj(v, "receiveConfirm", "isReceive");
        var request = _genRequestList(v.requestList);
        var link = confirm == "y" ? { text: "确认送达", url: "//" + v.doMainName + "/suit/filing/accusedReceiveConfirm.htm?securityCaseId=" + v.securityCaseId } : { text: "案件详情", url: "//" + v.doMainName + "/caseDetail/caseDetail.htm?tab=indictment&securityCaseId=" + v.securityCaseId };
        var tr1 = "<tr><td class=\"first-td\"> <p class=\"title\">" + resolveObj(v, "title") + "</p>" + "<p class=\"case-num\">案号: <span>" + resolveObj(v, "caseCode") + " </span></p> </td> <td>" + resolveObj(v, "account", "accuser") + "</td> <td>" + resolveObj(v, "amount") + "元 </td> <td>" + resolveObj(v, "submitTime") + "</td> <td>" + resolveObj(v, "filingTime") + "</td> <td>" + CASE_STATUS_MAP[v.status] + "</td> <td class=\"last-td\"><a href=\"javascript:void(0)\" class=\"modal-close\">收起详情</a></td></tr>";
        var tr2 = "<tr class=\"detail\"> <td class=\"first-td\"> <img src=\"" + resolveObj(v, "imgDoMainName") + resolveObj(v, "orderList", "picUrl") + "\" alt=\"\" ><h3>" + resolveObj(v, "orderList", "auctionTitle") + "</h3></td> <td colspan=2> <p>案件编号：<span>" + resolveObj(v, "caseNumber") + "</span></p> <p>" + resolveObj(v, "account", "accused") + "</p> </td> <td colspan=\"3\"> <p>诉讼请求：</p>" + request + " </td> <td class=\"last-td text-left\"><a href=\"" + link.url + "\" target=\"_blank\" class=\"modal-confirm\">" + link.text + "</a></td> </tr>";
        $tbody.html(tr1 + tr2);

        function _genRequestList(arr) {
            var html = "";
            $.each(arr, function(i, v) {
                html += "<div class=\"row\"> <div>" + (i + 1) + "、</div> <div>" + REQUEST_TYPE_MAP[v.requestType] + " " + (v.content || "") + (+v.amount).toFixed(2) + "元</div> </div>";
            });
            return html;

        }
    };

}

function blin($ele) {
    $ele.stop().fadeOut().fadeIn();
}

function toggleActive($eles, $self, cls) {
    $eles.removeClass("active");
    $self.addClass(cls || "active");
}

function toggleShow($eles, index, speed) {
    $eles.hide().eq(index).fadeIn(speed || "fast");
}

function formatDate(timestamp) {
    if (!timestamp) return "---";
    var d = new Date(timestamp);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    return year + "/" + month + "/" + date;
}

function resolveObj(obj) {
    if (!obj || typeof obj !== "object")
        return "---";
    var arg = obj,
        i;
    try {
        for (i = 1; i < arguments.length; i++) {
            arg = arg[arguments[i]];
        }
        if (arg == null)
            return "---";
        return arg;
    } catch (e) {
        return "---";
    }
}
