import { supabaseAdmin } from '../../lib/supabaseServer'
import cookie from 'cookie'

async function getUserIdFromReq(req){
  const c = req.headers.cookie || ''
  const parsed = cookie.parse(c || '')
  const token = parsed.sb_access_token
  if(!token) return null
  try{
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if(error || !data?.user) return null
    return data.user.id
  }catch(e){ return null }
}

export default async function handler(req,res){
  const userId = await getUserIdFromReq(req)
  if(!userId) return res.status(401).json({ message: 'Unauthorized' })
  if(req.method === 'GET'){
    const { data, error } = await supabaseAdmin.from('wallets').select('btc,eth,usdt').eq('user_id', userId).single()
    if(error) return res.status(500).json({ message: error.message })
    const wallets = { BTC: data.btc, ETH: data.eth, USDT: data.usdt }
    return res.status(200).json({ wallets })
  }else if(req.method === 'POST'){
    const { action, symbol, address, delta } = req.body || {}
    const { data: existing, error: e } = await supabaseAdmin.from('wallets').select('id,btc,eth,usdt').eq('user_id', userId).single()
    if(e) return res.status(500).json({ message: e.message })
    let updates = {}
    if(action === 'setAddress'){
      if(symbol === 'BTC') updates = { btc: { ...existing.btc, address } }
      if(symbol === 'ETH') updates = { eth: { ...existing.eth, address } }
      if(symbol === 'USDT') updates = { usdt: { ...existing.usdt, address } }
    } else if(action === 'adjust'){
      const d = Number(delta) || 0
      if(symbol === 'BTC') updates = { btc: { balance: Math.max(0, Number((existing.btc.balance + d).toFixed(8))), address: existing.btc.address } }
      if(symbol === 'ETH') updates = { eth: { balance: Math.max(0, Number((existing.eth.balance + d).toFixed(8))), address: existing.eth.address } }
      if(symbol === 'USDT') updates = { usdt: { balance: Math.max(0, Number((existing.usdt.balance + d).toFixed(8))), address: existing.usdt.address } }
    } else return res.status(400).json({ message: 'Invalid action' })
    const { error: upErr } = await supabaseAdmin.from('wallets').update(updates).eq('user_id', userId)
    if(upErr) return res.status(500).json({ message: upErr.message })
    return res.status(200).json({ ok:true })
  }else return res.status(405).end()
}
