define("src/bus/suit/simCase/common/feedback-hbs",["common/handlerbars"],function(require,exports,module){var Handlerbars=require("common/handlerbars"),compile=Handlerbars.compile('<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>');return compile.source='<div class="feedback fn-hide">\t<div class="ch-content">\t\t<form action="" method="post" class="fn-MT40 fn-ML45" id="paraform" >\t\t\t<table class="fn-table  fn-table-input">\t\t\t\t<tr>\t\t\t\t\t<td width="70" align="right" class="fn-FS14 fn-WRH fn-LH30">您的邮箱：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<input type="text" name="feedEmail" class="fn-input-text fn-input-text-sm fn-W230 kuma-input" data-rule="email" data-errormessage-required="请填写邮箱。" maxlength="50" data-errormessage-email="请填写正确的邮箱。" data-widget="validator" placeholder="输入您的邮箱，以方便联系您">\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td class="fn-FS14 fn-WRH fn-LH36">反馈内容：</td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t<textarea name="suggestion"  data-trim="true" class="fn-textarea kuma-input  fn-W230 fn-H80" placeholder="您想反馈的问题、意见和建议，这将是我们产品持续优化的方向" value="" maxlength="500" data-widget="validator" data-required="true" data-errormessage="请输入反馈内容。" maxlength="12000"></textarea>\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t\t<tr>\t\t\t\t\t<td></td>\t\t\t\t\t<td>\t\t\t\t\t\t<div class="kuma-form-item">\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input type="button" class="fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-wrh" data-trigger="submit" value="发送">\t\t\t\t\t\t\t<input type="button" class="fn-ML10 fn-btn fn-btn-primary fn-btn-sm  fn-LH28 fn-FS14 fn-W70 fn-WRH fn-BGC-ddd fn-BoCo-ebebeb" data-trigger="cancal" value="取消">\t\t\t\t\t\t</div>\t\t\t\t\t</td>\t\t\t\t</tr>\t\t\t</table>\t\t</form>\t</div>\t<div class="ch-shadow"></div><div>',compile});
define("common/handlerbars",[],function(require,exports,module){});