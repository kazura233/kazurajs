"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7643],{4379:(e,t,a)=>{a.r(t),a.d(t,{default:()=>j});a(7378);var n=a(3372),s=a(9101),r=a(5679),i=a(102),l=a(6903),o=a(5164),c=a(1736),d=a(2065),g=a(167),m=a(8736),u=a(6106);function h(e){const t=(0,m.kJ)(e);return(0,u.jsx)(g.A,{children:(0,u.jsx)("script",{type:"application/ld+json",children:JSON.stringify(t)})})}function p(e){const{metadata:t}=e,{siteConfig:{title:a}}=(0,s.A)(),{blogDescription:n,blogTitle:i,permalink:l}=t,o="/"===l?a:i;return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(r.be,{title:o,description:n}),(0,u.jsx)(c.A,{tag:"blog_posts_list"})]})}function x(e){const{metadata:t,items:a,sidebar:n}=e;return(0,u.jsxs)(l.A,{sidebar:n,children:[(0,u.jsx)(d.A,{items:a}),(0,u.jsx)(o.A,{metadata:t})]})}function j(e){return(0,u.jsxs)(r.e3,{className:(0,n.A)(i.G.wrapper.blogPages,i.G.page.blogListPage),children:[(0,u.jsx)(p,{...e}),(0,u.jsx)(h,{...e}),(0,u.jsx)(x,{...e})]})}},5164:(e,t,a)=>{a.d(t,{A:()=>i});a(7378);var n=a(6568),s=a(8205),r=a(6106);function i(e){const{metadata:t}=e,{previousPage:a,nextPage:i}=t;return(0,r.jsxs)("nav",{className:"pagination-nav","aria-label":(0,n.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[a&&(0,r.jsx)(s.A,{permalink:a,title:(0,r.jsx)(n.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),i&&(0,r.jsx)(s.A,{permalink:i,title:(0,r.jsx)(n.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}},3784:(e,t,a)=>{a.d(t,{A:()=>U});a(7378);var n=a(3372),s=a(8736),r=a(6106);function i(e){let{children:t,className:a}=e;return(0,r.jsx)("article",{className:a,children:t})}var l=a(9953);const o={title:"title_Ws3T"};function c(e){let{className:t}=e;const{metadata:a,isBlogPostPage:i}=(0,s.e7)(),{permalink:c,title:d}=a,g=i?"h1":"h2";return(0,r.jsx)(g,{className:(0,n.A)(o.title,t),children:i?d:(0,r.jsx)(l.A,{to:c,children:d})})}var d=a(6568),g=a(5664),m=a(9639);const u={container:"container_EAcF"};function h(e){let{readingTime:t}=e;const a=function(){const{selectMessage:e}=(0,g.W)();return t=>{const a=Math.ceil(t);return e(a,(0,d.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:a}))}}();return(0,r.jsx)(r.Fragment,{children:a(t)})}function p(e){let{date:t,formattedDate:a}=e;return(0,r.jsx)("time",{dateTime:t,children:a})}function x(){return(0,r.jsx)(r.Fragment,{children:" \xb7 "})}function j(e){let{className:t}=e;const{metadata:a}=(0,s.e7)(),{date:i,readingTime:l}=a,o=(0,m.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,r.jsxs)("div",{className:(0,n.A)(u.container,"margin-vert--md",t),children:[(0,r.jsx)(p,{date:i,formattedDate:(c=i,o.format(new Date(c)))}),void 0!==l&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x,{}),(0,r.jsx)(h,{readingTime:l})]})]});var c}var A=a(2529);const b={authorCol:"authorCol_QK4C",imageOnlyAuthorRow:"imageOnlyAuthorRow_YyGQ",imageOnlyAuthorCol:"imageOnlyAuthorCol_Rq7q"};function f(e){let{className:t}=e;const{metadata:{authors:a},assets:i}=(0,s.e7)();if(0===a.length)return null;const l=a.every((e=>{let{name:t}=e;return!t})),o=1===a.length;return(0,r.jsx)("div",{className:(0,n.A)("margin-top--md margin-bottom--sm",l?b.imageOnlyAuthorRow:"row",t),children:a.map(((e,t)=>(0,r.jsx)("div",{className:(0,n.A)(!l&&(o?"col col--12":"col col--6"),l?b.imageOnlyAuthorCol:b.authorCol),children:(0,r.jsx)(A.A,{author:{...e,imageURL:i.authorsImageUrls[t]??e.imageURL}})},t)))})}function v(){return(0,r.jsxs)("header",{children:[(0,r.jsx)(c,{}),(0,r.jsx)(j,{}),(0,r.jsx)(f,{})]})}var N=a(1147),T=a(1506);function _(e){let{children:t,className:a}=e;const{isBlogPostPage:i}=(0,s.e7)();return(0,r.jsx)("div",{id:i?N.LU:void 0,className:(0,n.A)("markdown",a),children:(0,r.jsx)(T.A,{children:t})})}var k=a(102),w=a(7414),P=a(7878);function y(){return(0,r.jsx)("b",{children:(0,r.jsx)(d.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function R(e){const{blogPostTitle:t,...a}=e;return(0,r.jsx)(l.A,{"aria-label":(0,d.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...a,children:(0,r.jsx)(y,{})})}function C(){const{metadata:e,isBlogPostPage:t}=(0,s.e7)(),{tags:a,title:i,editUrl:l,hasTruncateMarker:o,lastUpdatedBy:c,lastUpdatedAt:d}=e,g=!t&&o,m=a.length>0;if(!(m||g||l))return null;if(t){const e=!!(l||d||c);return(0,r.jsxs)("footer",{className:"docusaurus-mt-lg",children:[m&&(0,r.jsx)("div",{className:(0,n.A)("row","margin-top--sm",k.G.blog.blogFooterEditMetaRow),children:(0,r.jsx)("div",{className:"col",children:(0,r.jsx)(P.A,{tags:a})})}),e&&(0,r.jsx)(w.A,{className:(0,n.A)("margin-top--sm",k.G.blog.blogFooterEditMetaRow),editUrl:l,lastUpdatedAt:d,lastUpdatedBy:c})]})}return(0,r.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[m&&(0,r.jsx)("div",{className:(0,n.A)("col",{"col--9":g}),children:(0,r.jsx)(P.A,{tags:a})}),g&&(0,r.jsx)("div",{className:(0,n.A)("col text--right",{"col--3":m}),children:(0,r.jsx)(R,{blogPostTitle:i,to:e.permalink})})]})}function U(e){let{children:t,className:a}=e;const l=function(){const{isBlogPostPage:e}=(0,s.e7)();return e?void 0:"margin-bottom--xl"}();return(0,r.jsxs)(i,{className:(0,n.A)(l,a),children:[(0,r.jsx)(v,{}),(0,r.jsx)(_,{children:t}),(0,r.jsx)(C,{})]})}},2065:(e,t,a)=>{a.d(t,{A:()=>i});a(7378);var n=a(8736),s=a(3784),r=a(6106);function i(e){let{items:t,component:a=s.A}=e;return(0,r.jsx)(r.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,r.jsx)(n.in,{content:t,children:(0,r.jsx)(a,{children:(0,r.jsx)(t,{})})},t.metadata.permalink)}))})}},8205:(e,t,a)=>{a.d(t,{A:()=>i});a(7378);var n=a(3372),s=a(9953),r=a(6106);function i(e){const{permalink:t,title:a,subLabel:i,isNext:l}=e;return(0,r.jsxs)(s.A,{className:(0,n.A)("pagination-nav__link",l?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t,children:[i&&(0,r.jsx)("div",{className:"pagination-nav__sublabel",children:i}),(0,r.jsx)("div",{className:"pagination-nav__label",children:a})]})}},5688:(e,t,a)=>{a.d(t,{A:()=>l});a(7378);var n=a(3372),s=a(9953);const r={tag:"tag_mHPJ",tagRegular:"tagRegular_NGHX",tagWithCount:"tagWithCount_pPaK"};var i=a(6106);function l(e){let{permalink:t,label:a,count:l,description:o}=e;return(0,i.jsxs)(s.A,{href:t,title:o,className:(0,n.A)(r.tag,l?r.tagWithCount:r.tagRegular),children:[a,l&&(0,i.jsx)("span",{children:l})]})}},7878:(e,t,a)=>{a.d(t,{A:()=>o});a(7378);var n=a(3372),s=a(6568),r=a(5688);const i={tags:"tags_mWXY",tag:"tag_FZ9A"};var l=a(6106);function o(e){let{tags:t}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("b",{children:(0,l.jsx)(s.A,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list",children:"Tags:"})}),(0,l.jsx)("ul",{className:(0,n.A)(i.tags,"padding--none","margin-left--sm"),children:t.map((e=>(0,l.jsx)("li",{className:i.tag,children:(0,l.jsx)(r.A,{...e})},e.permalink)))})]})}}}]);