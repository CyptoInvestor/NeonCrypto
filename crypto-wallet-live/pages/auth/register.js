import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
export default function Register(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState('')
  async function submit(e){ e.preventDefault(); setMsg(''); const { data, error } = await supabase.auth.signUp({ email, password }); if(error) setMsg(error.message); else setMsg('Check your email for verification link.') }
  return (<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><form onSubmit={submit} style={{width:420,padding:20,background:'#071128',borderRadius:10}}><h2>Register</h2><input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,marginTop:8}} /><input placeholder='Password' type='password' value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginTop:8}} />{msg && <div style={{marginTop:8}}>{msg}</div>}<button style={{marginTop:12,padding:8,background:'#16a34a',borderRadius:8}}>Sign up</button></form></div>)
}
