define("src/bus/paymentorder/court/putOnRecord/treatment/treatAuto-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div id="dialog" class="fn-PaAl15">    <div class="fn-MT20 fn-PB15 fn-color-666">    <form class="kuma-form" id="suitWithdrawal-form-auto">        <input type="hidden" value="{{securityId}}" name="securityId">        <input type="hidden" name="securityCaseId" value="$!securityCaseId" />        <input type="hidden" value="{{reason}}" name="reason">        <table class="fn-table fn-table-text" width="100%">            <tr>                <td align="right" width="110">撤诉申请类型：</td>                <td>                    {{#isEqual reason "active_withdraw"}}申请人主动申请撤回{{/isEqual}}                    {{#isEqual reason "paid_withdraw"}}被申请人已还款{{/isEqual}}                </td>            </tr>            <tr>                <td align="right" width="50">原告：</td>                <td>{{name}}</td>            </tr>            <tr>                <td align="right">申请时间：</td>                <td>{{formatData \'yyyy-MM-dd HH:mm\' applyTime}}</td>            </tr>            <tr>                <td align="right" width="50">理由：</td>                <td>{{memo}}</td>            </tr>            <tr>                <td align="right" width="50">处理：</td>                <td>                    <select name="deal"  class="fn-select fn-W220">                        <option value="agreed">同意</option>                        <option value="reject">拒绝</option>                    </select>                </td>            </tr>            <tr>                <td align="right" valign="top" width="50">意见：</td>                <td>                    <div class="fn-MR70">                        <textarea rows="3" class="fn-textarea fn-W100P" name="opinion" maxlength="1000"></textarea>                    </div>                </td>            </tr>            <tr>                <td></td>                <td>                    <button type="button" class="fn-btn fn-btn-primary fn-btn-sm JS-trigger-click-save">保存</button>                </td>            </tr>        </table>    </form>    </div></div>');
    return compile.source = '<div id="dialog" class="fn-PaAl15">    <div class="fn-MT20 fn-PB15 fn-color-666">    <form class="kuma-form" id="suitWithdrawal-form-auto">        <input type="hidden" value="{{securityId}}" name="securityId">        <input type="hidden" name="securityCaseId" value="$!securityCaseId" />        <input type="hidden" value="{{reason}}" name="reason">        <table class="fn-table fn-table-text" width="100%">            <tr>                <td align="right" width="110">撤诉申请类型：</td>                <td>                    {{#isEqual reason "active_withdraw"}}申请人主动申请撤回{{/isEqual}}                    {{#isEqual reason "paid_withdraw"}}被申请人已还款{{/isEqual}}                </td>            </tr>            <tr>                <td align="right" width="50">原告：</td>                <td>{{name}}</td>            </tr>            <tr>                <td align="right">申请时间：</td>                <td>{{formatData \'yyyy-MM-dd HH:mm\' applyTime}}</td>            </tr>            <tr>                <td align="right" width="50">理由：</td>                <td>{{memo}}</td>            </tr>            <tr>                <td align="right" width="50">处理：</td>                <td>                    <select name="deal"  class="fn-select fn-W220">                        <option value="agreed">同意</option>                        <option value="reject">拒绝</option>                    </select>                </td>            </tr>            <tr>                <td align="right" valign="top" width="50">意见：</td>                <td>                    <div class="fn-MR70">                        <textarea rows="3" class="fn-textarea fn-W100P" name="opinion" maxlength="1000"></textarea>                    </div>                </td>            </tr>            <tr>                <td></td>                <td>                    <button type="button" class="fn-btn fn-btn-primary fn-btn-sm JS-trigger-click-save">保存</button>                </td>            </tr>        </table>    </form>    </div></div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});