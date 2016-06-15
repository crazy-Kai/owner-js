创建RegExp对象
new RegExp(pattern, attributes);

直接量语法
/pattern/attributes

参数
pattern 是一个字符串，指定了正则表达式的模式或其他正则表达式。
attributes 是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配。ECMAScript标准化之前，不支持m属性。如果pattern是正则表达式，而不是字符串，则必须省略该参数。

attributes修饰符
i 执行对大小写不敏感的匹配。
g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。
m 执行多行匹配。

pattern
方括号————方括号用于查找某个范围内的字符
[abc]   查找方括号之间的任何字符。
[^abc]  查找任何不在方括号之间的字符。
[0-9]   查找任何从0至9的数字。
[a-z]   查找任何从小写a到小写z的字符。
[A-Z]   查找任何从大写A到大写Z的字符。
[A-z]   查找任何从大写A到小写z的字符。
[adgk]  查找给定集合内的任何字符。
[^adgk] 查找给定集合外的任何字符。

圆括号————分组
(red|blue|green)  查找任何指定的选项。
(x)   分组并记录匹配到的字符串，如(abc){3}表示abc重复3遍；/(abc)\1/.test('abcabc')这里\1表示(abc)
(?:x) 仅分组，/(?:abc)(def)\1/.test('abcdefdef')，此处abc仅分组，\1表示def

//方括号内的每个字符是独立查找的，圆括号内一个单词为一个整体

元字符————元字符（Metacharacter）是拥有特殊含义的字符
.   查找任意字符，除了换行和行结束符。
\w  查找单词字符。单词字符包括：a-z、A-Z、0-9，以及下划线。
\W  查找非单词字符。
\d  查找数字。
\D  查找非数字字符。
\s  查找空白字符。空白字符可以是：空格符、制表符、回车符、换行符、垂直换行符、换页符
\S  查找非空白字符。
\b  匹配单词边界。\b元字符通常用于查找位于单词的开头或结尾的匹配。直接量语法：/\bregexp/，如/\bW3/g 对字符串中的单词的开头或结尾进行 "W3" 的全局搜索
\B  匹配非单词边界。
\0  查找 NUL 字符。
\n  查找换行符。
\f  查找换页符。
\r	查找回车符。
\t	查找制表符。
\v	查找垂直制表符。
\xxx	查找以八进制数 xxx 规定的字符。
\xdd	查找以十六进制数 dd 规定的字符。
\uxxxx	查找以十六进制数 xxxx 规定的 Unicode 字符。

量词
n+	    匹配任何包含至少 1 个 n 的字符串。         //如abc+将匹配abc、abcccc，而不匹配ab
n*	    匹配任何包含 0 个或多个 n 的字符串。       //如abc*将匹配ab、abc、abcccc
n+?		加问号后，匹配尽量少的n，此处最小为1个     //如abccccc将匹配abc
n*?		加问号后，匹配尽量少的n，此处最小为0个     //如abccccc将匹配ab
n?	    匹配任何包含 0 个或 1 个 n 的字符串。      //如/10?/g 对 "1" 进行全局搜索，包括其后紧跟的零个或一个 "0"
n{X}	匹配包含 =X 个 n 的序列的字符串。           //如/\d{4}/g 对包含四位数字序列的子串进行全局搜索
n{X,Y}	匹配包含 X 或 Y 个 n 的序列的字符串。      //如/\d{3,4}/g 对包含三位或四位数字序列的子串进行全局搜索
n{X,}	匹配包含 >=X 个 n 的序列的字符串。       //如/\d{3,}/g 对包含至少三位数字序列的子串进行全局搜索
n$	    匹配任何结尾为 n 的字符串。                //如/is$/g 对字符串结尾的 "is" 进行全局搜索
^n	    匹配任何开头为 n 的字符串。                //如/^Is/g 对字符串开头的 "is" 进行全局搜索
?=n	    匹配任何其后紧接指定字符串 n 的字符串。    //如/is(?= all)/g 对其后紧跟 "all" 的 "is" 进行全局搜索
?!n	    匹配任何其后没有紧接指定字符串 n 的字符串。//如/is(?! all)/gi 对其后没有紧跟 "all" 的 "is" 进行全局搜索

RegExp 对象属性
RegExpObject.ignoreCase 是否设置 "i" 标志，如果设置了 "i" 标志，则返回 true，否则返回 false。
RegExpObject.global     是否具有 "g" 标志，如果设置了 "g" 标志，则该属性为 true，否则为 false。
RegExpObject.multiline  是否具有 "m" 标志，如果设置了 "m" 标志，则该属性为 true，否则为 false。
RegExpObject.source     返回模式匹配所用的文本，该文本不包括正则表达式直接量使用的定界符，也不包括标志 g、i、m。
RegExpObject.lastIndex  用于规定下次匹配的起始位置

RegExp 对象方法
RegExpObject.compile(regexp,modifier)  用于在脚本执行过程中编译/改变/重新编译正则表达式。
/* @param regexp正则表达式；modifier规定匹配的类型。"g" 用于全局匹配，"i" 用于区分大小写，"gi" 用于全局区分大小写的匹配。
 */

RegExpObject.exec(string) 
/* @param [String] 必需。要检索的字符串。
 * @return [Array] 匹配到结果时，返回一个数组，没匹配到时返回null。
 */

 RegExpObject.test(string) 
/* @param [String] 必需。要检索的字符串。
 * @return [Array] 匹配到结果时，则返回 true，否则返回 false。
 * @remark 与这个表示式是等价的：(r.exec(s) != null)。
 */
中文的unicode字面量表达式的范围在：\u4E00-\u9FA5之间！
 版权归张筱颖所有，非允许勿转载