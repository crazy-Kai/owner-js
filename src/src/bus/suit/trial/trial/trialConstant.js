// 庭审常量
define(function(require, exports, module) {

    // 变量
    var trialConstant = {}; 

    // 角色映射表哦
    trialConstant.roleNameMap = {
        'ac': '原告',
        'al': '原告代理律师',
        'aw': '原告证人',
        'de': '被告',
        'dl': '被告代理律师',
        'dw': '被告证人',
        're': '书记员',
        'ju': '审判员',
        'sc': '屏幕',
        'sp': '旁观者',
        'ct': '法庭',
        'ae': '第三方测试',
        'ad': '庭审管理员'
    };

    // 0~一的映射
    trialConstant.numArr = ['', '一', '二', '三','四', '五', '六', '七','八', '九', '十'];

    // 静态资源地址
    trialConstant.assetsLink = 'https://alinw.alicdn.com/platform/legal_online_court/1.2.13';

    // 自动保存轮询的时间
    trialConstant.saveRecordTime = 5000;


    return trialConstant;

});