"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[9184],{12457:function(e,n,t){t.d(n,{Z:function(){return x}});var r=t(74165),i=t(15861),o=t(1413),a=t(39709),s=t(53767),u=t(39157),l=t(68870),d=t(5574),c=t(97123),f=t(65661),h=t(55931),p=t(72791),m=t(80184),v=p.forwardRef((function(e,n){return(0,m.jsx)(h.Z,(0,o.Z)({direction:"down",ref:n},e))}));function x(e){var n=e.open,t=e.loading,o=e.title,h=void 0===o?"":o,x=e.maxWidth,Z=void 0===x?"sm":x,w=e.primaryButton,g=void 0===w||w,b=e.closeButtonText,y=void 0===b?"\u9589\u3058\u308b":b,k=e.primaryButtonText,j=void 0===k?"\u5b9f\u65bd\u3059\u308b":k,C=e.children,T=e.primaryButtonColor,S=void 0===T?"primary":T,W=e.component,B=void 0===W?"div":W,E=e.disabled,R=void 0!==E&&E,I=e.backdropClick,L=e.useEnterKey,M=void 0===L||L,N=e.handleClose,P=e.handleSubmit;return(0,p.useEffect)((function(){var e=function(e){"Enter"===e.key&&M&&P&&!R&&P()};return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}}),[R,P,M]),(0,m.jsx)(m.Fragment,{children:(0,m.jsx)(d.Z,{open:n,TransitionComponent:v,fullWidth:!0,maxWidth:Z,onClose:function(e,n){(I||"backdropClick"!==n)&&N()},sx:{"& .MuiPaper-root":{opacity:.98,margin:1,width:{sm:"100%",md:"95%"}}},children:(0,m.jsxs)(s.Z,{component:B,spacing:1,children:[(0,m.jsx)(f.Z,{sx:{fontWeight:"bold",py:1},children:h}),(0,m.jsx)(u.Z,{children:(0,m.jsx)(l.Z,{sx:{py:1,maxHeight:"75vh"},children:C})}),(0,m.jsx)(c.Z,{children:(0,m.jsxs)(s.Z,{width:"100%",direction:"row",justifyContent:"space-around",alignItems:"center",mb:1,children:[(0,m.jsx)(a.Z,{loading:t,variant:"outlined",color:"inherit",size:"small",sx:{width:100},onClick:function(){return N()},children:y}),g&&(0,m.jsx)(a.Z,{loading:t,variant:"contained",color:S,disabled:R,size:"small",type:"form"===B?"submit":"button",sx:{width:100},onClick:function(){var e=(0,i.Z)((0,r.Z)().mark((function e(n){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.preventDefault(),n.stopPropagation(),e.t0=P,!e.t0){e.next=6;break}return e.next=6,P();case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),children:j})]})})]})})})}},9184:function(e,n,t){t.r(n),t.d(n,{default:function(){return w}});var r=t(1413),i=t(74165),o=t(15861),a=t(29439),s=t(44695),u=t(53767),l=t(27391),d=t(74310),c=t(12457),f=t(72791),h=t(61134),p=t(57689),m=t(48367),v=t(94604),x=t(81724),Z=t(80184);function w(){var e=(0,p.s0)(),n=(0,p.UO)().id,t=(0,m.TL)(),w=(0,m.CG)((function(e){return e.Workflow.list})).find((function(e){return e.id===Number(n)})),g=(0,f.useState)(!1),b=(0,a.Z)(g,2),y=b[0],k=b[1],j=(0,f.useState)(!0),C=(0,a.Z)(j,2),T=C[0],S=C[1],W=x.Ry({other:x.Z_().required()}),B=(0,h.cI)({resolver:(0,s.X)(W),defaultValues:{other:""}}),E=B.register,R=B.handleSubmit,I=B.formState.errors;if((0,f.useEffect)((function(){return T&&w||e(-1),function(){S(!1)}}),[e,T,w]),!w)return null;var L=function(){var e=(0,o.Z)((0,i.Z)().mark((function e(n){var r,o,a,s;return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.other,e.prev=1,k(!0),e.next=5,d.g.reject({id:w.id,other:r});case 5:o=e.sent,a=o.error,s=o.message,t(v.T9.addGlobalMessage({type:a?"error":"success",message:s})),S(!1);case 10:return e.prev=10,k(!1),e.finish(10);case 13:case"end":return e.stop()}}),e,null,[[1,,10,13]])})));return function(n){return e.apply(this,arguments)}}();return(0,Z.jsx)(c.Z,{open:T,loading:y,handleClose:function(){return S(!1)},title:"\u4f9d\u983c\u5374\u4e0b\u78ba\u8a8d",disabled:Object.keys(I).length>0,primaryButtonColor:"error",primaryButtonText:"\u5374\u4e0b\u3059\u308b",maxWidth:"md",handleSubmit:R(L),children:(0,Z.jsx)(u.Z,{children:(0,Z.jsx)(l.Z,(0,r.Z)((0,r.Z)({variant:"outlined",autoFocus:!0,required:!0,margin:"dense",fullWidth:!0,multiline:!0,minRows:4,size:"small",label:"\u30b3\u30e1\u30f3\u30c8",placeholder:"\u81ea\u7531\u306b\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",InputLabelProps:{shrink:!0}},E("other")),{},{error:"other"in I}))})})}},65661:function(e,n,t){var r=t(87462),i=t(63366),o=t(72791),a=t(28182),s=t(94419),u=t(20890),l=t(66934),d=t(31402),c=t(17673),f=t(85090),h=t(80184),p=["className","id"],m=(0,l.ZP)(u.Z,{name:"MuiDialogTitle",slot:"Root",overridesResolver:function(e,n){return n.root}})({padding:"16px 24px",flex:"0 0 auto"}),v=o.forwardRef((function(e,n){var t=(0,d.Z)({props:e,name:"MuiDialogTitle"}),u=t.className,l=t.id,v=(0,i.Z)(t,p),x=t,Z=function(e){var n=e.classes;return(0,s.Z)({root:["root"]},c.a,n)}(x),w=o.useContext(f.Z).titleId,g=void 0===w?l:w;return(0,h.jsx)(m,(0,r.Z)({component:"h2",className:(0,a.Z)(Z.root,u),ownerState:x,ref:n,variant:"h6",id:null!=l?l:g},v))}));n.Z=v}}]);
//# sourceMappingURL=9184.4ca0398f.chunk.js.map