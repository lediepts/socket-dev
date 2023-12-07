"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[131],{13368:function(e,r,n){n.r(r),n.d(r,{default:function(){return x}});var t=n(29439),i=n(53767),a=n(20890),o=n(68870),s=n(27391),l=n(63466),c=n(36151),u=n(58069),d=n(72791),f=n(11087),h=n(48367),v=n(70135),m=n(5403),p=n(80184);function x(){var e=(0,h.CG)((function(e){return e.UI.tokenInfo})),r=(0,h.CG)((function(e){return e.Mailing.status})),n=(0,h.CG)((function(e){return e.Mailing.list})),x=(0,d.useState)(""),g=(0,t.Z)(x,2),k=g[0],Z=g[1],S=(0,h.TL)();(0,d.useEffect)((function(){"init"===r&&S((0,v.Tk)())}),[]);var w=(0,d.useMemo)((function(){return n.filter((function(e){return e.mailMembers.find((function(e){return e.email.includes(k)}))}))}),[n,k]);return e?(0,p.jsxs)(i.Z,{gap:2,children:[(0,p.jsxs)(i.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",gap:2,sx:{},children:[(0,p.jsx)(a.Z,{sx:{fontWeight:600},variant:"h5",children:"\u30e1\u30fc\u30ea\u30f3\u30b0\u30ea\u30b9\u30c8\u4e00\u89a7"}),(0,p.jsx)(o.Z,{flex:1,maxWidth:300,children:(0,p.jsx)(s.Z,{variant:"outlined",margin:"dense",fullWidth:!0,size:"small",InputProps:{startAdornment:(0,p.jsx)(l.Z,{position:"start",children:(0,p.jsx)(m.Z,{})})},label:"\u30d5\u30a3\u30eb\u30bf\u30fc",InputLabelProps:{shrink:!0},value:k,onChange:function(e){return Z(e.target.value)}})}),(0,p.jsx)(f.rU,{to:"/mailing/create",children:(0,p.jsx)(c.Z,{variant:"outlined",sx:{minWidth:120},children:"\u65b0\u898f\u4f5c\u6210"})})]}),(0,p.jsx)(u._,{rows:w,columns:[{field:"name",headerName:"\u30e1\u30fc\u30eb\u30b0\u30eb\u30fc\u30d7\u540d",flex:1,renderCell:function(e){return(0,p.jsx)(f.rU,{to:"/mailing/".concat(e.row.id),children:(0,p.jsx)(a.Z,{variant:"caption",mr:1,children:e.row.name})})}},{field:"email",headerName:"\u30e1\u30f3\u30d0\u30fc\u4e00\u89a7",flex:2,renderCell:function(e){return(0,p.jsx)(a.Z,{variant:"caption",mr:1,sx:{maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},component:"p",dangerouslySetInnerHTML:{__html:e.row.mailMembers.map((function(e){return e.email})).sort((function(e,r){var n=e.indexOf(k);return r.indexOf(k)-n})).join(",").replaceAll(k,'<span style="color:#a00;background:#ff2b;">'.concat(k,"</span>"))}})}},{field:"type",headerName:"\u5f0f",width:100}],initialState:{pagination:{paginationModel:{page:0,pageSize:10}}},pageSizeOptions:[10,20,30,50],sx:{"& .MuiDataGrid-cell:focus":{outline:"none"},"& .MuiDataGrid-cell:focus-within":{outline:"none"},"& .MuiDataGrid-cell:hover":{},"& .MuiDataGrid-columnHeaders":{bgcolor:"primary.dark",color:"#fff"},"& .MuiDataGrid-columnHeaders svg":{color:"#fff"}},density:"compact",hideFooterSelectedRowCount:!0,disableColumnMenu:!0,disableRowSelectionOnClick:!0})]}):null}},5403:function(e,r,n){var t=n(64836);r.Z=void 0;var i=t(n(45649)),a=n(80184),o=(0,i.default)((0,a.jsx)("path",{d:"M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"}),"Search");r.Z=o},13239:function(e,r,n){n.d(r,{Z:function(){return I}});var t=n(30168),i=n(63366),a=n(87462),o=n(72791),s=n(28182),l=n(94419),c=n(52554),u=n(14036),d=n(31402),f=n(66934),h=n(75878),v=n(21217);function m(e){return(0,v.Z)("MuiCircularProgress",e)}(0,h.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var p,x,g,k,Z,S,w,b,C=n(80184),M=["className","color","disableShrink","size","style","thickness","value","variant"],y=44,j=(0,c.F4)(Z||(Z=p||(p=(0,t.Z)(["\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n"])))),D=(0,c.F4)(S||(S=x||(x=(0,t.Z)(["\n  0% {\n    stroke-dasharray: 1px, 200px;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -15px;\n  }\n\n  100% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -125px;\n  }\n"])))),P=(0,f.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:function(e,r){var n=e.ownerState;return[r.root,r[n.variant],r["color".concat((0,u.Z)(n.color))]]}})((function(e){var r=e.ownerState,n=e.theme;return(0,a.Z)({display:"inline-block"},"determinate"===r.variant&&{transition:n.transitions.create("transform")},"inherit"!==r.color&&{color:(n.vars||n).palette[r.color].main})}),(function(e){return"indeterminate"===e.ownerState.variant&&(0,c.iv)(w||(w=g||(g=(0,t.Z)(["\n      animation: "," 1.4s linear infinite;\n    "]))),j)})),z=(0,f.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:function(e,r){return r.svg}})({display:"block"}),G=(0,f.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:function(e,r){var n=e.ownerState;return[r.circle,r["circle".concat((0,u.Z)(n.variant))],n.disableShrink&&r.circleDisableShrink]}})((function(e){var r=e.ownerState,n=e.theme;return(0,a.Z)({stroke:"currentColor"},"determinate"===r.variant&&{transition:n.transitions.create("stroke-dashoffset")},"indeterminate"===r.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})}),(function(e){var r=e.ownerState;return"indeterminate"===r.variant&&!r.disableShrink&&(0,c.iv)(b||(b=k||(k=(0,t.Z)(["\n      animation: "," 1.4s ease-in-out infinite;\n    "]))),D)})),I=o.forwardRef((function(e,r){var n=(0,d.Z)({props:e,name:"MuiCircularProgress"}),t=n.className,o=n.color,c=void 0===o?"primary":o,f=n.disableShrink,h=void 0!==f&&f,v=n.size,p=void 0===v?40:v,x=n.style,g=n.thickness,k=void 0===g?3.6:g,Z=n.value,S=void 0===Z?0:Z,w=n.variant,b=void 0===w?"indeterminate":w,j=(0,i.Z)(n,M),D=(0,a.Z)({},n,{color:c,disableShrink:h,size:p,thickness:k,value:S,variant:b}),I=function(e){var r=e.classes,n=e.variant,t=e.color,i=e.disableShrink,a={root:["root",n,"color".concat((0,u.Z)(t))],svg:["svg"],circle:["circle","circle".concat((0,u.Z)(n)),i&&"circleDisableShrink"]};return(0,l.Z)(a,m,r)}(D),N={},R={},W={};if("determinate"===b){var F=2*Math.PI*((y-k)/2);N.strokeDasharray=F.toFixed(3),W["aria-valuenow"]=Math.round(S),N.strokeDashoffset="".concat(((100-S)/100*F).toFixed(3),"px"),R.transform="rotate(-90deg)"}return(0,C.jsx)(P,(0,a.Z)({className:(0,s.Z)(I.root,t),style:(0,a.Z)({width:p,height:p},R,x),ownerState:D,ref:r,role:"progressbar"},W,j,{children:(0,C.jsx)(z,{className:I.svg,ownerState:D,viewBox:"".concat(22," ").concat(22," ").concat(y," ").concat(y),children:(0,C.jsx)(G,{className:I.circle,style:N,ownerState:D,cx:y,cy:y,r:(y-k)/2,fill:"none",strokeWidth:k})})}))}))}}]);
//# sourceMappingURL=131.26b43cf5.chunk.js.map