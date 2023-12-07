"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[4245],{54245:function(t,e,n){n.r(e),n.d(e,{default:function(){return C}});var r=n(1413),a=n(93433),o=n(74165),i=n(15861),u=n(29439),c=n(44695),d=n(53329),l=n(39709),s=n(53767),f=n(20890),m=n(5712),h=n(27391),p=n(68870),b=n(39253),v=n(72791),g=n(61134),x=n(57689),y=n(48367),Z=n(34242),k=n(94604),I=n(93859),j=n(81724),w=n(80184);function C(){var t=(0,x.s0)(),e=(0,v.useState)(!1),n=(0,u.Z)(e,2),C=n[0],M=n[1],S=(0,y.CG)((function(t){return t.CMS.Template.list})),T=(0,v.useState)(0),q=(0,u.Z)(T,2),E=q[0],L=q[1],R=(0,y.TL)();(0,v.useEffect)((function(){S.find((function(t){return t.id===E}))&&t("/cms/template/".concat(E))}),[E,S,t]);var V=j.Ry({name:j.Z_().required(),themeId:j.Rx().required().min(1),body:j.Z_().required()}),G=(0,g.cI)({resolver:(0,c.X)(V),defaultValues:{name:"",body:"",themeId:0}}),P=G.register,W=G.handleSubmit,z=G.setValue,A=G.getValues,_=G.watch,H=G.formState.errors,O=(0,y.CG)((function(t){return t.CMS.Theme.list})),D=(0,y.CG)((function(t){return t.CMS.Theme.status})),B=(0,v.useRef)(null);(0,v.useEffect)((function(){"init"===D&&R((0,Z.RC)())}),[R,D]),(0,v.useEffect)((function(){var t=_((function(t,e){if("themeId"===e.name){var n=t.themeId;if(n){var r=O.find((function(t){return t.id===n}));if(!r)return;z("body",r.body,{shouldValidate:!0})}}}));return function(){return t.unsubscribe()}}),[_,O,z]);var F=O.find((function(t){return t.id===A("themeId")})),U=function(){var t=(0,i.Z)((0,o.Z)().mark((function t(e){var n,r,a,i,u,c,d,l,s;return(0,o.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.name,r=e.body,a=e.themeId,t.prev=1,M(!0),i=r.match(/(?<={block:)(\d|\w){13}(?=})/gm)){t.next=6;break}return t.abrupt("return",R(k.T9.addGlobalMessage({message:"\u30c6\u30fc\u30de\u306bUI\u7de8\u96c6\u6240\u307e\u3060\u5165\u3063\u3066\u306a\u3044\u306e\u3067\u3001\u3054\u78ba\u8a8d\u304f\u3060\u3055\u3044",type:"warning"})));case 6:return u={},i.forEach((function(t){u[t]=""})),t.next=10,b.f.create({name:n,body:u,themeId:a});case 10:c=t.sent,d=c.id,l=c.message,s=c.error,R(k.T9.addGlobalMessage({type:s?"error":"success",message:l})),d&&L(d);case 16:return t.prev=16,M(!1),t.finish(16);case 19:case"end":return t.stop()}}),t,null,[[1,,16,19]])})));return function(e){return t.apply(this,arguments)}}();return(0,w.jsxs)(s.Z,{gap:1,component:"form",noValidate:!0,autoComplete:"off",onSubmit:W(U),children:[(0,w.jsx)(s.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",children:(0,w.jsx)(f.Z,{color:"primary.dark",sx:{fontWeight:600},children:"\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u4f5c\u6210"})}),0===O.length&&(0,w.jsx)(f.Z,{color:"red",children:"\u30c6\u30fc\u30de\u304c\u5fc5\u8981\u3067\u3059"}),(0,w.jsxs)(s.Z,{gap:2,maxWidth:"sm",my:2,children:[(0,w.jsx)(m.Z,{disablePortal:!0,options:[0].concat((0,a.Z)(O.map((function(t){return t.id})))),fullWidth:!0,getOptionLabel:function(t){var e;return 0===t?"":(null===(e=O.find((function(e){return e.id===t})))||void 0===e?void 0:e.name)||""},getOptionDisabled:function(t){return 0===t},value:A("themeId")||0,renderInput:function(t){return(0,w.jsx)(h.Z,(0,r.Z)((0,r.Z)({},t),{},{label:"\u30c6\u30fc\u30de\u9078\u629e",placeholder:"\u9078\u629e\u3057\u3066\u304f\u3060\u3055\u3044",InputLabelProps:{shrink:!0},variant:"outlined",size:"small",error:"themeId"in H}))},onChange:function(t,e){e&&z("themeId",e,{shouldValidate:!0})}}),(0,w.jsx)(h.Z,(0,r.Z)((0,r.Z)({variant:"outlined",size:"small",margin:"dense",autoFocus:!0,required:!0,label:"\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u540d",placeholder:"\u4f8b\uff1a\u4e00\u822c\u7528",InputLabelProps:{shrink:!0}},P("name")),{},{error:"name"in H}))]}),(0,w.jsx)(p.Z,{children:(0,w.jsx)(l.Z,{variant:"outlined",disabled:Object.keys(H).length>0||0===O.length,loading:C,loadingPosition:"start",startIcon:(0,w.jsx)(d.Z,{}),type:"submit",children:"\u4f5c\u6210\u3059\u308b"})}),(0,w.jsx)(p.Z,{ref:B,component:"iframe",srcDoc:(0,I.WS)(A("body").replace(/{block:(\d|\w){13}}/gm,'<p style="width:100%;\n\t\t\t\t\tpadding:10px;\n\t\t\t\t\tbackground : #eee;\n\t\t\t\t\tborder: 2px dotted #ccc;\n\t\t\t\t\ttext-align:center;\n\t\t\t\t\tfont-size: 2rem;">\u7de8\u96c6\u7b87\u6240</p>'),(null===F||void 0===F?void 0:F.head)||"",(null===F||void 0===F?void 0:F.style)||""),width:"100%",height:"700px",sx:{border:"4px solid #3ac",borderRadius:"0.6rem",background:"#fff"}})]})}},93859:function(t,e,n){n.d(e,{WS:function(){return c},c8:function(){return l},qR:function(){return u}});var r=n(74165),a=n(15861),o=n(90737),i=n.n(o);function u(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,e="",n="abcdefghijklmnopqrstuvwxyz0123456789",r=0;r<t;)e+=n.charAt(0===r?Math.floor(26*Math.random()):Math.floor(36*Math.random())),r+=1;return e}var c=function(t,e,n){return i()('\n\t<html lang="ja">\n\t\t<head>\n\t\t\t'.concat(e,"\n\t\t\t<style>\n\t\t\t\t").concat(n||"","\n\t\t\t</style>\n\t\t</head>\n\t\t<body>\n\t\t\t").concat(t,"\n\t\t</body>\n\t</html>\n"),{ocd:!0})},d=function(t){return new Promise((function(e){return setTimeout(e,t)}))},l=function(){var t=(0,a.Z)((0,r.Z)().mark((function t(){var e,n,a,o;return(0,r.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((n=document.createElement("div")).innerHTML=(null===(e=document.getElementById("edit-area"))||void 0===e?void 0:e.innerHTML)||"",a=n.querySelectorAll("[data-editable]")){t.next=5;break}return t.abrupt("return");case 5:return o={},t.next=8,d(0);case 8:return a.forEach((function(t){var e=t,n=t.dataset.editable;e.querySelectorAll('[data-block="left-actions"],[data-block="bottom-actions"]').forEach((function(t){t.remove()})),o[n]=e.outerHTML.replaceAll(/ contenteditable="true"/g,"")})),t.abrupt("return",o);case 10:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()}}]);
//# sourceMappingURL=4245.0b923e13.chunk.js.map