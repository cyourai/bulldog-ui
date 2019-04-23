<!--&lt;!&ndash;-->
  <!--*改变主题需要同时设置：-->
    <!--1、editorOption.theme 的值-->
    <!--2、.cm-s-[name] (name即theme值)-->
 <!--&ndash;&gt;-->

<!--<template>-->
  <!--&lt;!&ndash; <div class="container"> &ndash;&gt;-->
  <!--<ComponentTable tableTitle="生成脚本"-->
                  <!--tableContent="脚本预览"-->
                  <!--:isEdit="this.isEdit()"-->
                  <!--:filterShow="false">-->
    <!--&lt;!&ndash; 选项卡 &ndash;&gt;-->
    <!--<div slot="radios"-->
         <!--class="table-content-header-radios">-->
      <!--<el-radio-group v-model="radio"-->
                      <!--size="small"-->
                      <!--@change="handleChange">-->
        <!--<el-radio-button label="Json"></el-radio-button>-->
        <!--<el-radio-button label="Javascript"></el-radio-button>-->
        <!--<el-radio-button label="Python"></el-radio-button>-->
        <!--<el-radio-button label="Perl"></el-radio-button>-->
        <!--<el-radio-button label="Yaml"></el-radio-button>-->
      <!--</el-radio-group>-->
    <!--</div>-->
    <!--&lt;!&ndash; 编辑器 &ndash;&gt;-->
    <!--<div slot="tableIn"-->
         <!--class="table-content-spe"-->
         <!--style="max-height:1000px;overflow:auto">-->
      <!--<codemirror :value="codeMirror"-->
                  <!--:options="editorOption"-->
                  <!--ref="myEditor"-->
                  <!--@change="codeChange">-->
      <!--</codemirror>-->
    <!--</div>-->
  <!--</ComponentTable>-->
  <!--&lt;!&ndash; </div> &ndash;&gt;-->
<!--</template>-->

<!--<script>-->
<!--import ComponentTable from '@/components/ComponentTable'-->
<!--import { codemirror } from 'vue-codemirror-lite'-->

<!--// language-->
<!--import 'codemirror/mode/python/python.js'-->
<!--require('codemirror/mode/javascript/javascript')-->
<!--require('codemirror/mode/vue/vue')-->

<!--// theme css-->
<!--import 'codemirror/addon/lint/lint.css'-->
<!--import 'codemirror/lib/codemirror.css'-->
<!--import 'codemirror/theme/base16-dark.css'-->
<!--import 'codemirror/theme/base16-light.css'-->
<!--import 'codemirror/theme/rubyblue.css'-->
<!--import 'codemirror/theme/erlang-dark.css'-->
<!--import 'codemirror/theme/monokai.css'-->
<!--import 'codemirror/theme/Cobalt.css'-->
<!--import 'codemirror/theme/Mbo.css'-->
<!--import 'codemirror/theme/Lesser-Dark.css'-->
<!--import 'codemirror/theme/blackboard.css'-->
<!--import 'codemirror/theme/Solarized.css'-->

<!--// closebrackets-->
<!--import 'codemirror/addon/edit/closebrackets.js'-->

<!--require('script-loader!jsonlint')-->
<!--import 'codemirror/addon/lint/lint'-->
<!--import 'codemirror/addon/lint/json-lint'-->

<!--require('codemirror/addon/hint/show-hint.js')-->
<!--require('codemirror/addon/hint/show-hint.css')-->
<!--require('codemirror/addon/hint/javascript-hint.js')-->

