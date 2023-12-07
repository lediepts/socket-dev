"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[3296],{12457:function(e,n,t){t.d(n,{Z:function(){return v}});var r=t(74165),i=t(15861),o=t(1413),a=t(39709),s=t(53767),l=t(39157),u=t(68870),c=t(5574),d=t(97123),f=t(65661),m=t(55931),p=t(72791),h=t(80184),x=p.forwardRef((function(e,n){return(0,h.jsx)(m.Z,(0,o.Z)({direction:"down",ref:n},e))}));function v(e){var n=e.open,t=e.loading,o=e.title,m=void 0===o?"":o,v=e.maxWidth,Z=void 0===v?"sm":v,g=e.primaryButton,b=void 0===g||g,w=e.closeButtonText,y=void 0===w?"\u9589\u3058\u308b":w,j=e.primaryButtonText,k=void 0===j?"\u5b9f\u65bd\u3059\u308b":j,C=e.children,T=e.primaryButtonColor,S=void 0===T?"primary":T,B=e.component,E=void 0===B?"div":B,M=e.disabled,W=void 0!==M&&M,R=e.backdropClick,I=e.useEnterKey,L=void 0===I||I,N=e.handleClose,P=e.handleSubmit;return(0,p.useEffect)((function(){var e=function(e){"Enter"===e.key&&L&&P&&!W&&P()};return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}}),[W,P,L]),(0,h.jsx)(h.Fragment,{children:(0,h.jsx)(c.Z,{open:n,TransitionComponent:x,fullWidth:!0,maxWidth:Z,onClose:function(e,n){(R||"backdropClick"!==n)&&N()},sx:{"& .MuiPaper-root":{opacity:.98,margin:1,width:{sm:"100%",md:"95%"}}},children:(0,h.jsxs)(s.Z,{component:E,spacing:1,children:[(0,h.jsx)(f.Z,{sx:{fontWeight:"bold",py:1},children:m}),(0,h.jsx)(l.Z,{children:(0,h.jsx)(u.Z,{sx:{py:1,maxHeight:"75vh"},children:C})}),(0,h.jsx)(d.Z,{children:(0,h.jsxs)(s.Z,{width:"100%",direction:"row",justifyContent:"space-around",alignItems:"center",mb:1,children:[(0,h.jsx)(a.Z,{loading:t,variant:"outlined",color:"inherit",size:"small",sx:{width:100},onClick:function(){return N()},children:y}),b&&(0,h.jsx)(a.Z,{loading:t,variant:"contained",color:S,disabled:W,size:"small",type:"form"===E?"submit":"button",sx:{width:100},onClick:function(){var e=(0,i.Z)((0,r.Z)().mark((function e(n){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.preventDefault(),n.stopPropagation(),e.t0=P,!e.t0){e.next=6;break}return e.next=6,P();case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),children:k})]})})]})})})}},83296:function(e,n,t){t.r(n),t.d(n,{default:function(){return g}});var r=t(1413),i=t(74165),o=t(15861),a=t(29439),s=t(44695),l=t(53767),u=t(27391),c=t(40341),d=t(12457),f=t(72791),m=t(61134),p=t(57689),h=t(48367),x=t(94604),v=t(81724),Z=t(80184);function g(){var e=(0,p.s0)(),n=(0,p.UO)().id,t=(0,h.CG)((function(e){return e.Mailing.list})).find((function(e){return e.id===Number(n)})),g=(0,f.useState)(!1),b=(0,a.Z)(g,2),w=b[0],y=b[1],j=(0,f.useState)(!0),k=(0,a.Z)(j,2),C=k[0],T=k[1],S=(0,h.TL)(),B=v.Ry({email:v.Z_().required().email()}),E=(0,m.cI)({resolver:(0,s.X)(B),defaultValues:{email:""}}),M=E.register,W=E.handleSubmit,R=E.formState.errors;if((0,f.useEffect)((function(){return function(){T(!1)}}),[]),!t||!n)return null;var I=function(){var t=(0,o.Z)((0,i.Z)().mark((function t(r){var o,a,s,l;return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=r.email,t.prev=1,y(!0),t.next=5,c.g.addMember({email:o,id:n});case 5:a=t.sent,s=a.error,l=a.message,S(x.T9.addGlobalMessage({type:s?"error":"success",message:l})),s||e("/mailing/"+n);case 10:return t.prev=10,y(!1),t.finish(10);case 13:case"end":return t.stop()}}),t,null,[[1,,10,13]])})));return function(e){return t.apply(this,arguments)}}();return(0,Z.jsx)(d.Z,{open:C,loading:w,handleClose:function(){e("/mailing/"+n)},title:"\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9\u8ffd\u52a0",disabled:Object.keys(R).length>0,primaryButtonText:"\u767b\u9332",primaryButtonColor:"success",component:"form",maxWidth:"sm",handleSubmit:W(I),children:(0,Z.jsx)(l.Z,{gap:1,children:(0,Z.jsx)(u.Z,(0,r.Z)((0,r.Z)({variant:"standard",autoFocus:!0,required:!0,margin:"dense",fullWidth:!0,size:"small",label:"\u30e1\u30fc\u30eb\u30a2\u30c9\u30ec\u30b9",placeholder:"ex:xxx@caa.go.jp",InputLabelProps:{shrink:!0}},M("email")),{},{error:"email"in R}))})})}},65661:function(e,n,t){var r=t(87462),i=t(63366),o=t(72791),a=t(28182),s=t(94419),l=t(20890),u=t(66934),c=t(31402),d=t(17673),f=t(85090),m=t(80184),p=["className","id"],h=(0,u.ZP)(l.Z,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,n){return n.root}})({padding:"16px 24px",flex:"0 0 auto"}),x=o.forwardRef((function(e,n){var t=(0,c.Z)({props:e,name:"MuiDialogTitle"}),l=t.className,u=t.id,x=(0,i.Z)(t,p),v=t,Z=function(e){var n=e.classes;return(0,s.Z)({root:["root"]},d.a,n)}(v),g=o.useContext(f.Z).titleId,b=void 0===g?u:g;return(0,m.jsx)(h,(0,r.Z)({component:"h2",className:(0,a.Z)(Z.root,l),ownerState:v,ref:n,variant:"h6",id:null!=u?u:b},x))}));n.Z=x}}]);
//# sourceMappingURL=3296.aca9b03a.chunk.js.map