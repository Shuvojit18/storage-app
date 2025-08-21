import { API } from './api.js';
(async()=>{ const me=await API.me(); if(me.ok) location.href='/'; })();
document.getElementById('signup').addEventListener('click', async ()=>{ const name=document.getElementById('name').value.trim(); const email=document.getElementById('email').value.trim(); const pass=document.getElementById('pass').value; const res=await API.signup(name,email,pass); document.getElementById('msg').textContent=res.ok?'Success':(res.error||'Error'); if(res.ok) location.href='/profile.html'; });
