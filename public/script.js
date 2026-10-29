const NS='http://www.w3.org/2000/svg';
function node(tag,attrs={},parent){const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(parent)parent.appendChild(el);return el}
function label(svg,text,x,y,attrs={}){const el=node('text',{x,y,fill:'#385069','font-size':12,...attrs},svg);el.textContent=String(text);return el}
function chart(host,title,points,{kind='bar',xLabel='',yLabel='Count',line=null}={}){
 host.replaceChildren();const width=640,height=320,L=56,R=24,T=38,B=60,w=width-L-R,h=height-T-B;
 const svg=node('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':title,class:'chart'},host);
 label(svg,title,20,23,{'font-size':17,'font-weight':700});
 if(!points.length){label(svg,'Insufficient publishable groups to plot',70,160);return}
 const values=points.map(p=>Number(p.value));const lineValues=line?line.map(p=>Number(p.value)):[];
 const ymin=kind==='line'?Math.min(0,...values,...lineValues):0;
 const ymax=Math.max(1,...values,...lineValues)*1.13;const xy=i=>L+(points.length===1?.5:i/(points.length-1))*w;
 const yy=v=>T+h-(v-ymin)/(ymax-ymin)*h;
 for(let k=0;k<=4;k++){const v=ymin+k*(ymax-ymin)/4,y=yy(v);node('line',{x1:L,y1:y,x2:L+w,y2:y,stroke:'#e2e8f0'},svg);label(svg,(Math.round(v*10)/10).toString(),L-8,y+4,{'text-anchor':'end'})}
 node('line',{x1:L,y1:T,x2:L,y2:T+h,stroke:'#64748b'},svg);
 node('line',{x1:L,y1:T+h,x2:L+w,y2:T+h,stroke:'#64748b'},svg);
 if(kind==='bar'){points.forEach((p,i)=>{const bw=Math.min(65,w/points.length*.65),x=L+(i+.5)*w/points.length;node('rect',{x:x-bw/2,y:yy(p.value),width:bw,height:T+h-yy(p.value),fill:'#2563a0',rx:3},svg);label(svg,p.label,x,T+h+19,{'text-anchor':'middle','font-size':Math.min(11,120/points.length+5)})})}
 else {const d=points.map((p,i)=>`${i?'L':'M'}${xy(i)},${yy(p.value)}`).join(' ');node('path',{d,stroke:'#2563a0','stroke-width':2.6,fill:'none'},svg);
 if(kind==='scatter')points.forEach((p,i)=>node('circle',{cx:xy(i),cy:yy(p.value),r:4.2,fill:'#2563a0'},svg));
 if(line?.length===points.length)node('path',{d:line.map((p,i)=>`${i?'L':'M'}${xy(i)},${yy(p.value)}`).join(' '),fill:'none',stroke:'#e87935','stroke-width':3},svg);
 points.forEach((p,i)=>{if(points.length<=12||i%Math.ceil(points.length/10)===0)label(svg,p.label,xy(i),T+h+18,{'text-anchor':'middle','font-size':10})})}
 label(svg,xLabel,width/2,height-10,{'text-anchor':'middle'});
 label(svg,yLabel,14,height/2,{'text-anchor':'middle',transform:`rotate(-90 14 ${height/2})`});
}
function gaussian(x,mean,std){return Math.exp(-.5*Math.pow((x-mean)/std,2))/(std*Math.sqrt(2*Math.PI))}
function displayAnalytics(data){
 const panel=document.querySelector('#dashboard'),summary=document.querySelector('#summary');
 panel.hidden=false;summary.replaceChildren();
 for(const [name,value] of [['Students',data.total],['Average age',data.overview.average_age],['Std. deviation',data.overview.standard_deviation??'N/A']]){const e=document.createElement('div');e.className='stat';const t=document.createElement('strong');t.textContent=value;const s=document.createElement('span');s.textContent=name;e.append(t,s);summary.append(e)}
 for(const name of ['gender','education','country']){const rows=data.groups[name]||[];chart(document.querySelector('#chart-'+name),name==='education'?'Education level':name[0].toUpperCase()+name.slice(1),rows.map(r=>({label:r.category,value:Number(r.count)})),{xLabel:'Categories with at least 5 students'})}
 const ages=data.age_bands||[];chart(document.querySelector('#chart-ages'),'Age distribution',ages.map(r=>({label:r.band,value:Number(r.count)})),{xLabel:'10-year age bands (small groups suppressed)'});
 const mu=Number(data.overview.average_age),sd=Number(data.overview.standard_deviation);
 if(sd>0){const norm=Array.from({length:49},(_,i)=>{const x=mu-3*sd+6*sd*i/48;return {label:i%8===0?String(Math.round(x)):'',value:gaussian(x,mu,sd)}});chart(document.querySelector('#chart-normal'),'Normal distribution reference',norm,{kind:'line',xLabel:'Age (fitted normal reference)',yLabel:'Density'})}
 else chart(document.querySelector('#chart-normal'),'Normal distribution reference',[],{kind:'line'});
 const reg=data.regression;
 if(reg&&reg.available){const n=Number(data.total),points=Array.from({length:Math.min(n,70)},(_,i)=>{const seq=1+(n-1)*i/Math.max(1,Math.min(n,70)-1);return {label:i%Math.ceil(Math.min(n,70)/8)===0?String(Math.round(seq)):'',value:Number(reg.intercept)+Number(reg.slope)*seq}});chart(document.querySelector('#chart-regression'),'Regression: age vs registration order',points,{kind:'line',xLabel:'Registration order (illustrative)',yLabel:'Fitted age'});document.querySelector('#regression-note').textContent=`Slope ${Number(reg.slope).toFixed(3)} | R² ${Number(reg.r_squared).toFixed(3)}. Registration order is arbitrary: this line is educational, not a useful prediction.`}
 else {chart(document.querySelector('#chart-regression'),'Regression',[],{kind:'line'});document.querySelector('#regression-note').textContent='Regression unavailable due to insufficient variation.'}
}
const form=document.querySelector('#form'),message=document.querySelector('#message'),count=document.querySelector('#count'),analyze=document.querySelector('#analyze'),result=document.querySelector('#result');
async function stats(){try{const r=await fetch('/api/stats');if(!r.ok)throw Error();const d=await r.json();count.textContent=d.total+' registered; '+(d.analytics_ready?'analytics ready':'need '+(11-d.total)+' more to unlock analytics');analyze.disabled=!d.analytics_ready}catch{count.textContent='Unable to connect to MySQL';analyze.disabled=true}}
form.addEventListener('submit',async e=>{e.preventDefault();try{const r=await fetch('/api/students',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(form).entries()))});const d=await r.json();message.textContent=d.message||d.error;if(r.ok){form.reset();await stats()}}catch{message.textContent='Server unavailable'}});
analyze.addEventListener('click',async()=>{result.textContent='Loading analytics…';try{const r=await fetch('/api/analytics');const d=await r.json();if(!r.ok)throw Error(d.error||'Failed');result.textContent='';displayAnalytics(d)}catch(e){result.textContent=e.message}});
stats();
