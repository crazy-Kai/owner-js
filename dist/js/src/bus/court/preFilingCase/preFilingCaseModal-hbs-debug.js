define("src/bus/court/preFilingCase/preFilingCaseModal-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-PaAl15 fn-color-666" data-filter="lassenCourtFilingVo">\t<div class="global-tab fn-BBS-ebebeb"> <i></i>请选择退回原因</div>\t<table width="100%" class="fn-table fn-table-input fn-table-input-sm fn-MT20 fn-LH25">\t\t<tr>\t\t\t<td align="right" width="80" class="fn-LH30"><span class="global-require fn-VA1D">*</span>退回原因：</td>\t\t\t<td>\t\t\t\t<div class="kuma-form-item">                    <input type="text" class="fn-input-text fn-input-text-sm fn-W360 kuma-input JS-target-required" id="multiple" data-input-name="reason" readonly="readonly" data-required="true" data-errormessage="请选择原因" />                    <input type="hidden" name="reason"  value="$!lassenCourtFilingVo.reason"/>                </div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td align="right">备注：</td>\t\t\t<td>\t\t\t\t<div class="fn-MR20 kuma-form-item">\t\t\t\t\t<textarea rows="3" name="remark" class="fn-textarea fn-W100P kuma-input" data-required="true" maxlength="400" data-errormessage="请填写备注"></textarea>\t\t\t\t\t<input type="hidden" name="conclusion" value="return">\t\t\t\t\t<input type="hidden" name="isPreFiling" value="y">\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td colspan="2">\t\t\t\t<div class="fn-ML80">\t\t\t\t\t<button class="fn-btn fn-btn-sm fn-btn-primary fn-W80" data-role="return" type="button">确认退回</button>\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t</table>    \t</div>');
    return compile.source = '<div class="fn-PaAl15 fn-color-666" data-filter="lassenCourtFilingVo">\t<div class="global-tab fn-BBS-ebebeb"> <i></i>请选择退回原因</div>\t<table width="100%" class="fn-table fn-table-input fn-table-input-sm fn-MT20 fn-LH25">\t\t<tr>\t\t\t<td align="right" width="80" class="fn-LH30"><span class="global-require fn-VA1D">*</span>退回原因：</td>\t\t\t<td>\t\t\t\t<div class="kuma-form-item">                    <input type="text" class="fn-input-text fn-input-text-sm fn-W360 kuma-input JS-target-required" id="multiple" data-input-name="reason" readonly="readonly" data-required="true" data-errormessage="请选择原因" />                    <input type="hidden" name="reason"  value="$!lassenCourtFilingVo.reason"/>                </div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td align="right">备注：</td>\t\t\t<td>\t\t\t\t<div class="fn-MR20 kuma-form-item">\t\t\t\t\t<textarea rows="3" name="remark" class="fn-textarea fn-W100P kuma-input" data-required="true" maxlength="400" data-errormessage="请填写备注"></textarea>\t\t\t\t\t<input type="hidden" name="conclusion" value="return">\t\t\t\t\t<input type="hidden" name="isPreFiling" value="y">\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t\t<tr>\t\t\t<td colspan="2">\t\t\t\t<div class="fn-ML80">\t\t\t\t\t<button class="fn-btn fn-btn-sm fn-btn-primary fn-W80" data-role="return" type="button">确认退回</button>\t\t\t\t</div>\t\t\t</td>\t\t</tr>\t</table>    \t</div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});