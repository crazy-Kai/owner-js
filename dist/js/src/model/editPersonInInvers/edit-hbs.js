define("src/model/editPersonInInvers/edit-hbs",["common/handlerbars"],function(require,exports,module){var Handlerbars=require("common/handlerbars"),compile=Handlerbars.compile('<form class="JS-target-form fn-PaAl15 fn-color-666 fn-MiHe350">\t    <input type="hidden" name="entityId" value="{{securityId}}" />\t<input type="hidden" name="entityRole" value="{{entityRole}}" />\t<div class="global-tab fn-BBS-ebebeb"><i></i><span class="JS-target-title">增加{{dataMap entityRole \'{"accuser": "原告", "accused": "被告"}\'}}</span></div> \t<table class="fn-table fn-table-input fn-table-input-sm fn-MT20" width="100%">\t\t<tbody>\t\t\t<tr>                <td align="right" class="fn-LH20" width="140">当事人主体：</td>                <td>                \t<label>                        <input type="radio" name="entityType" class="fn-VA2D" data-trigger="switchNormalAndLegal" {{#isEqual entityType "normal"}}checked="checked"{{/isEqual}} value="normal"> 自然人                    </label>                    <label class="fn-ML20">                        <input type="radio" name="entityType" class="fn-VA2D" data-trigger="switchNormalAndLegal" {{#isEqual entityType "legal"}}checked="checked"{{/isEqual}} value="legal"> 法人                     </label>                </td>            </tr>\t\t</tbody>                <tbody data-target="normal" {{#isEqual entityType "legal"}}class="fn-hide"{{/isEqual}}>        \t<tr>                <td align="right" valign="top" class="fn-LH30" width="60"><span class="global-require fn-VA1D">*</span> 姓名：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="name"  class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入姓名。"                            {{#isEqual entityType "normal"}}value="{{name}}"{{/isEqual}}                            maxlength="25" />                \t</div>                </td>            </tr>            <tr>                <td align="right" class="fn-LH20" width="60">性别：</td>                <td>                \t<label>                        <input type="radio" name="gender" value="male" class="fn-VA2D" {{#isEqual gender "male"}}checked="checked"{{/isEqual}}> 男                    </label>                    <label class="fn-ML20">                        <input type="radio" name="gender" value="female" class="fn-VA2D" {{#isEqual gender "female"}}checked="checked"{{/isEqual}}> 女                    </label>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                    <span class="global-require fn-VA1D">*</span> \t\t\t\t\t身份证号：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="idCard" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage-required="请输入身份证号。"                            data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"                              {{#isEqual entityType "normal"}}value="{{idCard}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60"> 住址：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="address" value="{{address}}" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-errormessage="请输入住址。"                            {{#isEqual entityType "normal"}}value="{{address}}"{{/isEqual}}                            maxlength="50" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                \t<span class="global-require fn-VA1D">*</span>                 \t手机号码：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                \t\t\tdata-widget="validator" data-required="true" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"                              {{#isEqual entityType "normal"}}value="{{mobile}}"{{/isEqual}}                \t\t\tmaxlength="11" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                \t<span class="global-require fn-VA1D">*</span>                \t邮箱：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="email" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                            data-widget="validator" data-required="true" data-rule="email" data-errormessage-email="请填写正确的邮箱"                            {{#isEqual entityType "normal"}}value="{{email}}"{{/isEqual}}                \t\t\tmaxlength="50" />                \t</div>                </td>            </tr>        </tbody>                <tbody data-target="legal" {{#isEqual entityType "normal"}}class="fn-hide"{{/isEqual}}>        \t<tr>                <td align="right" valign="top" class="fn-LH30" width="140"><span class="global-require fn-VA1D">*</span> 公司名：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="companyName" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入公司名。"                            {{#isEqual entityType "legal"}}value="{{companyName}}"{{/isEqual}}                            maxlength="36"/>                \t</div>                </td>            </tr>            <tr>                <td> </td>                <td>                    可通过全国企业信用信息公示系统<a href="http://gsxt.saic.gov.cn" class="global-link" target="_blank">(http://gsxt.saic.gov.cn)</a>查询企业名称、地址、法定代表人等信息                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140"><span class="global-require fn-VA1D">*</span> 法定代表人：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="legalRepresent" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入法定代表人。"                             {{#isEqual entityType "legal"}}value="{{legalRepresent}}"{{/isEqual}}                            maxlength="200"/>                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                    <span class="global-require fn-VA1D">*</span>                     法定代表人身份证号：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="idCard" class="fn-input-text fn-input-text-sm fn-W100P JS-target-required kuma-input"                             data-widget="validator" data-required="true" data-errormessage-required="请输入身份证号。"                            data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"                              {{#isEqual entityType "legal"}}value="{{idCard}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                    <span class="global-require fn-VA1D">*</span>                    联系人姓名：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="name"  class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入姓名。"                            {{#isEqual entityType "legal"}}value="{{name}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                \t<span class="global-require fn-VA1D">*</span>                \t联系人手机号：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                \t\t\tdata-widget="validator" data-required="true" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"                            {{#isEqual entityType "legal"}}value="{{mobile}}"{{/isEqual}}                \t\t\tmaxlength="11" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                \t<span class="global-require fn-VA1D">*</span>                \t企业邮箱：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="email" class="fn-input-text fn-input-text-sm fn-W100P JS-target-required kuma-input"                \t\t\t                            data-widget="validator" data-required="true" data-rule="email" data-errormessage-email="请填写正确的邮箱"                            {{#isEqual entityType "legal"}}value="{{email}}"{{/isEqual}}                \t\t\tmaxlength="50" />                \t</div>                </td>            </tr>        </tbody>        <tfoot>        \t<tr class="child-last">            \t<td colspan="2" align="center">            \t\t<input type="button" class="fn-btn fn-btn-primary fn-W100" data-trigger="submit" value="提 交" />            \t</td>            </tr>        </tfoot>\t</table></form>');return compile.source='<form class="JS-target-form fn-PaAl15 fn-color-666 fn-MiHe350">\t    <input type="hidden" name="entityId" value="{{securityId}}" />\t<input type="hidden" name="entityRole" value="{{entityRole}}" />\t<div class="global-tab fn-BBS-ebebeb"><i></i><span class="JS-target-title">增加{{dataMap entityRole \'{"accuser": "原告", "accused": "被告"}\'}}</span></div> \t<table class="fn-table fn-table-input fn-table-input-sm fn-MT20" width="100%">\t\t<tbody>\t\t\t<tr>                <td align="right" class="fn-LH20" width="140">当事人主体：</td>                <td>                \t<label>                        <input type="radio" name="entityType" class="fn-VA2D" data-trigger="switchNormalAndLegal" {{#isEqual entityType "normal"}}checked="checked"{{/isEqual}} value="normal"> 自然人                    </label>                    <label class="fn-ML20">                        <input type="radio" name="entityType" class="fn-VA2D" data-trigger="switchNormalAndLegal" {{#isEqual entityType "legal"}}checked="checked"{{/isEqual}} value="legal"> 法人                     </label>                </td>            </tr>\t\t</tbody>                <tbody data-target="normal" {{#isEqual entityType "legal"}}class="fn-hide"{{/isEqual}}>        \t<tr>                <td align="right" valign="top" class="fn-LH30" width="60"><span class="global-require fn-VA1D">*</span> 姓名：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="name"  class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入姓名。"                            {{#isEqual entityType "normal"}}value="{{name}}"{{/isEqual}}                            maxlength="25" />                \t</div>                </td>            </tr>            <tr>                <td align="right" class="fn-LH20" width="60">性别：</td>                <td>                \t<label>                        <input type="radio" name="gender" value="male" class="fn-VA2D" {{#isEqual gender "male"}}checked="checked"{{/isEqual}}> 男                    </label>                    <label class="fn-ML20">                        <input type="radio" name="gender" value="female" class="fn-VA2D" {{#isEqual gender "female"}}checked="checked"{{/isEqual}}> 女                    </label>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                    <span class="global-require fn-VA1D">*</span> \t\t\t\t\t身份证号：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="idCard" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage-required="请输入身份证号。"                            data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"                              {{#isEqual entityType "normal"}}value="{{idCard}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60"> 住址：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="address" value="{{address}}" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-errormessage="请输入住址。"                            {{#isEqual entityType "normal"}}value="{{address}}"{{/isEqual}}                            maxlength="50" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                \t<span class="global-require fn-VA1D">*</span>                 \t手机号码：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                \t\t\tdata-widget="validator" data-required="true" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"                              {{#isEqual entityType "normal"}}value="{{mobile}}"{{/isEqual}}                \t\t\tmaxlength="11" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="60">                \t<span class="global-require fn-VA1D">*</span>                \t邮箱：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="email" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                            data-widget="validator" data-required="true" data-rule="email" data-errormessage-email="请填写正确的邮箱"                            {{#isEqual entityType "normal"}}value="{{email}}"{{/isEqual}}                \t\t\tmaxlength="50" />                \t</div>                </td>            </tr>        </tbody>                <tbody data-target="legal" {{#isEqual entityType "normal"}}class="fn-hide"{{/isEqual}}>        \t<tr>                <td align="right" valign="top" class="fn-LH30" width="140"><span class="global-require fn-VA1D">*</span> 公司名：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="companyName" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入公司名。"                            {{#isEqual entityType "legal"}}value="{{companyName}}"{{/isEqual}}                            maxlength="36"/>                \t</div>                </td>            </tr>            <tr>                <td> </td>                <td>                    可通过全国企业信用信息公示系统<a href="http://gsxt.saic.gov.cn" class="global-link" target="_blank">(http://gsxt.saic.gov.cn)</a>查询企业名称、地址、法定代表人等信息                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140"><span class="global-require fn-VA1D">*</span> 法定代表人：</td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="legalRepresent" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入法定代表人。"                             {{#isEqual entityType "legal"}}value="{{legalRepresent}}"{{/isEqual}}                            maxlength="200"/>                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                    <span class="global-require fn-VA1D">*</span>                     法定代表人身份证号：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="idCard" class="fn-input-text fn-input-text-sm fn-W100P JS-target-required kuma-input"                             data-widget="validator" data-required="true" data-errormessage-required="请输入身份证号。"                            data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"                              {{#isEqual entityType "legal"}}value="{{idCard}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                    <span class="global-require fn-VA1D">*</span>                    联系人姓名：                </td>                <td>                    <div class="fn-MR30 kuma-form-item">                        <input type="text" name="name"  class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                             data-widget="validator" data-required="true" data-errormessage="请输入姓名。"                            {{#isEqual entityType "legal"}}value="{{name}}"{{/isEqual}}                            maxlength="25" />                    </div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                \t<span class="global-require fn-VA1D">*</span>                \t联系人手机号：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input"                 \t\t\t                \t\t\tdata-widget="validator" data-required="true" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"                            {{#isEqual entityType "legal"}}value="{{mobile}}"{{/isEqual}}                \t\t\tmaxlength="11" />                \t</div>                </td>            </tr>            <tr>                <td align="right" valign="top" class="fn-LH30" width="140">                \t<span class="global-require fn-VA1D">*</span>                \t企业邮箱：                </td>                <td>                \t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="email" class="fn-input-text fn-input-text-sm fn-W100P JS-target-required kuma-input"                \t\t\t                            data-widget="validator" data-required="true" data-rule="email" data-errormessage-email="请填写正确的邮箱"                            {{#isEqual entityType "legal"}}value="{{email}}"{{/isEqual}}                \t\t\tmaxlength="50" />                \t</div>                </td>            </tr>        </tbody>        <tfoot>        \t<tr class="child-last">            \t<td colspan="2" align="center">            \t\t<input type="button" class="fn-btn fn-btn-primary fn-W100" data-trigger="submit" value="提 交" />            \t</td>            </tr>        </tfoot>\t</table></form>',compile});
define("common/handlerbars",[],function(require,exports,module){});