define(function(require, exports, module) { var Handlerbars = require("common/handlerbars"); var compile = Handlerbars.compile("<table class=\"push-data-table fn-table fn-table-data fn-table-td fn-table-border\" width=\"100%\">    <thead>        <tr>            <th>push通知日期</th>            <th>案件编号</th>            <th>店铺名称</th>            <th>卖家Nick(旺旺号)</th>            <th>是否已完成关联</th>            <th>推送状态</th>        </tr>    </thead>    <tbody>        {{#each this}}        <tr>            <td>{{formatData \'yyyy-MM-dd\' pushTime}}</td>            <td>{{caseNumber}}</td>            <td>{{shopName}}</td>            <td>{{sellerNickName}}</td>            {{#isEqual isAssociated \"n\"}}            <td>否</td>            {{else}}            <td>是</td>            {{/isEqual}}                        <td>{{#isEqual pushStatus \"failure\"}}失败{{/isEqual}}            {{#isEqual pushStatus \"doubleSuccess\"}}双向成功{{/isEqual}}            {{#isEqual pushStatus \"oneSuccess\"}}单向成功{{/isEqual}}</td>        </tr>        {{/each}}    </tbody>          </table>"); compile.source="<table class=\"push-data-table fn-table fn-table-data fn-table-td fn-table-border\" width=\"100%\">    <thead>        <tr>            <th>push通知日期</th>            <th>案件编号</th>            <th>店铺名称</th>            <th>卖家Nick(旺旺号)</th>            <th>是否已完成关联</th>            <th>推送状态</th>        </tr>    </thead>    <tbody>        {{#each this}}        <tr>            <td>{{formatData \'yyyy-MM-dd\' pushTime}}</td>            <td>{{caseNumber}}</td>            <td>{{shopName}}</td>            <td>{{sellerNickName}}</td>            {{#isEqual isAssociated \"n\"}}            <td>否</td>            {{else}}            <td>是</td>            {{/isEqual}}                        <td>{{#isEqual pushStatus \"failure\"}}失败{{/isEqual}}            {{#isEqual pushStatus \"doubleSuccess\"}}双向成功{{/isEqual}}            {{#isEqual pushStatus \"oneSuccess\"}}单向成功{{/isEqual}}</td>        </tr>        {{/each}}    </tbody>          </table>"; return compile; });