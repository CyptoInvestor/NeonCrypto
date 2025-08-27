import cookie from 'cookie'
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const { access_token } = req.body || {}
  if(!access_token) return res.status(400).json({ message:'access_token required' })
  // set httpOnly cookie with Supabase access token
  res.setHeader('Set-Cookie', cookie.serialize('sb_access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  }))
  return res.status(200).json({ ok:true })
}
