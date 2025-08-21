import { API, requireAuthRedirect } from './api.js';
const me=await requireAuthRedirect();
const avatar=document.getElementById('avatar'); const nameEl=document.getElementById('name'); const emailEl=document.getElementById('email'); const joinedEl=document.getElementById('joined');
function set(u){ avatar.src=u.avatarUrl||`https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(u.name||u.email)}`; nameEl.value=u.name||''; emailEl.value=u.email||''; joinedEl.value=new Date(u.joined).toLocaleDateString(); }
set(me);
document.getElementById('save').addEventListener('click', async ()=>{ const res=await API.updateMe({ name:nameEl.value.trim() }); if(res.ok) set(res.user); });
document.getElementById('pick').addEventListener('change', async (e)=>{ const f=e.target.files?.[0]; if(!f) return; const res=await API.uploadAvatar(f); if(res.ok) avatar.src=res.avatarUrl; });
