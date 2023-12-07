"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[8445],{12457:function(n,e,t){t.d(e,{Z:function(){return x}});var r=t(74165),i=t(15861),o=t(1413),a=t(39709),s=t(53767),c=t(39157),u=t(68870),d=t(5574),l=t(97123),f=t(65661),p=t(55931),m=t(72791),h=t(80184),v=m.forwardRef((function(n,e){return(0,h.jsx)(p.Z,(0,o.Z)({direction:"down",ref:e},n))}));function x(n){var e=n.open,t=n.loading,o=n.title,p=void 0===o?"":o,x=n.maxWidth,Z=void 0===x?"sm":x,w=n.primaryButton,b=void 0===w||w,g=n.closeButtonText,k=void 0===g?"\u9589\u3058\u308b":g,y=n.primaryButtonText,j=void 0===y?"\u5b9f\u65bd\u3059\u308b":y,C=n.children,T=n.primaryButtonColor,B=void 0===T?"primary":T,E=n.component,S=void 0===E?"div":E,M=n.disabled,N=void 0!==M&&M,R=n.backdropClick,W=n.useEnterKey,D=void 0===W||W,L=n.handleClose,P=n.handleSubmit;return(0,m.useEffect)((function(){var n=function(n){"Enter"===n.key&&D&&P&&!N&&P()};return window.addEventListener("keydown",n),function(){window.removeEventListener("keydown",n)}}),[N,P,D]),(0,h.jsx)(h.Fragment,{children:(0,h.jsx)(d.Z,{open:e,TransitionComponent:v,fullWidth:!0,maxWidth:Z,onClose:function(n,e){(R||"backdropClick"!==e)&&L()},sx:{"& .MuiPaper-root":{opacity:.98,margin:1,width:{sm:"100%",md:"95%"}}},children:(0,h.jsxs)(s.Z,{component:S,spacing:1,children:[(0,h.jsx)(f.Z,{sx:{fontWeight:"bold",py:1},children:p}),(0,h.jsx)(c.Z,{children:(0,h.jsx)(u.Z,{sx:{py:1,maxHeight:"75vh"},children:C})}),(0,h.jsx)(l.Z,{children:(0,h.jsxs)(s.Z,{width:"100%",direction:"row",justifyContent:"space-around",alignItems:"center",mb:1,children:[(0,h.jsx)(a.Z,{loading:t,variant:"outlined",color:"inherit",size:"small",sx:{width:100},onClick:function(){return L()},children:k}),b&&(0,h.jsx)(a.Z,{loading:t,variant:"contained",color:B,disabled:N,size:"small",type:"form"===S?"submit":"button",sx:{width:100},onClick:function(){var n=(0,i.Z)((0,r.Z)().mark((function n(e){return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e.preventDefault(),e.stopPropagation(),n.t0=P,!n.t0){n.next=6;break}return n.next=6,P();case 6:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),children:j})]})})]})})})}},58445:function(n,e,t){t.r(e),t.d(e,{default:function(){return h}});var r=t(74165),i=t(15861),o=t(29439),a=t(53767),s=t(20890),c=t(39253),u=t(12457),d=t(72791),l=t(57689),f=t(48367),p=t(94604),m=t(80184);function h(){var n=(0,l.s0)(),e=(0,f.TL)(),t=(0,l.UO)().id,h=(0,f.CG)((function(n){return n.CMS.Template.list})).find((function(n){return n.id===Number(t)})),v=(0,d.useState)(!1),x=(0,o.Z)(v,2),Z=x[0],w=x[1],b=(0,d.useState)(!0),g=(0,o.Z)(b,2),k=g[0],y=g[1];return(0,d.useEffect)((function(){return k&&h&&h.active||n(-1),function(){y(!1)}}),[n,k,h]),(0,m.jsx)(u.Z,{open:k,loading:Z,handleClose:function(){return y(!1)},title:"\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8\u524a\u9664\u78ba\u8a8d",primaryButtonColor:"error",primaryButtonText:"\u524a\u9664\u3059\u308b",handleSubmit:(0,i.Z)((0,r.Z)().mark((function n(){var i,o,a;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(n.prev=0,t){n.next=3;break}return n.abrupt("return");case 3:return w(!0),n.next=6,c.f.delete(t);case 6:i=n.sent,o=i.message,a=i.error,e(p.T9.addGlobalMessage({type:a?"error":"success",message:o})),y(!1);case 11:return n.prev=11,w(!1),n.finish(11);case 14:case"end":return n.stop()}}),n,null,[[0,,11,14]])}))),children:(0,m.jsx)(a.Z,{children:!!h&&(0,m.jsx)(s.Z,{children:"".concat(h.name,"\u3092\u524a\u9664\u3057\u3066\u3082\u3088\u308d\u3057\u3044\u3067\u3059\u304b")})})})}},65661:function(n,e,t){var r=t(87462),i=t(63366),o=t(72791),a=t(28182),s=t(94419),c=t(20890),u=t(66934),d=t(31402),l=t(17673),f=t(85090),p=t(80184),m=["className","id"],h=(0,u.ZP)(c.Z,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(n,e){return e.root}})({padding:"16px 24px",flex:"0 0 auto"}),v=o.forwardRef((function(n,e){var t=(0,d.Z)({props:n,name:"MuiDialogTitle"}),c=t.className,u=t.id,v=(0,i.Z)(t,m),x=t,Z=function(n){var e=n.classes;return(0,s.Z)({root:["root"]},l.a,e)}(x),w=o.useContext(f.Z).titleId,b=void 0===w?u:w;return(0,p.jsx)(h,(0,r.Z)({component:"h2",className:(0,a.Z)(Z.root,c),ownerState:x,ref:e,variant:"h6",id:null!=u?u:b},v))}));e.Z=v}}]);
//# sourceMappingURL=8445.21c73116.chunk.js.map