define("src/model/addspectator/spectatorSeed-hbs",["common/handlerbars"],function(require,exports,module){var Handlerbars=require("common/handlerbars"),compile=Handlerbars.compile('{{#each this}}    <tr>        <td>            {{rightIndex @index}}        </td>        <td>            {{mobile}}        </td>        <td>            {{name}}        </td>        <td>            <a href="javascript:;" data-role="delete" class="fn-btn-link" data-param=\'{"suitEntityId": "{{securityId}}"}\'>删除</a>        </td>       </tr>{{/each}}');return compile.source='{{#each this}}    <tr>        <td>            {{rightIndex @index}}        </td>        <td>            {{mobile}}        </td>        <td>            {{name}}        </td>        <td>            <a href="javascript:;" data-role="delete" class="fn-btn-link" data-param=\'{"suitEntityId": "{{securityId}}"}\'>删除</a>        </td>       </tr>{{/each}}',compile});
define("common/handlerbars",[],function(require,exports,module){});