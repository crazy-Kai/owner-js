define("src/model/resPondent/pondent-hbs-debug", ["common/handlerbars-debug"], function(require, exports, module) {
    var Handlerbars = require("common/handlerbars-debug"),
        compile = Handlerbars.compile('<div class="fn-BS-CCC fn-LH30  fn-PaAl10 fn-MT10">\t<input type="hidden" name="paySuitEntityDo.securityId" value="{{securityId}}" />\t<input type="hidden" name="paySuitEntityDo.entityRole" value="accused" />\t<input type="hidden" name="paySuitEntityDo.entityPosition" value="1" />\t<table class="fn-table fn-table-input fn-table-input-sm fn-MT10" width="100%">\t\t<tbody>\t\t\t<tr>\t\t\t\t<td align="right" width="120">身份：</td>\t\t\t\t<td colspan="3">\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t<input name="paySuitEntityDo.entityType" type="hidden" value="{{entityType}}" />\t\t\t\t\t{{/isEqual}}\t\t\t\t\t<select class="fn-select fn-W115 kuma-input" data-role="personChange" name="paySuitEntityDo.entityType" {{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}>\t\t\t\t\t\t<option value="normal" {{#isEqual entityType "normal"}}selected="selected"{{/isEqual}}>自然人</option>\t\t\t\t\t\t<option value="legal" {{#isEqual entityType "legal"}}selected="selected"{{/isEqual}}>法人</option>\t\t\t\t\t</select>\t\t\t\t</td>\t\t\t</tr>\t\t\t</tbody>\t</table>\t<table class="fn-table fn-table-input fn-table-input-sm fn-MT10" width="100%">\t\t<tbody {{#isEqual entityType "legal"}}class="fn-hide"{{/isEqual}} data-role="normal">\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30" width="120"><span class="global-require fn-VA1D">*</span> 姓名：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.name"  class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入姓名。" maxlength="25" value="{{name}}" \t\t\t\t\t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30" width="100">性别：</td>\t\t\t\t<td>\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t<input name="paySuitEntityDo.gender" type="hidden" value="{{gender}}" />\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t\t\t\t<label>\t\t\t\t\t\t<input type="radio" name="paySuitEntityDo.gender" value="male" class="fn-VA2D" checked="checked" \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}/> 男\t\t\t\t\t</label>\t\t\t\t\t<label class="fn-ML20">\t\t\t\t\t\t<input type="radio" name="paySuitEntityDo.gender" value="female" class="fn-VA2D" \t\t\t\t\t\t{{#isEqual gender "female"}}checked="checked"{{/isEqual}} \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}/> 女\t\t\t\t\t</label>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 民族：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.nation" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage-required="请输入民族。" maxlength="20" value="{{nation}}" \t\t\t\t\t\t{{#isEqual status "correction"}} readonly="readonly" {{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 出生年月：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t\t<input name="paySuitEntityDo.birthday" type="hidden" value="{{birthday}}" />\t\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t                        <input type="text" name="paySuitEntityDo.birthday" value="{{formatData \'yyyy-MM-dd\' birthday}}" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage-required="请选择出生年月。" readonly="readonly"                         {{#isEqual status "correction"}} disabled="disabled" {{/isEqual}}/>                    </div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 手机号码和邮箱至少必须填一项</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码" maxlength="11" placeholder="合同约定送达手机号码" {{#isEqual entityType "normal"}}value="{{mobile}}"{{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required"\t\t\t\t\t\t\tdata-rule="email" name="paySuitEntityDo.email" placeholder="合同约定送达邮箱" \t\t\t\t\t\t\t  {{#isEqual isTest "y"}} data-rule="aliyunEmail" data-errormessage-email="请填写正确的阿里云邮箱"{{else}} data-rule="email" data-errormessage-email="请填写正确的邮箱" {{/isEqual}} \t\t\t\t\t\t\t  name="paySuitEntityDo.email" {{#isEqual entityType "normal"}} value="{{email}}"{{/isEqual}}  maxlength="100"/>\t\t\t\t\t\t\t<div class="fn-color-e94e49 fn-H24 fn-H24 fn-hide fn-PT6" data-role="verify"><i class="kuma-icon kuma-icon-error"></i>&nbsp;手机号与邮箱至少必须填一个</div>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 身份证号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.idCard" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" \t\t\t\t\t\t\tdata-required="true" data-errormessage-required="请输入身份证号" data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"  maxlength="18" value="{{idCard}}" \t\t\t\t\t\t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>\t\t\t\t\t\t<input type="hidden" name="paySuitEntityDo.certType" value="idcard"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 住址：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.curAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage-required="请输入住址" maxlength="200" value="{{curAddress}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">其他手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherMobile" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="multiMobile" data-errormessage-mobile="请填写正确的手机号(若多个手机号，请用 "," 隔开)"  maxlength="200" placeholder="可填写多个，用逗号（，）隔开" value="{{otherMobile}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">其他邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherEmail" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="email" data-errormessage-email="请填写正确的邮箱" maxlength="100" value="{{otherEmail}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td colspan="3"><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 该手机号不作是否电子送达的判断</td>\t\t\t</tr>\t\t</tbody>\t\t<tbody {{#isEqual entityType "normal"}}class="fn-hide"{{/isEqual}} data-role="legal">\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30" width="120"><span class="global-require fn-VA1D">*</span> 公司名：</td>\t\t\t\t<td colspan="1">\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.companyName" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入公司名。"  maxlength="50" value="{{companyName}}"                  \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}} />                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>                <td> </td>                <td colspan="3">                    可通过全国企业信用信息公示系统<a href="http://gsxt.saic.gov.cn" class="global-link" target="_blank">(http://gsxt.saic.gov.cn)</a>查询企业名称、地址、法定代表人等信息                </td>            </tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 法定代表人：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.legalRepresent" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入法定代表人。" maxlength="200" value="{{legalRepresent}}"                 \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span>公司注册地：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.companyAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入公司注册地。"  maxlength="300"  value="{{companyAddress}}"                 \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 法定代表人职位：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR10 kuma-form-item">\t\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t\t<input name="paySuitEntityDo.job" type="hidden" value="{{job}}" />\t\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t<select class="fn-select fn-W100P kuma-input" name="paySuitEntityDo.job" \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}>\t\t\t\t\t\t\t<option value="manager" {{#isEqual job "manager"}}selected="selected"{{/isEqual}}>经理</option>\t\t\t\t\t\t\t<option value="chairman" {{#isEqual job "chairman"}}selected="selected"{{/isEqual}}>董事长</option>\t\t\t\t\t\t\t<option value="executiveChairman" {{#isEqual job "executiveChairman"}}selected="selected"{{/isEqual}}>执行董事长</option>\t\t\t\t\t\t</select>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">联系人：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text"  name="paySuitEntityDo.contact" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" maxlength="200" value="{{contact}}"                 \t\t{{#isEqual status "correction"}} readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 手机号码和邮箱至少必须填一项</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"  maxlength="11" placeholder="合同约定送达手机号码" {{#isEqual entityType "legal"}}value="{{mobile}}"{{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required"\t\t\t\t\t\t\t{{#isEqual isTest "y"}} data-rule="aliyunEmail" data-errormessage-email="请填写正确的阿里云邮箱"{{else}} data-rule="email" data-errormessage-email="请填写正确的邮箱" {{/isEqual}} \t\t\t\t\t\t\tname="paySuitEntityDo.email"  placeholder="合同约定送达邮箱" {{#isEqual entityType "legal"}} value="{{email}}"{{/isEqual}}  maxlength="100"/>\t\t\t\t\t\t\t<div class="fn-color-e94e49 fn-H24 fn-H24 fn-hide fn-PT6" data-role="verify"><i class="kuma-icon kuma-icon-error"></i>&nbsp;手机号与邮箱至少必须填一个</div>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 通讯地址：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.mailAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage="请输入通讯地址。"  maxlength="300"  value="{{mailAddress}}"/>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">固定电话：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.phone" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input kuma-input" maxlength="15" data-rule="tel" data-errormessage-tel="请输入正确的格式(比如0571-88888888)。" value="{{phone}}"/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">其他手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherMobile" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="multiMobile" data-errormessage-mobile="请填写正确的手机号(若多个手机号，请用 "," 隔开)"  maxlength="200" placeholder="可填写多个，用逗号（，）隔开" value="{{otherMobile}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 该手机号不作是否电子送达的判断</td>\t\t\t</tr>\t\t</tbody>\t\t\t</table></div>');
    return compile.source = '<div class="fn-BS-CCC fn-LH30  fn-PaAl10 fn-MT10">\t<input type="hidden" name="paySuitEntityDo.securityId" value="{{securityId}}" />\t<input type="hidden" name="paySuitEntityDo.entityRole" value="accused" />\t<input type="hidden" name="paySuitEntityDo.entityPosition" value="1" />\t<table class="fn-table fn-table-input fn-table-input-sm fn-MT10" width="100%">\t\t<tbody>\t\t\t<tr>\t\t\t\t<td align="right" width="120">身份：</td>\t\t\t\t<td colspan="3">\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t<input name="paySuitEntityDo.entityType" type="hidden" value="{{entityType}}" />\t\t\t\t\t{{/isEqual}}\t\t\t\t\t<select class="fn-select fn-W115 kuma-input" data-role="personChange" name="paySuitEntityDo.entityType" {{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}>\t\t\t\t\t\t<option value="normal" {{#isEqual entityType "normal"}}selected="selected"{{/isEqual}}>自然人</option>\t\t\t\t\t\t<option value="legal" {{#isEqual entityType "legal"}}selected="selected"{{/isEqual}}>法人</option>\t\t\t\t\t</select>\t\t\t\t</td>\t\t\t</tr>\t\t\t</tbody>\t</table>\t<table class="fn-table fn-table-input fn-table-input-sm fn-MT10" width="100%">\t\t<tbody {{#isEqual entityType "legal"}}class="fn-hide"{{/isEqual}} data-role="normal">\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30" width="120"><span class="global-require fn-VA1D">*</span> 姓名：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.name"  class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入姓名。" maxlength="25" value="{{name}}" \t\t\t\t\t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30" width="100">性别：</td>\t\t\t\t<td>\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t<input name="paySuitEntityDo.gender" type="hidden" value="{{gender}}" />\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t\t\t\t<label>\t\t\t\t\t\t<input type="radio" name="paySuitEntityDo.gender" value="male" class="fn-VA2D" checked="checked" \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}/> 男\t\t\t\t\t</label>\t\t\t\t\t<label class="fn-ML20">\t\t\t\t\t\t<input type="radio" name="paySuitEntityDo.gender" value="female" class="fn-VA2D" \t\t\t\t\t\t{{#isEqual gender "female"}}checked="checked"{{/isEqual}} \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}/> 女\t\t\t\t\t</label>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 民族：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.nation" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage-required="请输入民族。" maxlength="20" value="{{nation}}" \t\t\t\t\t\t{{#isEqual status "correction"}} readonly="readonly" {{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 出生年月：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t\t<input name="paySuitEntityDo.birthday" type="hidden" value="{{birthday}}" />\t\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t                        <input type="text" name="paySuitEntityDo.birthday" value="{{formatData \'yyyy-MM-dd\' birthday}}" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage-required="请选择出生年月。" readonly="readonly"                         {{#isEqual status "correction"}} disabled="disabled" {{/isEqual}}/>                    </div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 手机号码和邮箱至少必须填一项</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码" maxlength="11" placeholder="合同约定送达手机号码" {{#isEqual entityType "normal"}}value="{{mobile}}"{{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required"\t\t\t\t\t\t\tdata-rule="email" name="paySuitEntityDo.email" placeholder="合同约定送达邮箱" \t\t\t\t\t\t\t  {{#isEqual isTest "y"}} data-rule="aliyunEmail" data-errormessage-email="请填写正确的阿里云邮箱"{{else}} data-rule="email" data-errormessage-email="请填写正确的邮箱" {{/isEqual}} \t\t\t\t\t\t\t  name="paySuitEntityDo.email" {{#isEqual entityType "normal"}} value="{{email}}"{{/isEqual}}  maxlength="100"/>\t\t\t\t\t\t\t<div class="fn-color-e94e49 fn-H24 fn-H24 fn-hide fn-PT6" data-role="verify"><i class="kuma-icon kuma-icon-error"></i>&nbsp;手机号与邮箱至少必须填一个</div>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 身份证号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.idCard" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" \t\t\t\t\t\t\tdata-required="true" data-errormessage-required="请输入身份证号" data-rule="cardid" data-errormessage-cardid="请填写正确的身份证号。"  maxlength="18" value="{{idCard}}" \t\t\t\t\t\t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>\t\t\t\t\t\t<input type="hidden" name="paySuitEntityDo.certType" value="idcard"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 住址：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.curAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage-required="请输入住址" maxlength="200" value="{{curAddress}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">其他手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherMobile" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="multiMobile" data-errormessage-mobile="请填写正确的手机号(若多个手机号，请用 "," 隔开)"  maxlength="200" placeholder="可填写多个，用逗号（，）隔开" value="{{otherMobile}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">其他邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherEmail" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="email" data-errormessage-email="请填写正确的邮箱" maxlength="100" value="{{otherEmail}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td colspan="3"><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 该手机号不作是否电子送达的判断</td>\t\t\t</tr>\t\t</tbody>\t\t<tbody {{#isEqual entityType "normal"}}class="fn-hide"{{/isEqual}} data-role="legal">\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30" width="120"><span class="global-require fn-VA1D">*</span> 公司名：</td>\t\t\t\t<td colspan="1">\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.companyName" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入公司名。"  maxlength="50" value="{{companyName}}"                  \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}} />                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>                <td> </td>                <td colspan="3">                    可通过全国企业信用信息公示系统<a href="http://gsxt.saic.gov.cn" class="global-link" target="_blank">(http://gsxt.saic.gov.cn)</a>查询企业名称、地址、法定代表人等信息                </td>            </tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 法定代表人：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.legalRepresent" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入法定代表人。" maxlength="200" value="{{legalRepresent}}"                 \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span>公司注册地：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.companyAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" data-required="true" data-errormessage="请输入公司注册地。"  maxlength="300"  value="{{companyAddress}}"                 \t\t{{#isEqual status "correction"}}readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 法定代表人职位：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR10 kuma-form-item">\t\t\t\t\t\t{{#isEqual status "correction"}}\t\t\t\t\t\t\t<input name="paySuitEntityDo.job" type="hidden" value="{{job}}" />\t\t\t\t\t\t{{/isEqual}}\t\t\t\t\t\t<select class="fn-select fn-W100P kuma-input" name="paySuitEntityDo.job" \t\t\t\t\t\t{{#isEqual status "correction"}}disabled="disabled"{{/isEqual}}>\t\t\t\t\t\t\t<option value="manager" {{#isEqual job "manager"}}selected="selected"{{/isEqual}}>经理</option>\t\t\t\t\t\t\t<option value="chairman" {{#isEqual job "chairman"}}selected="selected"{{/isEqual}}>董事长</option>\t\t\t\t\t\t\t<option value="executiveChairman" {{#isEqual job "executiveChairman"}}selected="selected"{{/isEqual}}>执行董事长</option>\t\t\t\t\t\t</select>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">联系人：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text"  name="paySuitEntityDo.contact" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input fn-input-readonly" maxlength="200" value="{{contact}}"                 \t\t{{#isEqual status "correction"}} readonly="readonly" {{/isEqual}}/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 手机号码和邮箱至少必须填一项</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.mobile" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required" data-rule="mobile" data-errormessage-mobile="请填写正确的手机号码"  maxlength="11" placeholder="合同约定送达手机号码" {{#isEqual entityType "legal"}}value="{{mobile}}"{{/isEqual}}/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">邮箱：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" class="fn-input-text fn-input-text-sm fn-W100P kuma-input JS-prosecute-required"\t\t\t\t\t\t\t{{#isEqual isTest "y"}} data-rule="aliyunEmail" data-errormessage-email="请填写正确的阿里云邮箱"{{else}} data-rule="email" data-errormessage-email="请填写正确的邮箱" {{/isEqual}} \t\t\t\t\t\t\tname="paySuitEntityDo.email"  placeholder="合同约定送达邮箱" {{#isEqual entityType "legal"}} value="{{email}}"{{/isEqual}}  maxlength="100"/>\t\t\t\t\t\t\t<div class="fn-color-e94e49 fn-H24 fn-H24 fn-hide fn-PT6" data-role="verify"><i class="kuma-icon kuma-icon-error"></i>&nbsp;手机号与邮箱至少必须填一个</div>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30"><span class="global-require fn-VA1D">*</span> 通讯地址：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.mailAddress" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-required="true" data-errormessage="请输入通讯地址。"  maxlength="300"  value="{{mailAddress}}"/>                \t</div>\t\t\t\t</td>\t\t\t\t<td align="right" class="fn-LH30">固定电话：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">                \t\t<input type="text" name="paySuitEntityDo.phone" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input kuma-input" maxlength="15" data-rule="tel" data-errormessage-tel="请输入正确的格式(比如0571-88888888)。" value="{{phone}}"/>                \t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right" class="fn-LH30">其他手机号码：</td>\t\t\t\t<td>\t\t\t\t\t<div class="fn-MR30 kuma-form-item">\t\t\t\t\t\t<input type="text" name="paySuitEntityDo.otherMobile" class="fn-input-text fn-input-text-sm fn-W100P JS-prosecute-required kuma-input" data-rule="multiMobile" data-errormessage-mobile="请填写正确的手机号(若多个手机号，请用 "," 隔开)"  maxlength="200" placeholder="可填写多个，用逗号（，）隔开" value="{{otherMobile}}"/>\t\t\t\t\t</div>\t\t\t\t</td>\t\t\t</tr>\t\t\t<tr>\t\t\t\t<td align="right"> </td>\t\t\t\t<td><i class="kuma-icon kuma-icon-caution fn-color-eba433"></i> 该手机号不作是否电子送达的判断</td>\t\t\t</tr>\t\t</tbody>\t\t\t</table></div>', compile
});
define("common/handlerbars-debug", [], function(require, exports, module) {});