const withCsrf = (h={}) => ({ ...h, 'X-CSRF': '1' });
const j = (r)=>r.json();
export const API = {
  me: () => fetch('/api/auth/me', { credentials: 'include' }).then(j),
  login: (email, password) => fetch('/api/auth/login', { method:'POST', headers:withCsrf({'Content-Type':'application/json'}), credentials:'include', body: JSON.stringify({email,password}) }).then(j),
  signup: (name, email, password) => fetch('/api/auth/signup', { method:'POST', headers:withCsrf({'Content-Type':'application/json'}), credentials:'include', body: JSON.stringify({name,email,password}) }).then(j),
  logout: () => fetch('/api/auth/logout', { method:'POST', headers:withCsrf(), credentials:'include' }).then(j),
  updateMe: (payload) => fetch('/api/users/me', { method:'PUT', headers:withCsrf({'Content-Type':'application/json'}), credentials:'include', body: JSON.stringify(payload) }).then(j),
  uploadAvatar: (file) => { const fd=new FormData(); fd.append('avatar', file); return fetch('/api/users/avatar', { method:'POST', headers:withCsrf(), credentials:'include', body: fd }).then(j); },
  listMedia: (q) => { const qs = new URLSearchParams(q); return fetch('/api/media?'+qs.toString(), { credentials:'include' }).then(j); },
  uploadMedia: (files) => { const fd=new FormData(); for (const f of files) fd.append('files', f); return fetch('/api/media/upload', { method:'POST', headers:withCsrf(), credentials:'include', body: fd }).then(j); },
  deleteMedia: (id) => fetch('/api/media/'+id, { method:'DELETE', headers:withCsrf(), credentials:'include' }).then(j),
  updateMedia: (id, payload) => fetch('/api/media/'+id, { method:'PUT', headers:withCsrf({'Content-Type':'application/json'}), credentials:'include', body: JSON.stringify(payload)}).then(j),
};
export async function requireAuthRedirect(){ const me=await API.me(); if(!me.ok){ location.href='/auth-login.html'; throw new Error('Unauthorized'); } return me.user; }
