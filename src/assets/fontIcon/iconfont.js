(function(window){var svgSprite='<svg><symbol id="el-icon-z045" viewBox="0 0 1024 1024"><path d="M498.095 146.134l403.416 403.415c17.387 17.387 45.576 17.387 62.963 0s17.387-45.576 0-62.963L499.888 22 35.302 486.586c-17.388 17.387-17.388 45.575 0 62.963 17.387 17.387 45.576 17.387 62.964 0L498.095 146.134zM498.817 592.073l402.693 402.693c17.387 17.387 45.576 17.387 62.963 0s17.387-45.576 0-62.963L499.888 467.219 35.302 931.804c-17.388 17.387-17.388 45.576 0 62.963 17.387 17.387 45.576 17.387 62.964 0L498.817 592.073z"  ></path></symbol><symbol id="el-icon-zelvgongyonggengduo1" viewBox="0 0 1024 1024"><path d="M501.68 883.673 98.264 480.258c-17.387-17.387-45.576-17.387-62.963 0-17.387 17.387-17.387 45.576 0 62.963l464.586 464.586 464.586-464.586c17.387-17.387 17.387-45.576 0-62.963s-45.577-17.387-62.964 0L501.68 883.673zM500.957 437.733 98.264 35.04c-17.387-17.387-45.576-17.387-62.963 0-17.387 17.387-17.387 45.576 0 62.963l464.586 464.585L964.473 98.003c17.387-17.387 17.387-45.576 0-62.963-17.387-17.387-45.577-17.387-62.964 0L500.957 437.733z"  ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)