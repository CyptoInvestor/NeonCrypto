import Link from 'next/link'
export default function Home(){
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:720,padding:28,background:'#0f1724',borderRadius:12}}>
        <h1 style={{fontSize:24,marginBottom:6}}>Crypto Wallets — Live</h1>
        <p style={{marginBottom:12}}>Production-ready scaffold using Supabase for Auth & Postgres. Register, verify your email, login and manage BTC/ETH/USDT wallets.</p>
        <div style={{display:'flex',gap:8}}>
          <Link href='/auth/register'><a style={{padding:'8px 12px',background:'#16a34a',borderRadius:8}}>Register</a></Link>
          <Link href='/auth/login'><a style={{padding:'8px 12px',background:'#0f172a',borderRadius:8,border:'1px solid #233'}}>Login</a></Link>
        </div>
      </div>
    </div>
  )
}
