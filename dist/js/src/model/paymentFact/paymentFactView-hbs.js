define("src/model/paymentFact/paymentFactView-hbs",["common/handlerbars"],function(require,exports,module){var Handlerbars=require("common/handlerbars"),compile=Handlerbars.compile('<table width="100%" class="fn-table fn-table-text">    <tr>        <td width="120" align="right">合同编号：</td>        <td>{{contractNum}}</td>    </tr>    <tr>        <td align="right">合同名称：</td>        <td>{{contractTitle}}</td>    </tr>    <tr>        <td align="right">合同签订日期：</td>        <td>{{contractDate}}</td>    </tr>    <tr>        <td align="right">签订方式：</td>        <td>{{signedMode}}</td>    </tr>    <tr>        <td align="right">贷款用途：</td>        <td>{{loanUse}}</td>    </tr>    <tr>        <td align="right">说明：</td>        <td>{{Explanation}}</td>    </tr></table>');return compile.source='<table width="100%" class="fn-table fn-table-text">    <tr>        <td width="120" align="right">合同编号：</td>        <td>{{contractNum}}</td>    </tr>    <tr>        <td align="right">合同名称：</td>        <td>{{contractTitle}}</td>    </tr>    <tr>        <td align="right">合同签订日期：</td>        <td>{{contractDate}}</td>    </tr>    <tr>        <td align="right">签订方式：</td>        <td>{{signedMode}}</td>    </tr>    <tr>        <td align="right">贷款用途：</td>        <td>{{loanUse}}</td>    </tr>    <tr>        <td align="right">说明：</td>        <td>{{Explanation}}</td>    </tr></table>',compile});
define("common/handlerbars",[],function(require,exports,module){});