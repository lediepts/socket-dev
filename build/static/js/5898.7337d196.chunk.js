(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[5898],{94454:function(e,t,n){"use strict";n.d(t,{Z:function(){return S}});var r=n(4942),o=n(63366),a=n(87462),i=n(72791),c=n(28182),l=n(94419),s=n(12065),u=n(97278),d=n(76189),p=n(80184),f=(0,d.Z)((0,p.jsx)("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),m=(0,d.Z)((0,p.jsx)("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),v=(0,d.Z)((0,p.jsx)("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox"),h=n(14036),b=n(31402),y=n(66934),Z=n(75878),g=n(21217);function x(e){return(0,g.Z)("MuiCheckbox",e)}var w=(0,Z.Z)("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary"]),k=["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size","className"],C=(0,y.ZP)(u.Z,{shouldForwardProp:function(e){return(0,y.FO)(e)||"classes"===e},name:"MuiCheckbox",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[t.root,n.indeterminate&&t.indeterminate,"default"!==n.color&&t["color".concat((0,h.Z)(n.color))]]}})((function(e){var t,n=e.theme,o=e.ownerState;return(0,a.Z)({color:(n.vars||n).palette.text.secondary},!o.disableRipple&&{"&:hover":{backgroundColor:n.vars?"rgba(".concat("default"===o.color?n.vars.palette.action.activeChannel:n.vars.palette.primary.mainChannel," / ").concat(n.vars.palette.action.hoverOpacity,")"):(0,s.Fq)("default"===o.color?n.palette.action.active:n.palette[o.color].main,n.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},"default"!==o.color&&(t={},(0,r.Z)(t,"&.".concat(w.checked,", &.").concat(w.indeterminate),{color:(n.vars||n).palette[o.color].main}),(0,r.Z)(t,"&.".concat(w.disabled),{color:(n.vars||n).palette.action.disabled}),t))})),P=(0,p.jsx)(m,{}),R=(0,p.jsx)(f,{}),j=(0,p.jsx)(v,{}),S=i.forwardRef((function(e,t){var n,r,s=(0,b.Z)({props:e,name:"MuiCheckbox"}),u=s.checkedIcon,d=void 0===u?P:u,f=s.color,m=void 0===f?"primary":f,v=s.icon,y=void 0===v?R:v,Z=s.indeterminate,g=void 0!==Z&&Z,w=s.indeterminateIcon,S=void 0===w?j:w,E=s.inputProps,O=s.size,L=void 0===O?"medium":O,A=s.className,F=(0,o.Z)(s,k),M=g?S:y,B=g?S:d,z=(0,a.Z)({},s,{color:m,indeterminate:g,size:L}),T=function(e){var t=e.classes,n=e.indeterminate,r=e.color,o={root:["root",n&&"indeterminate","color".concat((0,h.Z)(r))]},i=(0,l.Z)(o,x,t);return(0,a.Z)({},t,i)}(z);return(0,p.jsx)(C,(0,a.Z)({type:"checkbox",inputProps:(0,a.Z)({"data-indeterminate":g},E),icon:i.cloneElement(M,{fontSize:null!=(n=M.props.fontSize)?n:L}),checkedIcon:i.cloneElement(B,{fontSize:null!=(r=B.props.fontSize)?r:L}),ownerState:z,ref:t,className:(0,c.Z)(T.root,A)},F,{classes:T}))}))},65661:function(e,t,n){"use strict";var r=n(87462),o=n(63366),a=n(72791),i=n(28182),c=n(94419),l=n(20890),s=n(66934),u=n(31402),d=n(17673),p=n(85090),f=n(80184),m=["className","id"],v=(0,s.ZP)(l.Z,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,t){return t.root}})({padding:"16px 24px",flex:"0 0 auto"}),h=a.forwardRef((function(e,t){var n=(0,u.Z)({props:e,name:"MuiDialogTitle"}),l=n.className,s=n.id,h=(0,o.Z)(n,m),b=n,y=function(e){var t=e.classes;return(0,c.Z)({root:["root"]},d.a,t)}(b),Z=a.useContext(p.Z).titleId,g=void 0===Z?s:Z;return(0,f.jsx)(v,(0,r.Z)({component:"h2",className:(0,i.Z)(y.root,l),ownerState:b,ref:t,variant:"h6",id:null!=s?s:g},h))}));t.Z=h},93840:function(e,t,n){"use strict";var r=n(72791).createContext(void 0);t.Z=r},76147:function(e,t,n){"use strict";function r(e){var t=e.props,n=e.states,r=e.muiFormControl;return n.reduce((function(e,n){return e[n]=t[n],r&&"undefined"===typeof t[n]&&(e[n]=r[n]),e}),{})}n.d(t,{Z:function(){return r}})},52930:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(72791),o=n(93840);function a(){return r.useContext(o.Z)}},85523:function(e,t,n){"use strict";n.d(t,{Z:function(){return k}});var r=n(4942),o=n(63366),a=n(87462),i=n(72791),c=n(28182),l=n(94419),s=n(52930),u=n(20890),d=n(14036),p=n(66934),f=n(31402),m=n(75878),v=n(21217);function h(e){return(0,v.Z)("MuiFormControlLabel",e)}var b=(0,m.Z)("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),y=n(76147),Z=n(80184),g=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],x=(0,p.ZP)("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:function(e,t){var n=e.ownerState;return[(0,r.Z)({},"& .".concat(b.label),t.label),t.root,t["labelPlacement".concat((0,d.Z)(n.labelPlacement))]]}})((function(e){var t=e.theme,n=e.ownerState;return(0,a.Z)((0,r.Z)({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16},"&.".concat(b.disabled),{cursor:"default"}),"start"===n.labelPlacement&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},"top"===n.labelPlacement&&{flexDirection:"column-reverse",marginLeft:16},"bottom"===n.labelPlacement&&{flexDirection:"column",marginLeft:16},(0,r.Z)({},"& .".concat(b.label),(0,r.Z)({},"&.".concat(b.disabled),{color:(t.vars||t).palette.text.disabled})))})),w=(0,p.ZP)("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:function(e,t){return t.asterisk}})((function(e){var t=e.theme;return(0,r.Z)({},"&.".concat(b.error),{color:(t.vars||t).palette.error.main})})),k=i.forwardRef((function(e,t){var n,r,p=(0,f.Z)({props:e,name:"MuiFormControlLabel"}),m=p.className,v=p.componentsProps,b=void 0===v?{}:v,k=p.control,C=p.disabled,P=p.disableTypography,R=p.label,j=p.labelPlacement,S=void 0===j?"end":j,E=p.required,O=p.slotProps,L=void 0===O?{}:O,A=(0,o.Z)(p,g),F=(0,s.Z)(),M=null!=(n=null!=C?C:k.props.disabled)?n:null==F?void 0:F.disabled,B=null!=E?E:k.props.required,z={disabled:M,required:B};["checked","name","onChange","value","inputRef"].forEach((function(e){"undefined"===typeof k.props[e]&&"undefined"!==typeof p[e]&&(z[e]=p[e])}));var T=(0,y.Z)({props:p,muiFormControl:F,states:["error"]}),I=(0,a.Z)({},p,{disabled:M,labelPlacement:S,required:B,error:T.error}),N=function(e){var t=e.classes,n=e.disabled,r=e.labelPlacement,o=e.error,a=e.required,i={root:["root",n&&"disabled","labelPlacement".concat((0,d.Z)(r)),o&&"error",a&&"required"],label:["label",n&&"disabled"],asterisk:["asterisk",o&&"error"]};return(0,l.Z)(i,h,t)}(I),q=null!=(r=L.typography)?r:b.typography,H=R;return null==H||H.type===u.Z||P||(H=(0,Z.jsx)(u.Z,(0,a.Z)({component:"span"},q,{className:(0,c.Z)(N.label,null==q?void 0:q.className),children:H}))),(0,Z.jsxs)(x,(0,a.Z)({className:(0,c.Z)(N.root,m),ownerState:I,ref:t},A,{children:[i.cloneElement(k,z),H,B&&(0,Z.jsxs)(w,{ownerState:I,"aria-hidden":!0,className:N.asterisk,children:["\u2009","*"]})]}))}))},97278:function(e,t,n){"use strict";n.d(t,{Z:function(){return x}});var r=n(29439),o=n(63366),a=n(87462),i=n(72791),c=n(28182),l=n(94419),s=n(14036),u=n(66934),d=n(98278),p=n(52930),f=n(95080),m=n(75878),v=n(21217);function h(e){return(0,v.Z)("PrivateSwitchBase",e)}(0,m.Z)("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);var b=n(80184),y=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],Z=(0,u.ZP)(f.Z)((function(e){var t=e.ownerState;return(0,a.Z)({padding:9,borderRadius:"50%"},"start"===t.edge&&{marginLeft:"small"===t.size?-3:-12},"end"===t.edge&&{marginRight:"small"===t.size?-3:-12})})),g=(0,u.ZP)("input")({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),x=i.forwardRef((function(e,t){var n=e.autoFocus,i=e.checked,u=e.checkedIcon,f=e.className,m=e.defaultChecked,v=e.disabled,x=e.disableFocusRipple,w=void 0!==x&&x,k=e.edge,C=void 0!==k&&k,P=e.icon,R=e.id,j=e.inputProps,S=e.inputRef,E=e.name,O=e.onBlur,L=e.onChange,A=e.onFocus,F=e.readOnly,M=e.required,B=void 0!==M&&M,z=e.tabIndex,T=e.type,I=e.value,N=(0,o.Z)(e,y),q=(0,d.Z)({controlled:i,default:Boolean(m),name:"SwitchBase",state:"checked"}),H=(0,r.Z)(q,2),D=H[0],U=H[1],_=(0,p.Z)(),V=v;_&&"undefined"===typeof V&&(V=_.disabled);var K="checkbox"===T||"radio"===T,W=(0,a.Z)({},e,{checked:D,disabled:V,disableFocusRipple:w,edge:C}),X=function(e){var t=e.classes,n=e.checked,r=e.disabled,o=e.edge,a={root:["root",n&&"checked",r&&"disabled",o&&"edge".concat((0,s.Z)(o))],input:["input"]};return(0,l.Z)(a,h,t)}(W);return(0,b.jsxs)(Z,(0,a.Z)({component:"span",className:(0,c.Z)(X.root,f),centerRipple:!0,focusRipple:!w,disabled:V,tabIndex:null,role:void 0,onFocus:function(e){A&&A(e),_&&_.onFocus&&_.onFocus(e)},onBlur:function(e){O&&O(e),_&&_.onBlur&&_.onBlur(e)},ownerState:W,ref:t},N,{children:[(0,b.jsx)(g,(0,a.Z)({autoFocus:n,checked:i,defaultChecked:m,className:X.input,disabled:V,id:K?R:void 0,name:E,onChange:function(e){if(!e.nativeEvent.defaultPrevented){var t=e.target.checked;U(t),L&&L(e,t)}},readOnly:F,ref:S,required:B,ownerState:W,tabIndex:z,type:T},"checkbox"===T&&void 0===I?{}:{value:I},j)),D?u:P]}))}))},64802:function(e,t,n){var r,o,a;o=[],void 0===(a="function"===typeof(r=function(){"use strict";function t(e,t){return"undefined"==typeof t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}function r(e,t,n){var r=new XMLHttpRequest;r.open("GET",e),r.responseType="blob",r.onload=function(){l(r.response,t,n)},r.onerror=function(){console.error("could not download file")},r.send()}function o(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function a(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(r){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var i="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n.g&&n.g.global===n.g?n.g:void 0,c=i.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),l=i.saveAs||("object"!=typeof window||window!==i?function(){}:"download"in HTMLAnchorElement.prototype&&!c?function(e,t,n){var c=i.URL||i.webkitURL,l=document.createElement("a");t=t||e.name||"download",l.download=t,l.rel="noopener","string"==typeof e?(l.href=e,l.origin===location.origin?a(l):o(l.href)?r(e,t,n):a(l,l.target="_blank")):(l.href=c.createObjectURL(e),setTimeout((function(){c.revokeObjectURL(l.href)}),4e4),setTimeout((function(){a(l)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,n,i){if(n=n||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(t(e,i),n);else if(o(e))r(e,n,i);else{var c=document.createElement("a");c.href=e,c.target="_blank",setTimeout((function(){a(c)}))}}:function(e,t,n,o){if((o=o||open("","_blank"))&&(o.document.title=o.document.body.innerText="downloading..."),"string"==typeof e)return r(e,t,n);var a="application/octet-stream"===e.type,l=/constructor/i.test(i.HTMLElement)||i.safari,s=/CriOS\/[\d]+/.test(navigator.userAgent);if((s||a&&l||c)&&"undefined"!=typeof FileReader){var u=new FileReader;u.onloadend=function(){var e=u.result;e=s?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),o?o.location.href=e:location=e,o=null},u.readAsDataURL(e)}else{var d=i.URL||i.webkitURL,p=d.createObjectURL(e);o?o.location=p:location.href=p,o=null,setTimeout((function(){d.revokeObjectURL(p)}),4e4)}});i.saveAs=l.saveAs=l,e.exports=l})?r.apply(t,o):r)||(e.exports=a)},31490:function(e,t,n){"use strict";n.d(t,{Z:function(){return w}});var r=n(74165),o=n(15671),a=n(43144),i=n(97326),c=n(60136),l=n(27277),s=n(64802),u=n(72791),d=n(93433),p=function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(t){a(t)}}function c(e){try{l(r.throw(e))}catch(t){a(t)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}l((r=r.apply(e,t||[])).next())}))},f="function"===typeof requestAnimationFrame?requestAnimationFrame:process.nextTick,m=function(e){return function(t){return"".concat(e).concat(t).concat(e)}},v=function(e,t){return function(n){t&&n.push(""),e(n.join("\r\n"))}},h=function(e){return e.reduce((function(e,t){return Array.isArray(t)?e:(n=Object.keys(t),r=e,n.reduce((function(e,t){return e.map[t]=t,e.order.push(t),e}),r));var n,r}),{order:[],map:{}})},b=function(e){return e.reduce((function(e,t){var n,r,o;return"string"===typeof t?(r=t,o=t):(r=t.id,o=null!==(n=t.displayName)&&void 0!==n?n:t.id),e.map[r]=o,e.order.push(r),e}),{order:[],map:{}})};var y=function(e,t,n,r,o,a,i){var c=function(e,t){return(0,d.Z)(Array(Math.ceil(e.length/t))).reduce((function(n,r,o){var a=o*t;return n.concat([e.slice(a,a+t)])}),[])}(r,i),l=0;return function r(){if(l>=c.length)e(n);else{var i=c[l],s=Array.isArray(i[0])&&!o.some((function(e){return"undefined"!==typeof i[0][e]}));l+=1,i.map((function(e){return s?e:o.map((function(t){var n;return null!==(n=e[t])&&void 0!==n?n:""}))})).forEach((function(e){n.push(e.map(t).join(a))})),f(r)}}};function Z(e){var t=e.columns,n=e.datas,o=e.separator,a=void 0===o?",":o,i=e.noHeader,c=void 0!==i&&i,l=e.wrapColumnChar,s=void 0===l?"":l,u=e.newLineAtEnd,d=void 0!==u&&u,Z=e.chunkSize,g=void 0===Z?1e3:Z;return p(this,void 0,void 0,(0,r.Z)().mark((function e(){var o=this;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise((function(e,i){return p(o,void 0,void 0,(0,r.Z)().mark((function o(){var l,u,p,Z,x,w,k,C;return(0,r.Z)().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(l=v(e,d),u=m(s),r.prev=2,"function"!==typeof n){r.next=9;break}return r.next=6,n();case 6:r.t0=r.sent,r.next=12;break;case 9:return r.next=11,n;case 11:r.t0=r.sent;case 12:if(n=r.t0,Array.isArray(n)){r.next=15;break}return r.abrupt("return",e());case 15:p=t?b(t):h(n),Z=p.map,x=p.order,w=[],c||(k=x.map((function(e){return Z[e]}))).length>0&&w.push(k.map(u).join(a)),C=y(l,u,w,n,x,a,g),f(C),r.next=25;break;case 22:return r.prev=22,r.t1=r.catch(2),r.abrupt("return",i(r.t1));case 25:case"end":return r.stop()}}),o,null,[[2,22]])})))})));case 1:case"end":return e.stop()}}),e)})))}var g=function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{l(r.next(e))}catch(t){a(t)}}function c(e){try{l(r.throw(e))}catch(t){a(t)}}function l(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}l((r=r.apply(e,t||[])).next())}))},x=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n},w=function(e){(0,c.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;return(0,o.Z)(this,n),(e=t.apply(this,arguments)).handleClick=function(){return g((0,i.Z)(e),void 0,void 0,(0,r.Z)().mark((function e(){var t,n,o,a,i,c,l,u,d,p,f,m,v,h,b,y;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=this.props,n=t.suffix,o=t.prefix,a=t.bom,i=t.extension,c=t.disabled,l=t.meta,u=t.separator,d=t.handleError,p=t.handleEmpty,!c){e.next=3;break}return e.abrupt("return");case 3:return f=this.props.filename,e.prev=4,e.next=7,Z(this.props);case 7:m=e.sent,e.next=13;break;case 10:return e.prev=10,e.t0=e.catch(4),e.abrupt("return",null===d||void 0===d?void 0:d(e.t0));case 13:if(m){e.next=19;break}if(!p){e.next=18;break}return e.abrupt("return",p());case 18:m="";case 19:v=!1!==a?"\ufeff":"",h=l?"sep=".concat(u,"\r\n"):"",b=i||".csv",-1===f.indexOf(b)&&(f+=b),n&&(f="string"===typeof n||"number"===typeof n?f.replace(b,"_".concat(n).concat(b)):f.replace(b,"_".concat((new Date).getTime()).concat(b))),o&&(f="string"===typeof o||"number"===typeof o?"".concat(o,"_").concat(f):"".concat((new Date).getTime(),"_").concat(f)),y=new Blob(["".concat(v).concat(h).concat(m)],{type:"text/csv;charset=utf-8"}),s.saveAs(y,f);case 27:case"end":return e.stop()}}),e,this,[[4,10]])})))},e}return(0,a.Z)(n,[{key:"render",value:function(){var e=this.props,t=e.children,n=e.text,r=e.disabled,o=(e.bom,e.filename,e.extension,e.prefix,e.suffix,e.meta,e.handleError,e.handleEmpty,e.columns,e.datas,e.separator,e.noHeader,e.wrapColumnChar,e.newLineAtEnd,e.chunkSize,x(e,["children","text","disabled","bom","filename","extension","prefix","suffix","meta","handleError","handleEmpty","columns","datas","separator","noHeader","wrapColumnChar","newLineAtEnd","chunkSize"]));return"undefined"===typeof t?u.createElement("button",Object.assign({type:"button"},o,{onClick:this.handleClick,disabled:r}),n||"Download"):u.createElement("div",Object.assign({role:"button",tabIndex:0},o,{onClick:this.handleClick,onKeyPress:this.handleClick}),t)}}]),n}(u.Component)}}]);
//# sourceMappingURL=5898.7337d196.chunk.js.map