"use strict";(self.webpackChunkcaa_client=self.webpackChunkcaa_client||[]).push([[3665],{16342:function(e,r,n){n.r(r),n.d(r,{default:function(){return h}});var t=n(53767),i=n(20890),a=n(36151),o=n(58069),s=n(72791),c=n(57689),l=n(11087),u=n(48367),d=n(23133),f=n(80184);function h(){var e=(0,c.TH)(),r=(0,u.TL)(),n=(0,u.CG)((function(e){return e.WebAuthor.status})),h=(0,u.CG)((function(e){return e.WebAuthor.list}));return(0,s.useEffect)((function(){"init"===n&&r((0,d.U)())}),[]),(0,f.jsxs)(t.Z,{gap:1,children:[(0,f.jsxs)(t.Z,{direction:"row",alignItems:"center",justifyContent:"space-between",gap:2,sx:{},children:[(0,f.jsx)(i.Z,{sx:{fontWeight:600},variant:"h5",children:"\u627f\u8a8d\u8005\u4e00\u89a7"}),(0,f.jsx)(l.rU,{to:"/author/create",state:{location:e},children:(0,f.jsx)(a.Z,{variant:"outlined",sx:{minWidth:120},children:"\u65b0\u898f\u4f5c\u6210"})})]}),(0,f.jsx)(o._,{rows:h,columns:[{field:"email",headerName:"\u627f\u8a8d\u30e1\u30fc\u30eb",flex:1,renderCell:function(e){return(0,f.jsx)(l.rU,{to:"/author/".concat(e.row.id),children:(0,f.jsx)(i.Z,{variant:"caption",mr:1,children:e.row.email})})}}],initialState:{pagination:{paginationModel:{page:0,pageSize:10}}},pageSizeOptions:[10,20,30,50],sx:{"& .MuiDataGrid-cell:focus":{outline:"none"},"& .MuiDataGrid-cell:focus-within":{outline:"none"},"& .MuiDataGrid-cell:hover":{},"& .MuiDataGrid-columnHeaders":{bgcolor:"primary.dark",color:"#fff"},"& .MuiDataGrid-columnHeaders svg":{color:"#fff"}},density:"compact",hideFooterSelectedRowCount:!0,disableColumnMenu:!0,disableRowSelectionOnClick:!0})]})}},13239:function(e,r,n){n.d(r,{Z:function(){return N}});var t=n(30168),i=n(63366),a=n(87462),o=n(72791),s=n(28182),c=n(94419),l=n(52554),u=n(14036),d=n(31402),f=n(66934),h=n(75878),v=n(21217);function m(e){return(0,v.Z)("MuiCircularProgress",e)}(0,h.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var p,k,x,g,Z,S,w,b,y=n(80184),C=["className","color","disableShrink","size","style","thickness","value","variant"],M=44,D=(0,l.F4)(Z||(Z=p||(p=(0,t.Z)(["\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n"])))),j=(0,l.F4)(S||(S=k||(k=(0,t.Z)(["\n  0% {\n    stroke-dasharray: 1px, 200px;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -15px;\n  }\n\n  100% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -125px;\n  }\n"])))),P=(0,f.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:function(e,r){var n=e.ownerState;return[r.root,r[n.variant],r["color".concat((0,u.Z)(n.color))]]}})((function(e){var r=e.ownerState,n=e.theme;return(0,a.Z)({display:"inline-block"},"determinate"===r.variant&&{transition:n.transitions.create("transform")},"inherit"!==r.color&&{color:(n.vars||n).palette[r.color].main})}),(function(e){return"indeterminate"===e.ownerState.variant&&(0,l.iv)(w||(w=x||(x=(0,t.Z)(["\n      animation: "," 1.4s linear infinite;\n    "]))),D)})),G=(0,f.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:function(e,r){return r.svg}})({display:"block"}),R=(0,f.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:function(e,r){var n=e.ownerState;return[r.circle,r["circle".concat((0,u.Z)(n.variant))],n.disableShrink&&r.circleDisableShrink]}})((function(e){var r=e.ownerState,n=e.theme;return(0,a.Z)({stroke:"currentColor"},"determinate"===r.variant&&{transition:n.transitions.create("stroke-dashoffset")},"indeterminate"===r.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})}),(function(e){var r=e.ownerState;return"indeterminate"===r.variant&&!r.disableShrink&&(0,l.iv)(b||(b=g||(g=(0,t.Z)(["\n      animation: "," 1.4s ease-in-out infinite;\n    "]))),j)})),N=o.forwardRef((function(e,r){var n=(0,d.Z)({props:e,name:"MuiCircularProgress"}),t=n.className,o=n.color,l=void 0===o?"primary":o,f=n.disableShrink,h=void 0!==f&&f,v=n.size,p=void 0===v?40:v,k=n.style,x=n.thickness,g=void 0===x?3.6:x,Z=n.value,S=void 0===Z?0:Z,w=n.variant,b=void 0===w?"indeterminate":w,D=(0,i.Z)(n,C),j=(0,a.Z)({},n,{color:l,disableShrink:h,size:p,thickness:g,value:S,variant:b}),N=function(e){var r=e.classes,n=e.variant,t=e.color,i=e.disableShrink,a={root:["root",n,"color".concat((0,u.Z)(t))],svg:["svg"],circle:["circle","circle".concat((0,u.Z)(n)),i&&"circleDisableShrink"]};return(0,c.Z)(a,m,r)}(j),z={},F={},W={};if("determinate"===b){var H=2*Math.PI*((M-g)/2);z.strokeDasharray=H.toFixed(3),W["aria-valuenow"]=Math.round(S),z.strokeDashoffset="".concat(((100-S)/100*H).toFixed(3),"px"),F.transform="rotate(-90deg)"}return(0,y.jsx)(P,(0,a.Z)({className:(0,s.Z)(N.root,t),style:(0,a.Z)({width:p,height:p},F,k),ownerState:j,ref:r,role:"progressbar"},W,D,{children:(0,y.jsx)(G,{className:N.svg,ownerState:j,viewBox:"".concat(22," ").concat(22," ").concat(M," ").concat(M),children:(0,y.jsx)(R,{className:N.circle,style:z,ownerState:j,cx:M,cy:M,r:(M-g)/2,fill:"none",strokeWidth:g})})}))}))}}]);
//# sourceMappingURL=3665.e370d661.chunk.js.map