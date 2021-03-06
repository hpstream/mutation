## 1. 匹配字符串
### 1.1 两种模式
横向模糊匹配
```
var regex = /ab{2,5}c/g;
var string = "abc abbc abbbc abbbbc abbbbbc abbbbbbc";
console.log( string.match(regex) ); 
// => ["abbc", "abbbc", "abbbbc", "abbbbbc"]

```
纵向模糊匹配
```
var regex = /a[123]b/g;
var string = "a0b a1b a2b a3b a4b";
console.log( string.match(regex) ); 
// => ["a1b", "a2b", "a3b"]

```

### 1.2 字符组
> 常见表示形式 [abc] 匹配a,b，c中的字符
> 连字符 - [a-z] 匹配 a到z中的任意字符
> 取返操作 [^a] 匹配除了a的任意字符

**注意：**
[a-z] 不是表示匹配 a,-,z。而是a,b,c,d.....,x,y,z
如果指向匹配 a,-,z。可以 [-az] 或 [az-] 或 [a\-z]

** 间歇形式与字符组的对应
|简写形式 | 字符组 | 解释  |
|-|-| -|
|\d| [0-9]|表示是一位数字。记忆方式：其英文是digit（数字）。|
|\D| [^0-9]|表示除数字外的任意字符。|
|\w| [0-9a-zA-Z_]|表示数字、大小写字母和下划线。记忆方式：w是word的简写，也称单词字符。|
|\W| [^0-9a-zA-Z_]| 非单词字符。
|\s| [\t\v\n\r\f]|表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。记忆方式：s是space character的首字母。|
|\d| [^\t\v\n\r\f]|非空白符。|
|.| [^\n\r\u2028\u2029]|。通配符，表示几乎任意字符。换行符、回车符、行分隔符和段分隔符除外。记忆方式：想想省略号...中的每个点，都可以理解成占位符，表示任何类似的东西。|

### 1.3 量词

|写法 |  含义  |
|-|-|
|{m,}|表示至少出现m次。| 
|{m}|等价于{m,m}，表示出现m次。| 
|?| 等价于{0,1}，表示出现或者不出现。记忆方式：问号的意思表示，有吗？| 
|+|等价于{1,}，表示出现至少一次。记忆方式：加号是追加的意思，得先有一个，然后才考虑追加。| 
|*| 等价于{0,}，表示出现任意次，有可能不出现。记忆方式：看看天上的星星，可能一颗没有，可能零散有几颗，可能数也数不过来。| 


