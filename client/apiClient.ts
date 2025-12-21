import request from 'superagent'

const rootURL = 'https://www.dnd5eapi.co/api'

export async function getSpells() {
  const res = await request.get(`${rootURL}/spells`)
  console.log (getSpells)
  return res.body.results
}

export async function getSpellDetails(index: string) {
  const res = await request.get(`${rootURL}/spells/${index}`)
  return res.body
}

export async function getClasses() {
  const res = await request.get(`${rootURL}/classes`)
  return res.body.results
}

export async function getMonsters() {
  const res = await request.get(`${rootURL}/monsters`)
  return res.body.results
}

export async function getMonsterDetails(index: string) {
  const res = await request.get(`${rootURL}/monsters/${index}`)
  return res.body
}