define(function(require, exports, module) { var Handlerbars = require("common/handlerbars"); var compile = Handlerbars.compile("<select class=\"fn-select fn-W150\" data-role=\"typeChange\" name=\"requestType\">    <option value=\"creditCard\" {{#isEqual application.requestType \"creditCard\"}}selected=\"selected\"{{/isEqual}}>信用卡（花呗）</option>    <option value=\"payment_other\" {{#isEqual application.requestType \"payment_other\"}}selected=\"selected\"{{/isEqual}}>其他</option>        </select><input type=\"button\" data-role=\"data\" class=\"fn-btn fn-btn-primary fn-btn-sm fn-ML10\" value=\"导入数据\" /><div class=\"fn-MT10\" data-role=\"creditCard\">    <div class=\"fn-MR30 kuma-form-item\">        <input type=\"text\"  class=\"kuma-input JS-prosecute-required fn-hide-input\" data-required=\"true\" data-targer=\"creditCardFulldata\" data-errormessage=\"请导入数据\" />    </div>    <div class=\"fn-BS-CCC fn-MT10 fn-PaAl15\">        <div data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"requestType\" value=\"creditCard\" />            <input type=\"hidden\" name=\"securityId\" value=\"{{application.securityId}}\"/>            <input type=\"hidden\" name=\"securityCaseId\" value=\"{{application.securityCaseId}}\">            <div class=\"case-search-empty fn-PosRel\" id=\"noneDataTemplate\">                <i class=\"kuma-icon kuma-icon-caution fn-PosAbs fn-ML240 fn-color-eba433 fn-FS26\"></i>                <div class=\"fn-TAC fn-LH40 fn-MR30\">当前没有数据，请先导入模板</div>            </div>            <div class=\"fn-clear fn-LH20 fn-MT15 fn-PB10\">                <div class=\"fn-left fn-ML15\">                    结算日：<input type=\"text\" name=\"businessDate\" value=\"{{formatData \'yyyy-MM-dd\' application.businessDate}}\" class=\"fn-input-text fn-input-text-sm fn-W90 kuma-input fn-input-text-date JS-need-calendar\" id=\"businessDate\" readonly=\"readonly\"/>                </div>                <p class=\"fn-left fn-ML10 fn-LH28\">累计应还总金额： <span data-trigger=\"totalAmount\">{{parseAmount application.creditCardAmount}}</span></p>                <input type=\"hidden\" name=\"amount\" data-role=\"sumAmount\" value=\"{{application.creditCardAmount}}\" data-trigger=\"totalAmount\" />            </div>            <div class=\"fn-BBS-ebebeb\"></div>        </div>        <div class=\"fn-MT10 fn-MR20\" data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"securityId\" value=\"{{other.securityId}}\"/>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"60\" align=\"right\">其他请求                        <input name=\"requestType\" value=\"other\" type=\"hidden\" />                    </td>                    <td colspan=\"3\">(请在下方填入相应金额)</td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\">金额：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{other.creditCardAmount}}\" data-role=\"sumAmount\" id=\"amoutChangeHandle\" />                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\">说明：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"content\" value=\"{{other.content}}\" class=\"fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input\" maxlength=\"1000\" />                        </div>                    </td>                </tr>            </table>        </div>        <div class=\"fn-BBS-ebebeb\"></div>        <div class=\"fn-clear fn-LH20 fn-MT5 fn-PB10\">            <p class=\"fn-right fn-FS14\">申请总金额：<span class=\"fn-FS24 fn-color-F00\" data-role=\"applyAmount\">{{parseAmount creditCardAmount}}</span></p>            <input type=\"hidden\" data-role=\"applyAmountValue\" name=\"amount\" value=\"{{creditCardAmount}}\"/>        </div>    </div></div><div class=\"fn-MT10\" data-role=\"payment_other\">    <div class=\"fn-MR30 kuma-form-item\">        <input type=\"text\" class=\"kuma-input JS-prosecute-required fn-hide-input\" data-required=\"true\" data-targer=\"paymentFullstates\" data-errormessage=\"请选择文件\" />    </div>    <div id=\"paymentStates\"></div>    <div class=\"fn-BS-CCC fn-PT10 fn-MT10\">        <div data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"requestType\" value=\"payment_other\" />            <input type=\"hidden\" name=\"securityId\" value=\"{{application.securityId}}\"/>            <input type=\"hidden\" name=\"securityCaseId\" value=\"{{application.securityCaseId}}\">            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td align=\"right\" width=\"100\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 结算日：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                           <input type=\"text\" name=\"businessDate\" value=\"{{formatData \'yyyy-MM-dd\' application.businessDate}}\" class=\"fn-input-text fn-input-text-sm fn-W90 kuma-input fn-input-text-date JS-need-calendar\" id=\"paymentFullBusinessDate\" readonly=\"readonly\"/>                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 贷款本金：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"principal\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.principal}}\" data-required=\"true\" data-errormessage-required=\"请输入贷款本金。\" maxlength=\"100\" /> 元                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 尚欠贷款本金：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"unpaidPrincipal\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.unpaidPrincipal}}\" data-required=\"true\" data-errormessage-required=\"请输入尚欠贷款本金。\" maxlength=\"100\" /> 元                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 逾期利率：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"ovdRate\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.ovdRate}}\" data-required=\"true\" data-errormessage-required=\"请输入逾期利率。\" maxlength=\"100\" />                            <select class=\"fn-select fn-W100\" name=\"rateType\">                                <option value=\"hundredMarkSystem\" {{#isEqual application.rateType \"hundredMarkSystem\"}}selected=\"selected\"{{/isEqual}}>百分制</option>                                <option value=\"micrometerSystem\" {{#isEqual application.rateType \"micrometerSystem\"}}selected=\"selected\"{{/isEqual}}>千分制</option>                            </select>                             <span {{#isEqual application.rateType \"micrometerSystem\"}}class=\"fn-hide\"{{/isEqual}} data-role=\"hundredMarkSystem\">%</span>                            <span {{#isEqual application.rateType \"hundredMarkSystem\"}}class=\"fn-hide\"{{/isEqual}} data-role=\"micrometerSystem\" >‰</span>                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 累计利息：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"penalty\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.penalty}}\" data-required=\"true\" data-errormessage-required=\"请输入累计利息。\" maxlength=\"100\" /> 元                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 逾期利息：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"unpaidPenalty\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.unpaidPenalty}}\" data-required=\"true\" data-errormessage-required=\"请输入逾期利息。\" maxlength=\"100\" /> 元                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 手续费：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"fee\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.fee}}\" data-required=\"true\" data-errormessage-required=\"请输入手续费。\" maxlength=\"100\" /> 元                            <input type=\"hidden\" data-role=\"otherAmountValue\" name=\"amount\" value=\"{{application.paymentOtherAmount}}\">                        </div>                    </td>                </tr>            </table>        </div>        <div class=\"fn-MR20\" data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"securityId\" value=\"{{other.securityId}}\"/>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\">其他：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{other.paymentOtherAmount}}\" id=\"amoutChangeHandle\" /> 元                            <input name=\"requestType\" value=\"other\" type=\"hidden\" />                        </div>                    </td>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\">说明：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"content\" value=\"{{other.content}}\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"1000\" />                        </div>                    </td>                </tr>            </table>        </div>        <div>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 申请总金额：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{paymentOtherAmount}}\" /> 元                        </div>                    </td>                </tr>            </table>        </div>    </div></div>"); compile.source="<select class=\"fn-select fn-W150\" data-role=\"typeChange\" name=\"requestType\">    <option value=\"creditCard\" {{#isEqual application.requestType \"creditCard\"}}selected=\"selected\"{{/isEqual}}>信用卡（花呗）</option>    <option value=\"payment_other\" {{#isEqual application.requestType \"payment_other\"}}selected=\"selected\"{{/isEqual}}>其他</option>        </select><input type=\"button\" data-role=\"data\" class=\"fn-btn fn-btn-primary fn-btn-sm fn-ML10\" value=\"导入数据\" /><div class=\"fn-MT10\" data-role=\"creditCard\">    <div class=\"fn-MR30 kuma-form-item\">        <input type=\"text\"  class=\"kuma-input JS-prosecute-required fn-hide-input\" data-required=\"true\" data-targer=\"creditCardFulldata\" data-errormessage=\"请导入数据\" />    </div>    <div class=\"fn-BS-CCC fn-MT10 fn-PaAl15\">        <div data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"requestType\" value=\"creditCard\" />            <input type=\"hidden\" name=\"securityId\" value=\"{{application.securityId}}\"/>            <input type=\"hidden\" name=\"securityCaseId\" value=\"{{application.securityCaseId}}\">            <div class=\"case-search-empty fn-PosRel\" id=\"noneDataTemplate\">                <i class=\"kuma-icon kuma-icon-caution fn-PosAbs fn-ML240 fn-color-eba433 fn-FS26\"></i>                <div class=\"fn-TAC fn-LH40 fn-MR30\">当前没有数据，请先导入模板</div>            </div>            <div class=\"fn-clear fn-LH20 fn-MT15 fn-PB10\">                <div class=\"fn-left fn-ML15\">                    结算日：<input type=\"text\" name=\"businessDate\" value=\"{{formatData \'yyyy-MM-dd\' application.businessDate}}\" class=\"fn-input-text fn-input-text-sm fn-W90 kuma-input fn-input-text-date JS-need-calendar\" id=\"businessDate\" readonly=\"readonly\"/>                </div>                <p class=\"fn-left fn-ML10 fn-LH28\">累计应还总金额： <span data-trigger=\"totalAmount\">{{parseAmount application.creditCardAmount}}</span></p>                <input type=\"hidden\" name=\"amount\" data-role=\"sumAmount\" value=\"{{application.creditCardAmount}}\" data-trigger=\"totalAmount\" />            </div>            <div class=\"fn-BBS-ebebeb\"></div>        </div>        <div class=\"fn-MT10 fn-MR20\" data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"securityId\" value=\"{{other.securityId}}\"/>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"60\" align=\"right\">其他请求                        <input name=\"requestType\" value=\"other\" type=\"hidden\" />                    </td>                    <td colspan=\"3\">(请在下方填入相应金额)</td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\">金额：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{other.creditCardAmount}}\" data-role=\"sumAmount\" id=\"amoutChangeHandle\" />                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\">说明：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"content\" value=\"{{other.content}}\" class=\"fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input\" maxlength=\"1000\" />                        </div>                    </td>                </tr>            </table>        </div>        <div class=\"fn-BBS-ebebeb\"></div>        <div class=\"fn-clear fn-LH20 fn-MT5 fn-PB10\">            <p class=\"fn-right fn-FS14\">申请总金额：<span class=\"fn-FS24 fn-color-F00\" data-role=\"applyAmount\">{{parseAmount creditCardAmount}}</span></p>            <input type=\"hidden\" data-role=\"applyAmountValue\" name=\"amount\" value=\"{{creditCardAmount}}\"/>        </div>    </div></div><div class=\"fn-MT10\" data-role=\"payment_other\">    <div class=\"fn-MR30 kuma-form-item\">        <input type=\"text\" class=\"kuma-input JS-prosecute-required fn-hide-input\" data-required=\"true\" data-targer=\"paymentFullstates\" data-errormessage=\"请选择文件\" />    </div>    <div id=\"paymentStates\"></div>    <div class=\"fn-BS-CCC fn-PT10 fn-MT10\">        <div data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"requestType\" value=\"payment_other\" />            <input type=\"hidden\" name=\"securityId\" value=\"{{application.securityId}}\"/>            <input type=\"hidden\" name=\"securityCaseId\" value=\"{{application.securityCaseId}}\">            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td align=\"right\" width=\"100\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 结算日：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                           <input type=\"text\" name=\"businessDate\" value=\"{{formatData \'yyyy-MM-dd\' application.businessDate}}\" class=\"fn-input-text fn-input-text-sm fn-W90 kuma-input fn-input-text-date JS-need-calendar\" id=\"paymentFullBusinessDate\" readonly=\"readonly\"/>                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 贷款本金：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"principal\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.principal}}\" data-required=\"true\" data-errormessage-required=\"请输入贷款本金。\" maxlength=\"100\" /> 元                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 尚欠贷款本金：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"unpaidPrincipal\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.unpaidPrincipal}}\" data-required=\"true\" data-errormessage-required=\"请输入尚欠贷款本金。\" maxlength=\"100\" /> 元                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 逾期利率：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"ovdRate\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.ovdRate}}\" data-required=\"true\" data-errormessage-required=\"请输入逾期利率。\" maxlength=\"100\" />                            <select class=\"fn-select fn-W100\" name=\"rateType\">                                <option value=\"hundredMarkSystem\" {{#isEqual application.rateType \"hundredMarkSystem\"}}selected=\"selected\"{{/isEqual}}>百分制</option>                                <option value=\"micrometerSystem\" {{#isEqual application.rateType \"micrometerSystem\"}}selected=\"selected\"{{/isEqual}}>千分制</option>                            </select>                             <span {{#isEqual application.rateType \"micrometerSystem\"}}class=\"fn-hide\"{{/isEqual}} data-role=\"hundredMarkSystem\">%</span>                            <span {{#isEqual application.rateType \"hundredMarkSystem\"}}class=\"fn-hide\"{{/isEqual}} data-role=\"micrometerSystem\" >‰</span>                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 累计利息：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"penalty\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.penalty}}\" data-required=\"true\" data-errormessage-required=\"请输入累计利息。\" maxlength=\"100\" /> 元                        </div>                    </td>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 逾期利息：</td>                    <td>                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"unpaidPenalty\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.unpaidPenalty}}\" data-required=\"true\" data-errormessage-required=\"请输入逾期利息。\" maxlength=\"100\" /> 元                        </div>                    </td>                </tr>                <tr>                    <td align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 手续费：</td>                    <td colspan=\"3\">                        <div class=\"fn-MR30 kuma-form-item\">                            <input type=\"text\" name=\"fee\" data-role=\"otherAmount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" value=\"{{application.fee}}\" data-required=\"true\" data-errormessage-required=\"请输入手续费。\" maxlength=\"100\" /> 元                            <input type=\"hidden\" data-role=\"otherAmountValue\" name=\"amount\" value=\"{{application.paymentOtherAmount}}\">                        </div>                    </td>                </tr>            </table>        </div>        <div class=\"fn-MR20\" data-serialize-name=\"lassenSuitRequestDoList\">            <input type=\"hidden\" name=\"securityId\" value=\"{{other.securityId}}\"/>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\">其他：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{other.paymentOtherAmount}}\" id=\"amoutChangeHandle\" /> 元                            <input name=\"requestType\" value=\"other\" type=\"hidden\" />                        </div>                    </td>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\">说明：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"content\" value=\"{{other.content}}\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"1000\" />                        </div>                    </td>                </tr>            </table>        </div>        <div>            <table width=\"100%\" class=\"fn-table fn-table-input\">                <tr>                    <td width=\"100\" align=\"right\" class=\"fn-LH30\"><span class=\"global-require fn-VA1D\">*</span> 申请总金额：</td>                    <td>                        <div class=\"kuma-form-item\">                            <input type=\"text\" name=\"amount\" data-type=\"amount\" class=\"fn-input-text fn-input-text-sm fn-W200 JS-prosecute-required kuma-input\" maxlength=\"10\" value=\"{{paymentOtherAmount}}\" /> 元                        </div>                    </td>                </tr>            </table>        </div>    </div></div>"; return compile; });