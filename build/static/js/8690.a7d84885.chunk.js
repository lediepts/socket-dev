"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[8690],{12457:function(e,n,t){t.d(n,{Z:function(){return m}});var r=t(74165),i=t(15861),o=t(1413),s=t(39709),c=t(53767),a=t(39157),l=t(68870),u=t(5574),d=t(97123),x=t(65661),f=t(55931),h=t(72791),p=t(80184),g=h.forwardRef((function(e,n){return(0,p.jsx)(f.Z,(0,o.Z)({direction:"down",ref:n},e))}));function m(e){var n=e.open,t=e.loading,o=e.title,f=void 0===o?"":o,m=e.maxWidth,Z=void 0===m?"sm":m,j=e.primaryButton,v=void 0===j||j,b=e.closeButtonText,w=void 0===b?"\u9589\u3058\u308b":b,y=e.primaryButtonText,C=void 0===y?"\u5b9f\u65bd\u3059\u308b":y,k=e.children,S=e.primaryButtonColor,I=void 0===S?"primary":S,W=e.component,z=void 0===W?"div":W,M=e.disabled,T=void 0!==M&&M,E=e.backdropClick,U=e.useEnterKey,B=void 0===U||U,G=e.handleClose,P=e.handleSubmit;return(0,h.useEffect)((function(){var e=function(e){"Enter"===e.key&&B&&P&&!T&&P()};return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}}),[T,P,B]),(0,p.jsx)(p.Fragment,{children:(0,p.jsx)(u.Z,{open:n,TransitionComponent:g,fullWidth:!0,maxWidth:Z,onClose:function(e,n){(E||"backdropClick"!==n)&&G()},sx:{"& .MuiPaper-root":{opacity:.98,margin:1,width:{sm:"100%",md:"95%"}}},children:(0,p.jsxs)(c.Z,{component:z,spacing:1,children:[(0,p.jsx)(x.Z,{sx:{fontWeight:"bold",py:1},children:f}),(0,p.jsx)(a.Z,{children:(0,p.jsx)(l.Z,{sx:{py:1,maxHeight:"75vh"},children:k})}),(0,p.jsx)(d.Z,{children:(0,p.jsxs)(c.Z,{width:"100%",direction:"row",justifyContent:"space-around",alignItems:"center",mb:1,children:[(0,p.jsx)(s.Z,{loading:t,variant:"outlined",color:"inherit",size:"small",sx:{width:100},onClick:function(){return G()},children:w}),v&&(0,p.jsx)(s.Z,{loading:t,variant:"contained",color:I,disabled:T,size:"small",type:"form"===z?"submit":"button",sx:{width:100},onClick:function(){var e=(0,i.Z)((0,r.Z)().mark((function e(n){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.preventDefault(),n.stopPropagation(),e.t0=P,!e.t0){e.next=6;break}return e.next=6,P();case 6:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),children:C})]})})]})})})}},78690:function(e,n,t){t.r(n),t.d(n,{default:function(){return P}});var r=t(74165),i=t(15861),o=t(93433),s=t(29439),c=t(53717),a=t(53767),l=t(20890),u=t(36151),d=t(94721),x=t(74310),f=t(1413),h=t(36459),p=t(16856),g=t(80184);function m(e){var n=Object.assign({},((0,h.Z)(e),e));return(0,g.jsx)(u.Z,(0,f.Z)((0,f.Z)({size:"small",color:"info",variant:"outlined"},n),{},{sx:(0,f.Z)({mx:.5,px:.5,py:.2,minWidth:0},n.sx),children:(0,g.jsx)(p.Sbz,{style:{fontSize:24}})}))}var Z=t(16386),j=t(87376),v=t(72791),b=t(39126),w=t(56355),y=t(57689),C=t(11087),k=t(48367),S=t(49822),I=t(86081),W=t(94604),z=t(27391),M=t(85523),T=t(94454),E=t(57870),U=t(12457);function B(e){var n=e.canSelectPage,t=(0,k.TL)(),c=(0,v.useState)(!1),d=(0,s.Z)(c,2),h=d[0],p=d[1],m=(0,v.useState)(!1),Z=(0,s.Z)(m,2),b=Z[0],w=Z[1],y=(0,v.useState)(""),C=(0,s.Z)(y,2),S=C[0],I=C[1],B=(0,v.useState)(""),G=(0,s.Z)(B,2),P=G[0],L=G[1],D=(0,v.useState)(""),A=(0,s.Z)(D,2),H=A[0],R=A[1],F=(0,v.useState)(new Date(36e5*Math.ceil((new Date).getTime()/36e5))),_=(0,s.Z)(F,2),O=_[0],Q=_[1],J=(0,k.CG)((function(e){return e.UI.tokenInfo})),K=(0,v.useState)([]),N=(0,s.Z)(K,2),q=N[0],V=N[1],X=(0,v.useState)([]),Y=(0,s.Z)(X,2),$=Y[0],ee=Y[1],ne=(0,v.useState)([]),te=(0,s.Z)(ne,2),re=te[0],ie=te[1],oe=(0,k.CG)((function(e){return e.WebAuthor.list}));(0,v.useEffect)((function(){h||(ie([]),ee([]),V([]))}),[h]);var se=(0,v.useMemo)((function(){return n.filter((function(e){return e.active&&"\u516c\u958b\u6e08"!==e.status&&"\u7533\u8acb\u4e2d"!==e.status&&(e.url.includes(S)||e.title.includes(S))&&!$.find((function(n){return n.id===e.id}))}))}),[n,S,$]),ce=(0,v.useMemo)((function(){return n.filter((function(e){return e.active&&"\u7533\u8acb\u4e2d"!==e.status&&("\u516c\u958b\u6e08"===e.status||n.find((function(n){return n.id!==e.id&&n.uuid===e.uuid})))&&(e.url.includes(P)||e.title.includes(P))&&!q.find((function(n){return n.id===e.id}))}))}),[n,P,q]),ae=(0,v.useMemo)((function(){return oe.filter((function(e){return e.email.includes(H)}))}),[oe,H]);if(!J||J.permissions[j.g.CMS]<2)return null;var le=function(){var e=(0,i.Z)((0,r.Z)().mark((function e(){var n,i,o;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,w(!0),e.next=4,x.g.create({authorizers:re.map((function(e){return e.id})),pageIds:{public:q.map((function(e){return e.id})),unPublic:$.map((function(e){return e.id}))},hopeTime:O.getTime()});case 4:n=e.sent,i=n.error,o=n.message,t(W.T9.addGlobalMessage({type:i?"error":"success",message:o})),p(!1);case 9:return e.prev=9,w(!1),e.finish(9);case 12:case"end":return e.stop()}}),e,null,[[0,,9,12]])})));return function(){return e.apply(this,arguments)}}();return(0,g.jsxs)(a.Z,{children:[(0,g.jsx)(u.Z,{variant:"outlined",color:"success",sx:{minWidth:120},onClick:function(){return p(!h)},children:"\u627f\u8a8d\u7533\u8acb"}),(0,g.jsxs)(U.Z,{open:h,loading:b,handleClose:function(){return p(!1)},title:"\u627f\u8a8d\u7533\u8acb",disabled:0===re.length||0===q.length&&0===$.length,primaryButtonText:"\u7533\u8acb",primaryButtonColor:"success",component:"form",maxWidth:"xl",handleSubmit:le,children:[(0,g.jsx)(a.Z,{my:1,width:250,children:(0,g.jsx)(E.x,{label:"\u516c\u958b\u4e88\u5b9a",views:["year","month","day","hours","minutes"],inputFormat:"yyyy\u5e74MM\u6708dd\u65e5 HH:mm",value:O,minutesStep:5,onChange:function(e){e&&Q(e)},minDate:new Date,renderInput:function(e){return(0,g.jsx)(z.Z,(0,f.Z)((0,f.Z)({},e),{},{size:"small"}))}})}),(0,g.jsxs)(a.Z,{direction:"row",gap:1,height:"70vh",children:[(0,g.jsxs)(a.Z,{flex:1,sx:{border:"1px solid #ccc"},children:[(0,g.jsx)(a.Z,{sx:{bgcolor:"#0fa3",borderBottom:"1px solid #ccc",p:1,overflow:"auto"},gap:1,children:(0,g.jsx)(l.Z,{children:"\u516c\u958b\u7533\u8acb\u30da\u30fc\u30b8"})}),(0,g.jsx)(a.Z,{p:.5,children:(0,g.jsx)(z.Z,{variant:"outlined",margin:"dense",fullWidth:!0,size:"small",label:"\u30d5\u30a3\u30eb\u30bf\u30fc",InputLabelProps:{shrink:!0},value:S,onChange:function(e){return I(e.target.value)}})}),(0,g.jsxs)(a.Z,{sx:{flex:1,overflow:"auto",px:.5},children:[!S&&(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:q.length===se.length,onChange:function(e){var n=e.target.checked;V(n?(0,o.Z)(se):[])}}),label:"\u5168\u3066"})}),se.map((function(e){return(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:!!q.find((function(n){return n.id===e.id})),onChange:function(n){if(n.target.checked)V([].concat((0,o.Z)(q),[e]));else{var t=q.filter((function(n){return n.id!==e.id}));V(t)}}}),label:e.url})},e.id)}))]})]}),(0,g.jsxs)(a.Z,{flex:1,sx:{border:"1px solid #ccc"},children:[(0,g.jsx)(a.Z,{sx:{bgcolor:"#f205",borderBottom:"1px solid #ccc",p:1,overflow:"auto"},gap:1,children:(0,g.jsx)(l.Z,{children:"\u975e\u516c\u958b\u7533\u8acb\u30da\u30fc\u30b8"})}),(0,g.jsx)(a.Z,{p:.5,children:(0,g.jsx)(z.Z,{variant:"outlined",margin:"dense",fullWidth:!0,size:"small",label:"\u30d5\u30a3\u30eb\u30bf\u30fc",InputLabelProps:{shrink:!0},value:P,onChange:function(e){return L(e.target.value)}})}),(0,g.jsxs)(a.Z,{sx:{flex:1,overflow:"auto",px:.5},children:[!P&&(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:$.length===ce.length,onChange:function(e){var n=e.target.checked;ee(n?(0,o.Z)(ce):[])}}),label:"\u5168\u3066"})}),ce.map((function(e){return(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:!!$.find((function(n){return n.id===e.id})),onChange:function(n){if(n.target.checked)ee([].concat((0,o.Z)($),[e]));else{var t=$.filter((function(n){return n.id!==e.id}));ee(t)}}}),label:e.url})},e.id)}))]})]}),(0,g.jsxs)(a.Z,{flex:1,sx:{border:"1px solid #ccc"},children:[(0,g.jsx)(a.Z,{sx:{bgcolor:"#eee",borderBottom:"1px solid #ccc",p:1,overflow:"auto"},gap:1,children:(0,g.jsx)(l.Z,{children:"\u627f\u8a8d\u8005"})}),(0,g.jsx)(a.Z,{p:.5,children:(0,g.jsx)(z.Z,{variant:"outlined",margin:"dense",fullWidth:!0,size:"small",label:"\u30d5\u30a3\u30eb\u30bf\u30fc",InputLabelProps:{shrink:!0},value:H,onChange:function(e){return R(e.target.value)}})}),(0,g.jsxs)(a.Z,{sx:{flex:1,overflow:"auto",px:.5},children:[!H&&(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:re.length===ae.length,onChange:function(e){var n=e.target.checked;ie(n?(0,o.Z)(ae):[])}}),label:"\u5168\u3066"})}),ae.map((function(e){return(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,children:(0,g.jsx)(M.Z,{sx:{px:2},control:(0,g.jsx)(T.Z,{size:"small",sx:{p:0},checked:!!re.find((function(n){return n.id===e.id})),onChange:function(n){if(n.target.checked)ie([].concat((0,o.Z)(re),[e]));else{var t=re.filter((function(n){return n.id!==e.id}));ie(t)}}}),label:e.email})},e.id)}))]})]})]})]})]})}var G=t(39709);function P(){var e=(0,y.UO)().webId,n=(0,k.TL)(),t=(0,y.s0)(),f=(0,k.aM)(),h=(0,k.CG)((function(e){return e.UI.tokenInfo})),z=(0,k.CG)((function(e){return e.CMS.Page.list})).filter((function(n){return e&&n.webId===parseInt(e)})),M=(0,k.CG)((function(e){return e.CMS.Page.status})),T=(0,k.CG)((function(e){return e.CMS.Web.list})).find((function(n){return n.id===Number(e)}));(0,v.useEffect)((function(){"init"===M&&n((0,S.UQ)())}),[M,n]);var E=(0,k.CG)((function(e){return e.CMS.Template.status})),U=(0,v.useState)(!1),P=(0,s.Z)(U,2),L=P[0],D=P[1];(0,v.useEffect)((function(){"init"===E&&n((0,I.uR)())}),[]),(0,v.useEffect)((function(){e||t(-1)}),[e,t]);var A=(0,k.CG)((function(e){return e.Workflow.list})).filter((function(e){return e.sender===(null===h||void 0===h?void 0:h.id)})),H=(0,k.CG)((function(e){return e.UI.currentPath})),R=(0,v.useState)([""]),F=(0,s.Z)(R,2),_=F[0],O=F[1];(0,v.useEffect)((function(){var e=f.get("p");if(!e)return O([""]);O(e.split("/"))}),[f]);var Q=(0,v.useMemo)((function(){return z.filter((function(e){return!H.find((function(n){return n.path==="/cms/".concat(e.webId,"/page/").concat(e.id)}))}))}),[H,z]),J=(0,v.useMemo)((function(){var e=[],n=[],t=new RegExp("^"+_.join("/")+"/","g");return z.filter((function(e){return e.active})).filter((function(e){return e.url.match(t)})).forEach((function(t){if(t.url.split("/").length===_.length+1)e.push(t);else{var r=t.url.split("/")[_.length];n.includes(r)||n.push(r)}})),{folders:n,files:e}}),[z,_]);return e&&T&&h?(0,g.jsxs)(a.Z,{gap:1,children:[(0,g.jsxs)(a.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",gap:2,sx:{},children:[(0,g.jsx)(l.Z,{sx:{fontWeight:600},variant:"h5",children:"\u30da\u30fc\u30b8\u4e00\u89a7\u7ba1\u7406"}),(0,g.jsx)(B,{canSelectPage:Q}),h.permissions[j.g.CMS]>1&&(0,g.jsx)(C.rU,{to:"/cms/".concat(e,"/page/create"),children:(0,g.jsx)(u.Z,{variant:"outlined",sx:{minWidth:120},children:"\u65b0\u898f\u4f5c\u6210"})})]}),(0,g.jsx)(d.Z,{}),(0,g.jsxs)(a.Z,{border:"1px solid #eee",py:1,children:[(0,g.jsxs)(a.Z,{direction:"row",gap:.1,alignItems:"center",px:1,children:[(0,g.jsx)(l.Z,{width:60,fontWeight:600,children:"URL:"}),"~",(0,g.jsx)(l.Z,{onClick:function(){O([""])},sx:{color:"#004cff",cursor:"pointer","&:hover":{color:"#0093ff",textDecoration:"underline"}},children:T.name}),"/",_.map((function(e,n){return(0,g.jsxs)(v.Fragment,{children:[(0,g.jsx)(l.Z,{onClick:function(){O((0,o.Z)(_).slice(0,n+1))},sx:{color:"#004cff",cursor:"pointer","&:hover":{color:"#0093ff",textDecoration:"underline"}},children:e}),!!e&&"/"]},n)}))]}),(0,g.jsx)(d.Z,{sx:{mb:2,mt:1}}),J.folders.length>0&&(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a.Z,{direction:"row",gap:2,flexWrap:"wrap",children:J.folders.map((function(e,n){return(0,g.jsxs)(a.Z,{direction:"row",justifyContent:"center",alignItems:"center",gap:.5,sx:{cursor:"pointer",p:1,userSelect:"none","&:hover":{bgcolor:"#eee6",boxShadow:"0 2px 4px rgba(0,0,0,0.3)"},"&:active":{bgcolor:"#eee",boxShadow:"0 2px 2px rgba(0,0,0,0.2)"}},onClick:function(){O([].concat((0,o.Z)(_),[e])),t("./?p="+[].concat((0,o.Z)(_),[e]).join("/"))},children:[(0,g.jsx)(c.Z,{sx:{color:"#eeb200",fontSize:32,minWidth:30}}),(0,g.jsx)(l.Z,{fontWeight:600,children:e})]},n)}))}),(0,g.jsx)(d.Z,{sx:{my:2}})]}),(0,g.jsxs)(a.Z,{direction:"row",gap:1,sx:{borderBottom:"1px dashed #eee",py:1,bgcolor:"#eee8",px:1},children:[(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,flex:1,children:"\u30d5\u30a1\u30a4\u30eb\u540d"}),(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,flex:1,children:"URL"}),(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,width:145,children:"\u7de8\u96c6\u65e5\u4ed8"}),(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,width:100,textAlign:"center",children:"\u30b9\u30c6\u30fc\u30bf\u30b9"}),(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,width:100,textAlign:"center",children:"\u30d7\u30ec\u30d3\u30e5\u30fc"}),(0,g.jsx)(l.Z,{variant:"body2",fontWeight:600,flex:1,children:"\u7de8\u96c6\u8005"})]}),J.files.map((function(t,o){var s=H.find((function(e){return e.path==="/cms/".concat(t.webId,"/page/").concat(t.id)})),c=A.find((function(e){return"created"===e.status&&e.pageId===t.id}));return(0,g.jsxs)(a.Z,{direction:"row",gap:1,sx:{borderBottom:"1px dashed #eee",py:.5,px:1,bgcolor:s||"\u7533\u8acb\u4e2d"===t.status?c?"#cf33":"#a403":"transparent","&:hover":{bgcolor:s||"\u7533\u8acb\u4e2d"===t.status?"":"#eee8"},position:"relative"},children:[c&&(0,g.jsx)(a.Z,{sx:{position:"absolute",top:0,right:0,height:"100%"},direction:"row",alignItems:"center",children:(0,g.jsxs)(G.Z,{size:"small",variant:"contained",color:"warning",loading:L,sx:{display:"flex",gap:1,alignItems:"center",p:0,px:1},onClick:(0,i.Z)((0,r.Z)().mark((function e(){var t,i,o;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,D(!0),e.next=4,x.g.remand({id:c.id});case 4:t=e.sent,i=t.error,o=t.message,n(W.T9.addGlobalMessage({type:i?"error":"success",message:o}));case 8:return e.prev=8,D(!1),e.finish(8);case 11:case"end":return e.stop()}}),e,null,[[0,,8,11]])}))),children:[(0,g.jsx)(w.TQl,{}),"\u53d6\u308a\u4e0b\u3052"]})}),(0,g.jsx)(a.Z,{direction:"row",alignItems:"center",gap:.5,flex:1,children:h.permissions[j.g.CMS]<2||s||"\u7533\u8acb\u4e2d"===t.status?(0,g.jsxs)(l.Z,{variant:"body2",flex:1,children:[(0,g.jsx)(b.cUI,{style:{fontSize:24,minWidth:30}}),t.url.split("/").pop(),(0,g.jsx)(p.vJ9,{style:{fontSize:20,minWidth:30,color:"#f50"}})]}):(0,g.jsxs)(C.rU,{to:"/cms/".concat(e,"/page/").concat(t.id),children:[(0,g.jsx)(b.cUI,{style:{fontSize:24,minWidth:30}}),t.url.split("/").pop()]})}),(0,g.jsx)(l.Z,{variant:"body2",flex:1,children:t.url}),(0,g.jsx)(l.Z,{variant:"body2",width:145,children:(0,Z.Z)(new Date(t.updatedAt),"yyyy\u5e74MM\u6708dd\u65e5 HH:mm")}),(0,g.jsx)(l.Z,{variant:"body2",width:100,textAlign:"center",children:t.status}),(0,g.jsx)(C.rU,{to:"".concat("","/staging/").concat(t.web.name).concat(t.url),target:"_blank",children:(0,g.jsx)(l.Z,{variant:"body2",width:100,textAlign:"center",children:(0,g.jsx)(m,{variant:"text"})})}),(0,g.jsx)(l.Z,{flex:1,variant:"caption",mr:1,children:null===s||void 0===s?void 0:s.auth.email})]},o)}))]})]}):null}}}]);
//# sourceMappingURL=8690.a7d84885.chunk.js.map