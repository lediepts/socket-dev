"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[4366],{94366:function(e,t,n){n.d(t,{Z:function(){return Fe}});var o=n(87462),r=n(63366),i=n(29439),a=n(72791),s=n(6117),f=n(62876),p=n(84913);function c(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function l(e){return e instanceof c(e).Element||e instanceof Element}function u(e){return e instanceof c(e).HTMLElement||e instanceof HTMLElement}function d(e){return"undefined"!==typeof ShadowRoot&&(e instanceof c(e).ShadowRoot||e instanceof ShadowRoot)}var m=Math.max,h=Math.min,v=Math.round;function y(){var e=navigator.userAgentData;return null!=e&&e.brands&&Array.isArray(e.brands)?e.brands.map((function(e){return e.brand+"/"+e.version})).join(" "):navigator.userAgent}function b(){return!/^((?!chrome|android).)*safari/i.test(y())}function g(e,t,n){void 0===t&&(t=!1),void 0===n&&(n=!1);var o=e.getBoundingClientRect(),r=1,i=1;t&&u(e)&&(r=e.offsetWidth>0&&v(o.width)/e.offsetWidth||1,i=e.offsetHeight>0&&v(o.height)/e.offsetHeight||1);var a=(l(e)?c(e):window).visualViewport,s=!b()&&n,f=(o.left+(s&&a?a.offsetLeft:0))/r,p=(o.top+(s&&a?a.offsetTop:0))/i,d=o.width/r,m=o.height/i;return{width:d,height:m,top:p,right:f+d,bottom:p+m,left:f,x:f,y:p}}function w(e){var t=c(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function x(e){return e?(e.nodeName||"").toLowerCase():null}function O(e){return((l(e)?e.ownerDocument:e.document)||window.document).documentElement}function P(e){return g(O(e)).left+w(e).scrollLeft}function E(e){return c(e).getComputedStyle(e)}function j(e){var t=E(e),n=t.overflow,o=t.overflowX,r=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+r+o)}function R(e,t,n){void 0===n&&(n=!1);var o=u(t),r=u(t)&&function(e){var t=e.getBoundingClientRect(),n=v(t.width)/e.offsetWidth||1,o=v(t.height)/e.offsetHeight||1;return 1!==n||1!==o}(t),i=O(t),a=g(e,r,n),s={scrollLeft:0,scrollTop:0},f={x:0,y:0};return(o||!o&&!n)&&(("body"!==x(t)||j(i))&&(s=function(e){return e!==c(e)&&u(e)?{scrollLeft:(t=e).scrollLeft,scrollTop:t.scrollTop}:w(e);var t}(t)),u(t)?((f=g(t,!0)).x+=t.clientLeft,f.y+=t.clientTop):i&&(f.x=P(i))),{x:a.left+s.scrollLeft-f.x,y:a.top+s.scrollTop-f.y,width:a.width,height:a.height}}function k(e){var t=g(e),n=e.offsetWidth,o=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-o)<=1&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:o}}function D(e){return"html"===x(e)?e:e.assignedSlot||e.parentNode||(d(e)?e.host:null)||O(e)}function A(e){return["html","body","#document"].indexOf(x(e))>=0?e.ownerDocument.body:u(e)&&j(e)?e:A(D(e))}function M(e,t){var n;void 0===t&&(t=[]);var o=A(e),r=o===(null==(n=e.ownerDocument)?void 0:n.body),i=c(o),a=r?[i].concat(i.visualViewport||[],j(o)?o:[]):o,s=t.concat(a);return r?s:s.concat(M(D(a)))}function Z(e){return["table","td","th"].indexOf(x(e))>=0}function T(e){return u(e)&&"fixed"!==E(e).position?e.offsetParent:null}function L(e){for(var t=c(e),n=T(e);n&&Z(n)&&"static"===E(n).position;)n=T(n);return n&&("html"===x(n)||"body"===x(n)&&"static"===E(n).position)?t:n||function(e){var t=/firefox/i.test(y());if(/Trident/i.test(y())&&u(e)&&"fixed"===E(e).position)return null;var n=D(e);for(d(n)&&(n=n.host);u(n)&&["html","body"].indexOf(x(n))<0;){var o=E(n);if("none"!==o.transform||"none"!==o.perspective||"paint"===o.contain||-1!==["transform","perspective"].indexOf(o.willChange)||t&&"filter"===o.willChange||t&&o.filter&&"none"!==o.filter)return n;n=n.parentNode}return null}(e)||t}var W="top",B="bottom",H="right",S="left",C="auto",V=[W,B,H,S],q="start",N="end",I="clippingParents",U="viewport",F="popper",_="reference",z=V.reduce((function(e,t){return e.concat([t+"-"+q,t+"-"+N])}),[]),X=[].concat(V,[C]).reduce((function(e,t){return e.concat([t,t+"-"+q,t+"-"+N])}),[]),Y=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function G(e){var t=new Map,n=new Set,o=[];function r(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var o=t.get(e);o&&r(o)}})),o.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||r(e)})),o}function J(e){var t;return function(){return t||(t=new Promise((function(n){Promise.resolve().then((function(){t=void 0,n(e())}))}))),t}}var K={placement:"bottom",modifiers:[],strategy:"absolute"};function Q(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"===typeof e.getBoundingClientRect)}))}function $(e){void 0===e&&(e={});var t=e,n=t.defaultModifiers,o=void 0===n?[]:n,r=t.defaultOptions,i=void 0===r?K:r;return function(e,t,n){void 0===n&&(n=i);var r={placement:"bottom",orderedModifiers:[],options:Object.assign({},K,i),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},a=[],s=!1,f={state:r,setOptions:function(n){var s="function"===typeof n?n(r.options):n;p(),r.options=Object.assign({},i,r.options,s),r.scrollParents={reference:l(e)?M(e):e.contextElement?M(e.contextElement):[],popper:M(t)};var c=function(e){var t=G(e);return Y.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}(function(e){var t=e.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{});return Object.keys(t).map((function(e){return t[e]}))}([].concat(o,r.options.modifiers)));return r.orderedModifiers=c.filter((function(e){return e.enabled})),r.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,o=void 0===n?{}:n,i=e.effect;if("function"===typeof i){var s=i({state:r,name:t,instance:f,options:o}),p=function(){};a.push(s||p)}})),f.update()},forceUpdate:function(){if(!s){var e=r.elements,t=e.reference,n=e.popper;if(Q(t,n)){r.rects={reference:R(t,L(n),"fixed"===r.options.strategy),popper:k(n)},r.reset=!1,r.placement=r.options.placement,r.orderedModifiers.forEach((function(e){return r.modifiersData[e.name]=Object.assign({},e.data)}));for(var o=0;o<r.orderedModifiers.length;o++)if(!0!==r.reset){var i=r.orderedModifiers[o],a=i.fn,p=i.options,c=void 0===p?{}:p,l=i.name;"function"===typeof a&&(r=a({state:r,options:c,name:l,instance:f})||r)}else r.reset=!1,o=-1}}},update:J((function(){return new Promise((function(e){f.forceUpdate(),e(r)}))})),destroy:function(){p(),s=!0}};if(!Q(e,t))return f;function p(){a.forEach((function(e){return e()})),a=[]}return f.setOptions(n).then((function(e){!s&&n.onFirstUpdate&&n.onFirstUpdate(e)})),f}}var ee={passive:!0};function te(e){return e.split("-")[0]}function ne(e){return e.split("-")[1]}function oe(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function re(e){var t,n=e.reference,o=e.element,r=e.placement,i=r?te(r):null,a=r?ne(r):null,s=n.x+n.width/2-o.width/2,f=n.y+n.height/2-o.height/2;switch(i){case W:t={x:s,y:n.y-o.height};break;case B:t={x:s,y:n.y+n.height};break;case H:t={x:n.x+n.width,y:f};break;case S:t={x:n.x-o.width,y:f};break;default:t={x:n.x,y:n.y}}var p=i?oe(i):null;if(null!=p){var c="y"===p?"height":"width";switch(a){case q:t[p]=t[p]-(n[c]/2-o[c]/2);break;case N:t[p]=t[p]+(n[c]/2-o[c]/2)}}return t}var ie={top:"auto",right:"auto",bottom:"auto",left:"auto"};function ae(e){var t,n=e.popper,o=e.popperRect,r=e.placement,i=e.variation,a=e.offsets,s=e.position,f=e.gpuAcceleration,p=e.adaptive,l=e.roundOffsets,u=e.isFixed,d=a.x,m=void 0===d?0:d,h=a.y,y=void 0===h?0:h,b="function"===typeof l?l({x:m,y:y}):{x:m,y:y};m=b.x,y=b.y;var g=a.hasOwnProperty("x"),w=a.hasOwnProperty("y"),x=S,P=W,j=window;if(p){var R=L(n),k="clientHeight",D="clientWidth";if(R===c(n)&&"static"!==E(R=O(n)).position&&"absolute"===s&&(k="scrollHeight",D="scrollWidth"),r===W||(r===S||r===H)&&i===N)P=B,y-=(u&&R===j&&j.visualViewport?j.visualViewport.height:R[k])-o.height,y*=f?1:-1;if(r===S||(r===W||r===B)&&i===N)x=H,m-=(u&&R===j&&j.visualViewport?j.visualViewport.width:R[D])-o.width,m*=f?1:-1}var A,M=Object.assign({position:s},p&&ie),Z=!0===l?function(e,t){var n=e.x,o=e.y,r=t.devicePixelRatio||1;return{x:v(n*r)/r||0,y:v(o*r)/r||0}}({x:m,y:y},c(n)):{x:m,y:y};return m=Z.x,y=Z.y,f?Object.assign({},M,((A={})[P]=w?"0":"",A[x]=g?"0":"",A.transform=(j.devicePixelRatio||1)<=1?"translate("+m+"px, "+y+"px)":"translate3d("+m+"px, "+y+"px, 0)",A)):Object.assign({},M,((t={})[P]=w?y+"px":"",t[x]=g?m+"px":"",t.transform="",t))}var se={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,o=e.name,r=n.offset,i=void 0===r?[0,0]:r,a=X.reduce((function(e,n){return e[n]=function(e,t,n){var o=te(e),r=[S,W].indexOf(o)>=0?-1:1,i="function"===typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*r,[S,H].indexOf(o)>=0?{x:s,y:a}:{x:a,y:s}}(n,t.rects,i),e}),{}),s=a[t.placement],f=s.x,p=s.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=f,t.modifiersData.popperOffsets.y+=p),t.modifiersData[o]=a}},fe={left:"right",right:"left",bottom:"top",top:"bottom"};function pe(e){return e.replace(/left|right|bottom|top/g,(function(e){return fe[e]}))}var ce={start:"end",end:"start"};function le(e){return e.replace(/start|end/g,(function(e){return ce[e]}))}function ue(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&d(n)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}function de(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function me(e,t,n){return t===U?de(function(e,t){var n=c(e),o=O(e),r=n.visualViewport,i=o.clientWidth,a=o.clientHeight,s=0,f=0;if(r){i=r.width,a=r.height;var p=b();(p||!p&&"fixed"===t)&&(s=r.offsetLeft,f=r.offsetTop)}return{width:i,height:a,x:s+P(e),y:f}}(e,n)):l(t)?function(e,t){var n=g(e,!1,"fixed"===t);return n.top=n.top+e.clientTop,n.left=n.left+e.clientLeft,n.bottom=n.top+e.clientHeight,n.right=n.left+e.clientWidth,n.width=e.clientWidth,n.height=e.clientHeight,n.x=n.left,n.y=n.top,n}(t,n):de(function(e){var t,n=O(e),o=w(e),r=null==(t=e.ownerDocument)?void 0:t.body,i=m(n.scrollWidth,n.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),a=m(n.scrollHeight,n.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0),s=-o.scrollLeft+P(e),f=-o.scrollTop;return"rtl"===E(r||n).direction&&(s+=m(n.clientWidth,r?r.clientWidth:0)-i),{width:i,height:a,x:s,y:f}}(O(e)))}function he(e,t,n,o){var r="clippingParents"===t?function(e){var t=M(D(e)),n=["absolute","fixed"].indexOf(E(e).position)>=0&&u(e)?L(e):e;return l(n)?t.filter((function(e){return l(e)&&ue(e,n)&&"body"!==x(e)})):[]}(e):[].concat(t),i=[].concat(r,[n]),a=i[0],s=i.reduce((function(t,n){var r=me(e,n,o);return t.top=m(r.top,t.top),t.right=h(r.right,t.right),t.bottom=h(r.bottom,t.bottom),t.left=m(r.left,t.left),t}),me(e,a,o));return s.width=s.right-s.left,s.height=s.bottom-s.top,s.x=s.left,s.y=s.top,s}function ve(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function ye(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function be(e,t){void 0===t&&(t={});var n=t,o=n.placement,r=void 0===o?e.placement:o,i=n.strategy,a=void 0===i?e.strategy:i,s=n.boundary,f=void 0===s?I:s,p=n.rootBoundary,c=void 0===p?U:p,u=n.elementContext,d=void 0===u?F:u,m=n.altBoundary,h=void 0!==m&&m,v=n.padding,y=void 0===v?0:v,b=ve("number"!==typeof y?y:ye(y,V)),w=d===F?_:F,x=e.rects.popper,P=e.elements[h?w:d],E=he(l(P)?P:P.contextElement||O(e.elements.popper),f,c,a),j=g(e.elements.reference),R=re({reference:j,element:x,strategy:"absolute",placement:r}),k=de(Object.assign({},x,R)),D=d===F?k:j,A={top:E.top-D.top+b.top,bottom:D.bottom-E.bottom+b.bottom,left:E.left-D.left+b.left,right:D.right-E.right+b.right},M=e.modifiersData.offset;if(d===F&&M){var Z=M[r];Object.keys(A).forEach((function(e){var t=[H,B].indexOf(e)>=0?1:-1,n=[W,B].indexOf(e)>=0?"y":"x";A[e]+=Z[n]*t}))}return A}function ge(e,t,n){return m(e,h(t,n))}var we={name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name,r=n.mainAxis,i=void 0===r||r,a=n.altAxis,s=void 0!==a&&a,f=n.boundary,p=n.rootBoundary,c=n.altBoundary,l=n.padding,u=n.tether,d=void 0===u||u,v=n.tetherOffset,y=void 0===v?0:v,b=be(t,{boundary:f,rootBoundary:p,padding:l,altBoundary:c}),g=te(t.placement),w=ne(t.placement),x=!w,O=oe(g),P="x"===O?"y":"x",E=t.modifiersData.popperOffsets,j=t.rects.reference,R=t.rects.popper,D="function"===typeof y?y(Object.assign({},t.rects,{placement:t.placement})):y,A="number"===typeof D?{mainAxis:D,altAxis:D}:Object.assign({mainAxis:0,altAxis:0},D),M=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,Z={x:0,y:0};if(E){if(i){var T,C="y"===O?W:S,V="y"===O?B:H,N="y"===O?"height":"width",I=E[O],U=I+b[C],F=I-b[V],_=d?-R[N]/2:0,z=w===q?j[N]:R[N],X=w===q?-R[N]:-j[N],Y=t.elements.arrow,G=d&&Y?k(Y):{width:0,height:0},J=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},K=J[C],Q=J[V],$=ge(0,j[N],G[N]),ee=x?j[N]/2-_-$-K-A.mainAxis:z-$-K-A.mainAxis,re=x?-j[N]/2+_+$+Q+A.mainAxis:X+$+Q+A.mainAxis,ie=t.elements.arrow&&L(t.elements.arrow),ae=ie?"y"===O?ie.clientTop||0:ie.clientLeft||0:0,se=null!=(T=null==M?void 0:M[O])?T:0,fe=I+re-se,pe=ge(d?h(U,I+ee-se-ae):U,I,d?m(F,fe):F);E[O]=pe,Z[O]=pe-I}if(s){var ce,le="x"===O?W:S,ue="x"===O?B:H,de=E[P],me="y"===P?"height":"width",he=de+b[le],ve=de-b[ue],ye=-1!==[W,S].indexOf(g),we=null!=(ce=null==M?void 0:M[P])?ce:0,xe=ye?he:de-j[me]-R[me]-we+A.altAxis,Oe=ye?de+j[me]+R[me]-we-A.altAxis:ve,Pe=d&&ye?function(e,t,n){var o=ge(e,t,n);return o>n?n:o}(xe,de,Oe):ge(d?xe:he,de,d?Oe:ve);E[P]=Pe,Z[P]=Pe-de}t.modifiersData[o]=Z}},requiresIfExists:["offset"]};var xe={name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,o=e.name,r=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=te(n.placement),f=oe(s),p=[S,H].indexOf(s)>=0?"height":"width";if(i&&a){var c=function(e,t){return ve("number"!==typeof(e="function"===typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:ye(e,V))}(r.padding,n),l=k(i),u="y"===f?W:S,d="y"===f?B:H,m=n.rects.reference[p]+n.rects.reference[f]-a[f]-n.rects.popper[p],h=a[f]-n.rects.reference[f],v=L(i),y=v?"y"===f?v.clientHeight||0:v.clientWidth||0:0,b=m/2-h/2,g=c[u],w=y-l[p]-c[d],x=y/2-l[p]/2+b,O=ge(g,x,w),P=f;n.modifiersData[o]=((t={})[P]=O,t.centerOffset=O-x,t)}},effect:function(e){var t=e.state,n=e.options.element,o=void 0===n?"[data-popper-arrow]":n;null!=o&&("string"!==typeof o||(o=t.elements.popper.querySelector(o)))&&ue(t.elements.popper,o)&&(t.elements.arrow=o)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function Oe(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function Pe(e){return[W,H,B,S].some((function(t){return e[t]>=0}))}var Ee=$({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,n=e.instance,o=e.options,r=o.scroll,i=void 0===r||r,a=o.resize,s=void 0===a||a,f=c(t.elements.popper),p=[].concat(t.scrollParents.reference,t.scrollParents.popper);return i&&p.forEach((function(e){e.addEventListener("scroll",n.update,ee)})),s&&f.addEventListener("resize",n.update,ee),function(){i&&p.forEach((function(e){e.removeEventListener("scroll",n.update,ee)})),s&&f.removeEventListener("resize",n.update,ee)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=re({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,o=n.gpuAcceleration,r=void 0===o||o,i=n.adaptive,a=void 0===i||i,s=n.roundOffsets,f=void 0===s||s,p={placement:te(t.placement),variation:ne(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:r,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,ae(Object.assign({},p,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:f})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,ae(Object.assign({},p,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:f})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},o=t.attributes[e]||{},r=t.elements[e];u(r)&&x(r)&&(Object.assign(r.style,n),Object.keys(o).forEach((function(e){var t=o[e];!1===t?r.removeAttribute(e):r.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var o=t.elements[e],r=t.attributes[e]||{},i=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});u(o)&&x(o)&&(Object.assign(o.style,i),Object.keys(r).forEach((function(e){o.removeAttribute(e)})))}))}},requires:["computeStyles"]},se,{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name;if(!t.modifiersData[o]._skip){for(var r=n.mainAxis,i=void 0===r||r,a=n.altAxis,s=void 0===a||a,f=n.fallbackPlacements,p=n.padding,c=n.boundary,l=n.rootBoundary,u=n.altBoundary,d=n.flipVariations,m=void 0===d||d,h=n.allowedAutoPlacements,v=t.options.placement,y=te(v),b=f||(y===v||!m?[pe(v)]:function(e){if(te(e)===C)return[];var t=pe(e);return[le(e),t,le(t)]}(v)),g=[v].concat(b).reduce((function(e,n){return e.concat(te(n)===C?function(e,t){void 0===t&&(t={});var n=t,o=n.placement,r=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,f=n.allowedAutoPlacements,p=void 0===f?X:f,c=ne(o),l=c?s?z:z.filter((function(e){return ne(e)===c})):V,u=l.filter((function(e){return p.indexOf(e)>=0}));0===u.length&&(u=l);var d=u.reduce((function(t,n){return t[n]=be(e,{placement:n,boundary:r,rootBoundary:i,padding:a})[te(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}(t,{placement:n,boundary:c,rootBoundary:l,padding:p,flipVariations:m,allowedAutoPlacements:h}):n)}),[]),w=t.rects.reference,x=t.rects.popper,O=new Map,P=!0,E=g[0],j=0;j<g.length;j++){var R=g[j],k=te(R),D=ne(R)===q,A=[W,B].indexOf(k)>=0,M=A?"width":"height",Z=be(t,{placement:R,boundary:c,rootBoundary:l,altBoundary:u,padding:p}),T=A?D?H:S:D?B:W;w[M]>x[M]&&(T=pe(T));var L=pe(T),N=[];if(i&&N.push(Z[k]<=0),s&&N.push(Z[T]<=0,Z[L]<=0),N.every((function(e){return e}))){E=R,P=!1;break}O.set(R,N)}if(P)for(var I=function(e){var t=g.find((function(t){var n=O.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return E=t,"break"},U=m?3:1;U>0;U--){if("break"===I(U))break}t.placement!==E&&(t.modifiersData[o]._skip=!0,t.placement=E,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},we,xe,{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,o=t.rects.reference,r=t.rects.popper,i=t.modifiersData.preventOverflow,a=be(t,{elementContext:"reference"}),s=be(t,{altBoundary:!0}),f=Oe(a,o),p=Oe(s,r,i),c=Pe(f),l=Pe(p);t.modifiersData[n]={referenceClippingOffsets:f,popperEscapeOffsets:p,isReferenceHidden:c,hasPopperEscaped:l},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":c,"data-popper-escaped":l})}}]}),je=n(94419),Re=n(96174),ke=n(21217);function De(e){return(0,ke.Z)("MuiPopper",e)}(0,n(75878).Z)("MuiPopper",["root"]);var Ae=n(57271),Me=n(6826),Ze=n(80184),Te=["anchorEl","children","direction","disablePortal","modifiers","open","placement","popperOptions","popperRef","slotProps","slots","TransitionProps","ownerState"],Le=["anchorEl","children","container","direction","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","style","transition","slotProps","slots"];function We(e){return"function"===typeof e?e():e}function Be(e){return void 0!==e.nodeType}var He={},Se=a.forwardRef((function(e,t){var n,p=e.anchorEl,c=e.children,l=e.direction,u=e.disablePortal,d=e.modifiers,m=e.open,h=e.placement,v=e.popperOptions,y=e.popperRef,b=e.slotProps,g=void 0===b?{}:b,w=e.slots,x=void 0===w?{}:w,O=e.TransitionProps,P=(0,r.Z)(e,Te),E=a.useRef(null),j=(0,s.Z)(E,t),R=a.useRef(null),k=(0,s.Z)(R,y),D=a.useRef(k);(0,f.Z)((function(){D.current=k}),[k]),a.useImperativeHandle(y,(function(){return R.current}),[]);var A=function(e,t){if("ltr"===t)return e;switch(e){case"bottom-end":return"bottom-start";case"bottom-start":return"bottom-end";case"top-end":return"top-start";case"top-start":return"top-end";default:return e}}(h,l),M=a.useState(A),Z=(0,i.Z)(M,2),T=Z[0],L=Z[1],W=a.useState(We(p)),B=(0,i.Z)(W,2),H=B[0],S=B[1];a.useEffect((function(){R.current&&R.current.forceUpdate()})),a.useEffect((function(){p&&S(We(p))}),[p]),(0,f.Z)((function(){if(H&&m){var e=[{name:"preventOverflow",options:{altBoundary:u}},{name:"flip",options:{altBoundary:u}},{name:"onUpdate",enabled:!0,phase:"afterWrite",fn:function(e){var t=e.state;L(t.placement)}}];null!=d&&(e=e.concat(d)),v&&null!=v.modifiers&&(e=e.concat(v.modifiers));var t=Ee(H,E.current,(0,o.Z)({placement:A},v,{modifiers:e}));return D.current(t),function(){t.destroy(),D.current(null)}}}),[H,u,d,m,v,A]);var C={placement:T};null!==O&&(C.TransitionProps=O);var V=(0,je.Z)({root:["root"]},(0,Me.T)(De)),q=null!=(n=x.root)?n:"div",N=(0,Ae.Z)({elementType:q,externalSlotProps:g.root,externalForwardedProps:P,additionalProps:{role:"tooltip",ref:j},ownerState:e,className:V.root});return(0,Ze.jsx)(q,(0,o.Z)({},N,{children:"function"===typeof c?c(C):c}))})),Ce=a.forwardRef((function(e,t){var n,s=e.anchorEl,f=e.children,c=e.container,l=e.direction,u=void 0===l?"ltr":l,d=e.disablePortal,m=void 0!==d&&d,h=e.keepMounted,v=void 0!==h&&h,y=e.modifiers,b=e.open,g=e.placement,w=void 0===g?"bottom":g,x=e.popperOptions,O=void 0===x?He:x,P=e.popperRef,E=e.style,j=e.transition,R=void 0!==j&&j,k=e.slotProps,D=void 0===k?{}:k,A=e.slots,M=void 0===A?{}:A,Z=(0,r.Z)(e,Le),T=a.useState(!0),L=(0,i.Z)(T,2),W=L[0],B=L[1];if(!v&&!b&&(!R||W))return null;if(c)n=c;else if(s){var H=We(s);n=H&&Be(H)?(0,p.Z)(H).body:(0,p.Z)(null).body}var S=b||!v||R&&!W?void 0:"none",C=R?{in:b,onEnter:function(){B(!1)},onExited:function(){B(!0)}}:void 0;return(0,Ze.jsx)(Re.Z,{disablePortal:m,container:n,children:(0,Ze.jsx)(Se,(0,o.Z)({anchorEl:s,direction:u,disablePortal:m,modifiers:y,ref:t,open:R?!W:b,placement:w,popperOptions:O,popperRef:P,slotProps:D,slots:M},Z,{style:(0,o.Z)({position:"fixed",top:0,left:0,display:S},E),TransitionProps:C,children:f}))})})),Ve=n(69120),qe=n(66934),Ne=n(31402),Ie=["anchorEl","component","components","componentsProps","container","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","transition","slots","slotProps"],Ue=(0,qe.ZP)(Ce,{name:"MuiPopper",slot:"Root",overridesResolver:function(e,t){return t.root}})({}),Fe=a.forwardRef((function(e,t){var n,i=(0,Ve.Z)(),a=(0,Ne.Z)({props:e,name:"MuiPopper"}),s=a.anchorEl,f=a.component,p=a.components,c=a.componentsProps,l=a.container,u=a.disablePortal,d=a.keepMounted,m=a.modifiers,h=a.open,v=a.placement,y=a.popperOptions,b=a.popperRef,g=a.transition,w=a.slots,x=a.slotProps,O=(0,r.Z)(a,Ie),P=null!=(n=null==w?void 0:w.root)?n:null==p?void 0:p.Root,E=(0,o.Z)({anchorEl:s,container:l,disablePortal:u,keepMounted:d,modifiers:m,open:h,placement:v,popperOptions:y,popperRef:b,transition:g},O);return(0,Ze.jsx)(Ue,(0,o.Z)({as:f,direction:null==i?void 0:i.direction,slots:{root:P},slotProps:null!=x?x:c},E,{ref:t}))}))}}]);
//# sourceMappingURL=4366.00c8df29.chunk.js.map