<!--export default {-->
  <!--name: 'codeMirror',-->
  <!--components: {-->
    <!--ComponentTable,-->
    <!--codemirror-->
  <!--},-->
  <!--data() {-->
    <!--return {-->
      <!--codeMirror: `[-->
  <!--{-->
    <!--"items": [-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAUUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "UKOIL"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "CORN"-->
      <!--}-->
    <!--],-->
    <!--"name": ""-->
  <!--},-->
  <!--{-->
    <!--"items": [-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAUUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAGUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "AUTD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "AGTD"-->
      <!--}-->
    <!--],-->
    <!--"name": "贵金属"-->
  <!--}-->
<!--]`,-->
      <!--editorOption: {-->
        <!--mode: 'application/json',-->
        <!--theme: 'rubyblue',-->
        <!--extraKeys: { 'Ctrl-Space': 'autocomplete' },-->
        <!--autoCloseBrackets: true,-->
        <!--autofocus: true,-->
        <!--styleActiveLine: true,-->
        <!--lineNumbers: true,-->
        <!--line: true,-->
        <!--lineWrapping: 'wrap',-->
        <!--cursorHeight: 0.85,-->
        <!--scrollbarStyle: null-->
      <!--},-->
      <!--radio: 'Json'-->
    <!--}-->
  <!--},-->
  <!--computed: {-->
    <!--editor() {-->
      <!--// get current editor object-->
      <!--return this.$refs.myEditor.editor-->
    <!--}-->
  <!--},-->
  <!--created() {},-->
  <!--methods: {-->
    <!--isEdit() {-->
      <!--return typeof this.codeMirror !== 'undefined'-->
    <!--},-->
    <!--handleChange(radio) {-->
      <!--// 获取元素并改变其class-->
      <!--const CodeMirrorWrap = document.getElementsByClassName('CodeMirror-wrap')-->
      <!--// console.log(CodeMirrorWrap)-->
      <!--// console.log(CodeMirrorWrap[0].attributes[0].nodeValue)-->
      <!--CodeMirrorWrap[0].attributes[0].nodeValue = 'CodeMirror CodeMirror-wrap '-->
      <!--// 切换radio -> 切换主题-->
      <!--switch (radio) {-->
        <!--case 'Json':-->
          <!--this.editorOption.mode = 'application/json'-->
          <!--this.editorOption.theme = 'rubyblue'-->
          <!--CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-rubyblue'-->
          <!--this.codeMirror = `[-->
  <!--{-->
    <!--"items": [-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAUUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "UKOIL"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "CORN"-->
      <!--}-->
    <!--],-->
    <!--"name": ""-->
  <!--},-->
  <!--{-->
    <!--"items": [-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAUUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "XAGUSD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "AUTD"-->
      <!--},-->
      <!--{-->
        <!--"market_type": "forexdata",-->
        <!--"symbol": "AGTD"-->
      <!--}-->
    <!--],-->
    <!--"name": "贵金属"-->
  <!--}-->
<!--]`-->
          <!--break-->
        <!--case 'Javascript':-->
          <!--this.editorOption.mode = 'text/javascript'-->
          <!--this.editorOption.theme = 'base16-dark'-->
          <!--CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-base16-dark'-->
          <!--this.codeMirror = `import someResource from 'codemirror/some-resource'-->
<!--export default {-->
  <!--data () {-->
    <!--// 这是一个包含、代码提示、折叠、选中、sublime模式...的编辑器-->
    <!--// 按下Ctrl键可以体验代码提示-->
    <!--// 可以尝试sublime下的快捷键操作-->
    <!--return {-->
      <!--exampleCode: 'const a = 10',-->
      <!--cmOption: {-->
        <!--tabSize: 4,-->
        <!--styleActiveLine: true,-->
        <!--lineNumbers: true,-->
        <!--line: true,-->
        <!--mode: 'text/javascript',-->
        <!--lineWrapping: true,-->
        <!--theme: 'default'-->
      <!--}-->
    <!--}-->
  <!--},-->
  <!--components: examples-->
<!--}`-->
          <!--break-->
        <!--case 'Python':-->
          <!--this.editorOption.mode = 'text/x-python'-->
          <!--this.editorOption.theme = 'base16-light'-->
          <!--CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-monokai'-->
          <!--/* eslint-disable */-->
          <!--this.codeMirror = `# emacs键位的编辑器-->
<!--# Literals-->
<!--1234-->
<!--0.0e101-->
<!--.123-->
<!--0b01010011100-->
<!--0o01234567-->
<!--0x0987654321abcdef-->
<!--7-->
<!--2147483647-->
<!--3L-->
<!--79228162514264337593543950336L-->
<!--0x100000000L-->
<!--79228162514264337593543950336-->
<!--0xdeadbeef-->
<!--3.14j-->
<!--10.j-->
<!--10j-->
<!--.001j-->
<!--1e100j-->
<!--3.14e-10j-->


<!--# String Literals-->
<!--'For''-->
<!--"God""-->
<!--"""so loved-->
<!--the world"""-->
<!--'''that he gave-->
<!--his only begotten' '''-->
<!--'that whosoever believeth in him'-->
<!--''-->

<!--# Identifiers-->
<!--__a__-->
<!--a.b-->
<!--a.b.c-->

<!--#Unicode identifiers on Python3-->
<!--# a = xddot-->
<!--a⃗ = ẍ-->
<!--# a = vdot-->
<!--a⃗ = v̇-->

<!--#Fec = m cdot aec-->
<!--F⃗ = m•a⃗-->

<!--# Operators-->
<!--+ - * / % & | ^ ~ < >-->
<!--== != <= >= <> << >> // **-->
<!--and or not in is-->

<!--#infix matrix multiplication operator (PEP 465)-->
<!--A @ B-->

<!--# Keywords-->
<!--as assert break class continue def del elif else except-->
<!--finally for from global if import lambda pass raise-->
<!--return try while with yield-->

<!--# Python 2 Keywords (otherwise Identifiers)-->
<!--exec print-->

<!--# Python 3 Keywords (otherwise Identifiers)-->
<!--nonlocal-->

<!--# Types-->
<!--bool classmethod complex dict enumerate float frozenset int list object-->
<!--property reversed set slice staticmethod str super tuple type-->

<!--# Python 2 Types (otherwise Identifiers)-->
<!--basestring buffer file long unicode xrange-->

<!--# Python 3 Types (otherwise Identifiers)-->
<!--bytearray bytes filter map memoryview open range zip-->

<!--# Some Example codeMirror-->
<!--import os-->
<!--from package import ParentClass-->

<!--@nonsenseDecorator-->
<!--def doesNothing():-->
    <!--pass-->

<!--class ExampleClass(ParentClass):-->
    <!--@staticmethod-->
    <!--def example(inputStr):-->
        <!--a = list(inputStr)-->
        <!--a.reverse()-->
        <!--return ''.join(a)-->

    <!--def __init__(self, mixin = 'Hello'):-->
        <!--self.mixin = mixin`-->
          <!--break-->
        <!--case 'Perl':-->
          <!--this.editorOption.mode = 'text/perl'-->
          <!--this.editorOption.theme = 'Cobalt'-->
          <!--CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-cobalt'-->
          <!--this.codeMirror = `#!/usr/bin/perl-->

<!--use Something qw(func1 func2);-->

<!--# strings-->
<!--my $s1 = qq'single line';-->
<!--our $s2 = q(multi- -->
              <!--line);-->

<!--=item Something-->
	<!--Example.-->
<!--=cut-->

<!--my $html=<<'HTML'-->
<!--<html>-->
<!--<title>hi!</title>-->
<!--</html>-->
<!--HTML-->

<!--print "first,".join(',', 'second', qq~third~);-->

<!--if($s1 =~ m[(?<!\s)(l.ne)\z]o) {-->
	<!--$h->{$1}=$$.' predefined variables';-->
	<!--$s2 =~ s/\-line//ox;-->
	<!--$s1 =~ s[-->
		  <!--line ]-->
		<!--[-->
		  <!--block-->
		<!--]ox;-->
<!--}-->

<!--1; # numbers and comments-->

<!--__END__-->
<!--something...`-->
          <!--break-->
        <!--case 'Yaml':-->
          <!--this.editorOption.mode = 'text/yaml'-->
          <!--this.editorOption.theme = 'Mbo'-->
          <!--CodeMirrorWrap[0].attributes[0].nodeValue += 'cm-s-mbo'-->
          <!--this.codeMirror = `-&#45;&#45; # Favorite movies-->
<!-- - Casablanca-->
<!-- - North by Northwest-->
<!-- - The Man Who Wasn't There-->
<!-- -&#45;&#45; # Shopping list-->
<!--[milk, pumpkin pie, eggs, juice]-->
<!-- -&#45;&#45; # Indented Blocks, common in YAML data files, use indentation and new lines to separate the key: value pairs-->
  <!--name: John Smith-->
  <!--age: 33-->
<!-- -&#45;&#45; # Inline Blocks, common in YAML data streams, use commas to separate the key: value pairs between braces-->
<!--{name: John Smith, age: 33}-->
<!-- -&#45;&#45;-->
<!--receipt:     Oz-Ware Purchase Invoice-->
<!--date:        2007-08-06-->
<!--customer:-->
    <!--given:   Dorothy-->
    <!--family:  Gale-->

<!--items:-->
    <!-- - part_no:   A4786-->
      <!--descrip:   Water Bucket (Filled)-->
      <!--price:     1.47-->
      <!--quantity:  4-->

    <!-- - part_no:   E1628-->
      <!--descrip:   High Heeled "Ruby" Slippers-->
      <!--size:       8-->
      <!--price:     100.27-->
      <!--quantity:  1-->

<!--bill-to:  &id001-->
    <!--street: |-->
            <!--123 Tornado Alley-->
            <!--Suite 16-->
    <!--city:   East Centerville-->
    <!--state:  KS-->

<!--ship-to:  *id001-->

<!--specialDelivery:  >-->
    <!--Follow the Yellow Brick-->
    <!--Road to the Emerald City.-->
    <!--Pay no attention to the-->
    <!--man behind the curtain.-->
<!--...`-->
          <!--break-->
      <!--}-->
      <!--// console.log(radio)-->
    <!--},-->
    <!--codeChange() {}-->
  <!--}-->
<!--}-->
<!--</script>-->

