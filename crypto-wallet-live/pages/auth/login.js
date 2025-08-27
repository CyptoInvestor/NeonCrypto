import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'
export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState(''); const router=useRouter()
  async function submit(e){ e.preventDefault(); setErr(''); const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if(error) return setErr(error.message); const access = data.session?.access_token; if(!access) return setErr('No access token returned'); // send to server to set httpOnly cookie
    const s = await fetch('/api/auth/session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ access_token: access }) }); if(!s.ok) return setErr('Failed to set session'); router.push('/dashboard') }
  return (<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><form onSubmit={submit} style={{width:420,padding:20,background:'#071128',borderRadius:10}}><h2>Login</h2><input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:8}} /><input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginTop:8}} />{err && <div style={{marginTop:8,color:'#fca5a5'}}>{err}</div>}<button style={{marginTop:12,padding:8,background:'#0f1724',borderRadius:8}}>Sign in</button></form></div>)
}
