const base=(process.env.VITE_BHOJJ_API_URL||'https://bhojj.com/api').replace(/\/$/,'');
for (const p of ['/auth/csrf','/bootstrap']) {
  const r=await fetch(base+p,{headers:{Accept:'application/json'}});
  console.log(`${p}: HTTP ${r.status} ${r.headers.get('content-type')||''}`);
}