<!--<style rel="stylesheet/scss" lang="scss" scoped>-->
<!--@import '~@/styles/smart-ui/smart-ui.scss';-->
<!--.vue-codemirror-wrap /deep/ {-->
  <!--height: 100%;-->
  <!--position: relative;-->
  <!--.CodeMirror {-->
    <!--height: auto;-->
    <!--min-height: 300px;-->
  <!--}-->
  <!--.CodeMirror-scroll {-->
    <!--min-height: 300px;-->
  <!--}-->
  <!--.cm-s-rubyblue span.cm-string {-->
    <!--color: #f08047;-->
  <!--}-->
<!--}-->

<!--.CodeMirror {-->
  <!--border: 1px solid #eee;-->
  <!--height: auto;-->
  <!--&-scroll {-->
    <!--height: auto;-->
    <!--overflow-y: hidden;-->
    <!--overflow-x: auto;-->
  <!--}-->
<!--}-->

<!--// 滚动条样式-->
<!--.table-content-spe::-webkit-scrollbar-track {-->
  <!--box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);-->
  <!--border-radius: 5px;-->
<!--}-->
<!--.table-content-spe::-webkit-scrollbar-thumb {-->
  <!--background-color: rgba(64, 158, 255, 0.5);-->
  <!--outline: 1px solid slategrey;-->
  <!--border-radius: 5px;-->
<!--}-->
<!--.table-content-spe::-webkit-scrollbar {-->
  <!--width: 10px;-->
<!--}-->
<!--</style>-->

