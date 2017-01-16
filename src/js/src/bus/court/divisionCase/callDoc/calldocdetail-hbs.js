define(function(require, exports, module) { var Handlerbars = require("common/handlerbars"); var compile = Handlerbars.compile("{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'submit\'}}	        <tr>	        <td align=\"right\">提交时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual preStatus \'submit\'}}	    {{#isEqual curStatus \'audit\'}}	        <tr>	        <td align=\"right\">待审核时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>        {{/isEqual}}		{{/isEqual}}	{{/if}}{{/each}}		{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'correction\'}}	        <tr>	        <td align=\"right\">审核时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual preStatus \'correction\'}}	    {{#isEqual curStatus \'audit\'}}	        <tr>	        <td align=\"right\">立案补正时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>        {{/isEqual}}		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'cased\'}}	        <tr>	        <td align=\"right\">立案时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'accused_confirm\'}}	        <tr>	        <td align=\"right\">确认送达时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'put_proof\'}}	        <tr>	        <td align=\"right\">分案时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'put_proof\'}}	        <tr>	        <td align=\"right\">举证开始时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'oppugn_proof\'}}	        <tr>	        <td align=\"right\">质证开始时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'sentenced\'}}	        <tr>	        <td align=\"right\">已判决时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'cancel_apply\'}}	        <tr>	        <td align=\"right\">原告撤销申请时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'dropped\'}}	        <tr>	        <td align=\"right\">原告已撤诉时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'not_be_served\'}}	        <tr>	        <td align=\"right\">被告无法送达时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'jurisediction_objection\'}}	        <tr>	        <td align=\"right\">管辖异议成立时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'not_accepted\'}}	        <tr>	        <td align=\"right\">不予受理时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'return\'}}	        <tr>	        <td align=\"right\">退回时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}"); compile.source="{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'submit\'}}	        <tr>	        <td align=\"right\">提交时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual preStatus \'submit\'}}	    {{#isEqual curStatus \'audit\'}}	        <tr>	        <td align=\"right\">待审核时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>        {{/isEqual}}		{{/isEqual}}	{{/if}}{{/each}}		{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'correction\'}}	        <tr>	        <td align=\"right\">审核时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual preStatus \'correction\'}}	    {{#isEqual curStatus \'audit\'}}	        <tr>	        <td align=\"right\">立案补正时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>        {{/isEqual}}		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'cased\'}}	        <tr>	        <td align=\"right\">立案时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'accused_confirm\'}}	        <tr>	        <td align=\"right\">确认送达时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'put_proof\'}}	        <tr>	        <td align=\"right\">分案时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'put_proof\'}}	        <tr>	        <td align=\"right\">举证开始时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'oppugn_proof\'}}	        <tr>	        <td align=\"right\">质证开始时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'sentenced\'}}	        <tr>	        <td align=\"right\">已判决时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'cancel_apply\'}}	        <tr>	        <td align=\"right\">原告撤销申请时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'dropped\'}}	        <tr>	        <td align=\"right\">原告已撤诉时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'not_be_served\'}}	        <tr>	        <td align=\"right\">被告无法送达时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'jurisediction_objection\'}}	        <tr>	        <td align=\"right\">管辖异议成立时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'not_accepted\'}}	        <tr>	        <td align=\"right\">不予受理时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}{{#each this}} 	{{\#if curStatus}}	    {{#isEqual curStatus \'return\'}}	        <tr>	        <td align=\"right\">退回时间：</td>	        <td align=\"right\">{{formatData \'yyyy-MM-dd HH:mm:ss\' operateTime}}</td>	        </tr>		{{/isEqual}}	{{/if}}{{/each}}"; return compile; });