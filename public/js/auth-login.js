import { API } from './api.js';
(async()=>{ const me=await API.me(); if(me.ok) location.href='/'; })();
document.getElementById('login').addEventListener('click', async ()=>{ const email=document.getElementById('email').value.trim(); const pass=document.getElementById('pass').value; const res=await API.login(email,pass); document.getElementById('msg').textContent=res.ok?'Success':(res.error||'Error'); if(res.ok) location.href='/'; });
