define(function(require, exports, module) { var Handlerbars = require("common/handlerbars"); var compile = Handlerbars.compile("<div class=\"fn-BGC-eaf7ff fn-color-047dc6 fn-BoAlSo fn-BoCo-cfefff fn-LH20 fn-PaAl fn-PaAl15 fn-W380 fn-MB10 fn-PosRel\" data-entity-id=\"{{securityId}}\">    <input type=\"checkbox\" name=\"entityIds\" value=\"{{securityId}}\" class=\"fn-hide-input\" checked=\"checked\" />    <input type=\"checkbox\" name=\"entityNames\" value=\"{{#isEqual entityType \'normal\'}}{{name}}{{/isEqual}} {{#isEqual entityType \'legal\'}}{{companyName}}{{/isEqual}}\"  class=\"fn-hide-input\" checked=\"checked\"/>     <i class=\"kuma-icon kuma-icon-edit1 fn-FS12 fn-PosAbs fn-Right30 fn-Top10 fn-CuPo\" data-trigger=\"edit\"></i>    <i class=\"kuma-icon kuma-icon-delete fn-FS12 fn-PosAbs fn-Right10 fn-Top10 fn-CuPo\" data-trigger=\"delete\"></i>    <table class=\"fn-table fn-table-text\" width=\"100%\">        <tbody>            <tr>                <td align=\"right\" width=\"80\" valign=\"top\">主体性质：</td>                <td>{{dataMap entityType \'{\"normal\": \"自然人\", \"legal\": \"法人\"}\'}}</td>            </tr>        </tbody>        {{#isEqual entityType \"normal\"}}            <tbody>                <tr>                    <td align=\"right\" valign=\"top\">姓名：</td>                    <td>{{name}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">性别：</td>                    <td>{{dataMap gender \'{\"male\": \"男\", \"female\": \"女\"}\'}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">身份证号：</td>                    <td>{{idCard}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">住址：</td>                    <td>{{address}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">手机号码：</td>                    <td>{{mobile}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">邮箱：</td>                    <td>{{email}}</td>                </tr>            </tbody>        {{/isEqual}}        {{#isEqual entityType \"legal\"}}            <tbody>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">公司名：</td>                    <td>{{companyName}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">法定代表人：</td>                    <td>{{legalRepresent}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">法定代表人身份证号：</td>                    <td>{{idCard}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">联系人姓名：</td>                    <td>{{name}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">联系人手机号码：</td>                    <td>{{mobile}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">企业邮箱：</td>                    <td>{{email}}</td>                </tr>            </tbody>        {{/isEqual}}    </table></div>"); compile.source="<div class=\"fn-BGC-eaf7ff fn-color-047dc6 fn-BoAlSo fn-BoCo-cfefff fn-LH20 fn-PaAl fn-PaAl15 fn-W380 fn-MB10 fn-PosRel\" data-entity-id=\"{{securityId}}\">    <input type=\"checkbox\" name=\"entityIds\" value=\"{{securityId}}\" class=\"fn-hide-input\" checked=\"checked\" />    <input type=\"checkbox\" name=\"entityNames\" value=\"{{#isEqual entityType \'normal\'}}{{name}}{{/isEqual}} {{#isEqual entityType \'legal\'}}{{companyName}}{{/isEqual}}\"  class=\"fn-hide-input\" checked=\"checked\"/>     <i class=\"kuma-icon kuma-icon-edit1 fn-FS12 fn-PosAbs fn-Right30 fn-Top10 fn-CuPo\" data-trigger=\"edit\"></i>    <i class=\"kuma-icon kuma-icon-delete fn-FS12 fn-PosAbs fn-Right10 fn-Top10 fn-CuPo\" data-trigger=\"delete\"></i>    <table class=\"fn-table fn-table-text\" width=\"100%\">        <tbody>            <tr>                <td align=\"right\" width=\"80\" valign=\"top\">主体性质：</td>                <td>{{dataMap entityType \'{\"normal\": \"自然人\", \"legal\": \"法人\"}\'}}</td>            </tr>        </tbody>        {{#isEqual entityType \"normal\"}}            <tbody>                <tr>                    <td align=\"right\" valign=\"top\">姓名：</td>                    <td>{{name}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">性别：</td>                    <td>{{dataMap gender \'{\"male\": \"男\", \"female\": \"女\"}\'}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">身份证号：</td>                    <td>{{idCard}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">住址：</td>                    <td>{{address}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">手机号码：</td>                    <td>{{mobile}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\">邮箱：</td>                    <td>{{email}}</td>                </tr>            </tbody>        {{/isEqual}}        {{#isEqual entityType \"legal\"}}            <tbody>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">公司名：</td>                    <td>{{companyName}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">法定代表人：</td>                    <td>{{legalRepresent}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">法定代表人身份证号：</td>                    <td>{{idCard}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">联系人姓名：</td>                    <td>{{name}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">联系人手机号码：</td>                    <td>{{mobile}}</td>                </tr>                <tr>                    <td align=\"right\" valign=\"top\" width=\"140\">企业邮箱：</td>                    <td>{{email}}</td>                </tr>            </tbody>        {{/isEqual}}    </table></div>"; return compile; });