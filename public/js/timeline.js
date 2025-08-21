import { API, requireAuthRedirect } from './api.js';
import { applyThemeButton, wireDrawer } from './utils.js';
await requireAuthRedirect();

document.getElementById('year').textContent = new Date().getFullYear();
applyThemeButton(document.getElementById('themeBtn'));
wireDrawer();

document.getElementById('loginLink').style.display='none';
document.getElementById('profileLink').style.display='inline-flex';
document.getElementById('logoutLink').addEventListener('click', async (e)=>{ e.preventDefault(); await API.logout(); location.href='/auth-login.html'; });

let page=1, limit=16, order='desc', items=[];
const qEl=document.getElementById('q'), typeEl=document.getElementById('type'), timeline=document.getElementById('timeline'), pageInfo=document.getElementById('pageInfo'), loadMoreBtn=document.getElementById('loadMore'), sortBtn=document.getElementById('sort');
const isImage=(m)=> (m||'').startsWith('image/'); const isVideo=(m)=> (m||'').startsWith('video/');
const cardHTML=(it)=>{ const when=new Date(it.createdAt).toLocaleString(); const tags=(it.tags||[]).map(t=>`<span class="tag">#${t}</span>`).join(''); return `<article class="card"><a class="media" target="_blank" rel="noopener noreferrer" href="${it.url}">${isImage(it.mimetype)?`<img src="${it.url}" alt="">`:''}${isVideo(it.mimetype)?`<video src="${it.url}" controls preload="metadata"></video>`:''}</a><div class="meta"><span>${when}</span><div><button class="btn btn-outline" data-del="${it.id}">Delete</button></div></div><div class="tags">${tags}</div></article>`; };
function render(list){ timeline.innerHTML=''; list.forEach((it,i)=>{ const side=(i%2===0)?'left':'right'; const row=document.createElement('div'); row.className='row'; const left=document.createElement('div'); left.className='cell left'+(side==='left'?' has-card':''); const mid=document.createElement('div'); mid.className='cell middle'; const right=document.createElement('div'); right.className='cell right'+(side==='right'?' has-card':''); (side==='left'?left:right).innerHTML=cardHTML(it); row.append(left,mid,right); timeline.appendChild(row); }); pageInfo.textContent=`Loaded ${list.length} item(s)`; }
async function loadMore(){ const { ok, items:batch=[], total=0, error }=await API.listMedia({ page, limit, order, q:qEl.value, type:typeEl.value }); if(!ok){ pageInfo.textContent=error||'Failed to load'; return; } items=items.concat(batch); render(items); if(items.length>=total) loadMoreBtn.disabled=true; page++; }
sortBtn.addEventListener('click', async ()=>{ order=(order==='desc')?'asc':'desc'; sortBtn.textContent=(order==='desc')?'Newest':'Oldest'; page=1; items=[]; loadMoreBtn.disabled=false; await loadInitial(); });
loadMoreBtn.addEventListener('click', loadMore);
qEl.addEventListener('input', async ()=>{ page=1; items=[]; loadMoreBtn.disabled=false; await loadInitial(); });
typeEl.addEventListener('change', async ()=>{ page=1; items=[]; loadMoreBtn.disabled=false; await loadInitial(); });

document.getElementById('upload').addEventListener('click', ()=> document.getElementById('picker').click());
document.getElementById('picker').addEventListener('change', async ()=>{ const files=document.getElementById('picker').files; if(!files?.length) return; document.getElementById('status').textContent='Uploading…'; const res=await API.uploadMedia(files); document.getElementById('status').textContent=res.ok?`Uploaded ${res.count}`:(res.error||'Error'); page=1; items=[]; loadMoreBtn.disabled=false; await loadInitial(); });

document.addEventListener('click', async (e)=>{ const btn=e.target.closest('[data-del]'); if(!btn) return; const id=btn.getAttribute('data-del'); const res=await API.deleteMedia(id); if(res.ok){ items=items.filter(x=>x.id!==id); render(items); } });
async function loadInitial(){ page=1; items=[]; await loadMore(); }
await loadInitial();
