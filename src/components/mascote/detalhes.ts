import * as THREE from 'three'

/**
 * Peças extras do mascote, montadas em cima do mascote.glb na hora do load
 * (sem precisar reexportar do Blender), e a vitrola que serve de base giratória.
 *
 * As posições estão em coordenadas do Blender, as mesmas do build_mascote.py
 * (Z para cima, frente em -Y); `b()` converte para o glTF (Y para cima, frente em +Z).
 */
const b = (x: number, y: number, z: number) => new THREE.Vector3(x, z, -y)

export type Kit = {
  toon: (cor: string, map?: THREE.Texture) => THREE.Material
  contorno: (m: THREE.Mesh) => void
  textura: (c: HTMLCanvasElement) => THREE.Texture
}

export type Alvo = 'mascote' | 'base' | 'esq' | 'dir'

const CREME = '#F1EAD9', CORAL = '#E8503A', ROXO = '#7B5CC4', ROXO_ESC = '#5E43A3', PRETO = '#1A1A1A'
const METAL = '#8C8C94', METAL_ESC = '#4A4A52'

function tela(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  return [c, c.getContext('2d')!] as const
}

function asterisco(c: CanvasRenderingContext2D, cx: number, cy: number, r: number, cor: string, borda: number) {
  c.lineCap = 'round'
  for (const [estilo, lw] of [[PRETO, r * 0.42 + borda * 2], [cor, r * 0.42]] as const) {
    c.strokeStyle = estilo; c.lineWidth = lw
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 2
      c.beginPath()
      c.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
      c.lineTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r)
      c.stroke()
    }
  }
}

/** Patch redondo das costas da jaqueta: asterisco coral com costura tracejada. */
function patchCostas() {
  const [cv, c] = tela(256, 256)
  c.fillStyle = PRETO; c.beginPath(); c.arc(128, 128, 126, 0, Math.PI * 2); c.fill()
  c.fillStyle = CREME; c.beginPath(); c.arc(128, 128, 114, 0, Math.PI * 2); c.fill()
  c.setLineDash([10, 8]); c.strokeStyle = ROXO_ESC; c.lineWidth = 4
  c.beginPath(); c.arc(128, 128, 102, 0, Math.PI * 2); c.stroke(); c.setLineDash([])
  asterisco(c, 128, 128, 72, CORAL, 7)
  return cv
}

/** Post-it colado atrás da cabeça. */
function postIt() {
  const [cv, c] = tela(128, 128)
  c.fillStyle = '#F5D547'; c.fillRect(0, 0, 128, 128)
  c.fillStyle = 'rgba(0,0,0,0.08)'; c.fillRect(0, 0, 128, 18)
  c.fillStyle = PRETO; c.font = 'bold 26px monospace'; c.textAlign = 'center'
  c.fillText('fix', 64, 62); c.fillText('bug!', 64, 92)
  c.strokeStyle = CORAL; c.lineWidth = 4; c.beginPath(); c.moveTo(28, 104); c.lineTo(100, 100); c.stroke()
  return cv
}

/** Slipmat do prato: sulcos roxos e duas setas curvas dizendo que gira. */
function slipmat() {
  const [cv, c] = tela(512, 512)
  c.fillStyle = CREME; c.beginPath(); c.arc(256, 256, 256, 0, Math.PI * 2); c.fill()
  c.strokeStyle = 'rgba(94,67,163,0.35)'; c.lineWidth = 2
  for (let r = 120; r < 248; r += 9) { c.beginPath(); c.arc(256, 256, r, 0, Math.PI * 2); c.stroke() }
  c.fillStyle = CORAL; c.beginPath(); c.arc(256, 256, 96, 0, Math.PI * 2); c.fill()
  asterisco(c, 256, 256, 58, CREME, 5)
  c.lineCap = 'round'; c.strokeStyle = PRETO; c.fillStyle = PRETO; c.lineWidth = 14
  for (const a0 of [0.15 * Math.PI, 1.15 * Math.PI]) {
    const a1 = a0 + 0.55 * Math.PI, R = 214
    c.beginPath(); c.arc(256, 256, R, a0, a1); c.stroke()
    const px = 256 + Math.cos(a1) * R, py = 256 + Math.sin(a1) * R
    const tx = -Math.sin(a1), ty = Math.cos(a1) // tangente no sentido do arco
    c.beginPath()
    c.moveTo(px + tx * 34, py + ty * 34)
    c.lineTo(px - ty * 24, py + tx * 24)
    c.lineTo(px + ty * 24, py - tx * 24)
    c.closePath(); c.fill()
  }
  return cv
}

/** Lateral do plinto: faixa de pontos de estroboscópio, como numa vitrola. */
function lateralPlinto() {
  const [cv, c] = tela(1024, 64)
  c.fillStyle = ROXO_ESC; c.fillRect(0, 0, 1024, 64)
  c.fillStyle = PRETO; c.fillRect(0, 0, 1024, 8); c.fillRect(0, 56, 1024, 8)
  c.fillStyle = CREME
  for (let x = 16; x < 1024; x += 32) { c.beginPath(); c.arc(x, 32, 7, 0, Math.PI * 2); c.fill() }
  return cv
}

/** Enfeites presos nas partes do mascote. Devolve as malhas novas, para entrarem no raycast. */
export function montarDetalhes(parts: Record<string, THREE.Object3D>, k: Kit): THREE.Mesh[] {
  const novos: THREE.Mesh[] = []
  const peca = (pai: string, geo: THREE.BufferGeometry, mat: THREE.Material, pos: THREE.Vector3, rot?: [number, number, number], linha = true) => {
    const alvo = parts[pai]
    if (!alvo) return
    const m = new THREE.Mesh(geo, mat)
    m.position.copy(pos)
    if (rot) m.rotation.set(...rot)
    alvo.attach(m)
    if (linha) k.contorno(m)
    novos.push(m)
  }
  const HZ = 1.62
  const mat = (cor: string) => k.toon(cor)

  // cabeça: botões de sintonia na lateral, grade de ventilação e post-it atrás
  const botao = new THREE.CylinderGeometry(0.034, 0.038, 0.03, 18)
  peca('Head', botao, mat(CORAL), b(-0.285, -0.065, HZ + 0.07), [0, 0, Math.PI / 2])
  peca('Head', botao, mat(PRETO), b(-0.285, -0.065, HZ - 0.05), [0, 0, Math.PI / 2])
  for (let i = 0; i < 4; i++) {
    peca('Head', new THREE.BoxGeometry(0.15, 0.011, 0.012), mat(METAL_ESC), b(0, 0.243, HZ + 0.07 - i * 0.028), undefined, false)
  }
  peca('Head', new THREE.PlaneGeometry(0.1, 0.1), k.toon('#ffffff', k.textura(postIt())), b(0.207, 0.11, HZ + 0.03), [0, Math.PI / 2 - 0.2, 0.12], false)

  // jaqueta: zíper, puxador, bolso, pin e o patch das costas
  for (const sx of [1, -1]) {
    peca('Body', new THREE.BoxGeometry(0.012, 0.36, 0.012), mat(METAL), b(0.081 * sx, -0.148, 1.06), undefined, false)
  }
  peca('Body', new THREE.BoxGeometry(0.024, 0.05, 0.01), mat(METAL), b(0.081, -0.158, 1.0))
  peca('Body', new THREE.BoxGeometry(0.13, 0.034, 0.016), mat(ROXO_ESC), b(-0.17, -0.158, 0.97))
  peca('Body', new THREE.SphereGeometry(0.009, 8, 6), mat('#2EF2E0'), b(-0.17, -0.168, 0.965), undefined, false)
  peca('Body', new THREE.CylinderGeometry(0.026, 0.026, 0.012, 20), mat(CORAL), b(-0.205, -0.16, 1.235), [Math.PI / 2, 0, 0])
  peca('Body', new THREE.PlaneGeometry(0.23, 0.23), k.toon('#ffffff', k.textura(patchCostas())), b(0, 0.178, 1.07), [0, Math.PI, 0], false)

  // pernas: barra da calça, meia listrada, cadarço e remendo no joelho
  for (const sx of [1, -1]) {
    const x = 0.135 * sx
    peca('Mascote', new THREE.CylinderGeometry(0.114, 0.114, 0.05, 16), mat('#2A2A2A'), b(x, 0, 0.235))
    peca('Mascote', new THREE.CylinderGeometry(0.099, 0.099, 0.035, 16), mat(CREME), b(x, 0, 0.192), undefined, false)
    peca('Mascote', new THREE.CylinderGeometry(0.1, 0.1, 0.01, 16), mat(CORAL), b(x, 0, 0.198), undefined, false)
    for (const y of [-0.09, -0.05, -0.01]) {
      peca('Mascote', new THREE.BoxGeometry(0.1, 0.01, 0.016), mat(PRETO), b(x, y, 0.178), undefined, false)
    }
  }
  peca('Mascote', new THREE.BoxGeometry(0.08, 0.07, 0.012), mat(ROXO), b(-0.135, -0.104, 0.5), [0, 0, 0.15])

  return novos
}

/**
 * Vitrola que serve de base: o plinto fica parado, o prato gira junto com o
 * mascote. Os dois botões de seta na frente do plinto dão um empurrão no giro.
 */
export function montarBase(k: Kit) {
  const prato = new THREE.Group()
  const pick: THREE.Mesh[] = []
  const marca = (m: THREE.Mesh, alvo: Alvo) => { m.userData.alvo = alvo; pick.push(m); return m }

  const disco = marca(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 48), k.toon(PRETO)), 'base')
  disco.position.y = -0.02
  k.contorno(disco)
  const mat = marca(new THREE.Mesh(new THREE.CircleGeometry(0.57, 48), k.toon('#ffffff', k.textura(slipmat()))), 'base')
  mat.rotation.x = -Math.PI / 2
  mat.position.y = 0.0015
  prato.add(disco, mat)

  const plinto = new THREE.Group()
  const lateral = k.textura(lateralPlinto())
  lateral.wrapS = THREE.RepeatWrapping
  const corpo = marca(new THREE.Mesh(new THREE.CylinderGeometry(0.69, 0.72, 0.075, 48), [k.toon('#ffffff', lateral), k.toon(PRETO), k.toon(PRETO)]), 'base')
  corpo.position.y = -0.0775
  k.contorno(corpo)
  plinto.add(corpo)

  const cima = new THREE.Vector3(0, 1, 0)
  const botoes = {} as Record<'esq' | 'dir', THREE.Group>
  for (const [lado, th] of [['esq', -0.42], ['dir', 0.42]] as const) {
    const radial = new THREE.Vector3(Math.sin(th), 0, Math.cos(th))
    const tangente = new THREE.Vector3(Math.cos(th), 0, -Math.sin(th)).multiplyScalar(lado === 'esq' ? -1 : 1)
    const g = new THREE.Group()
    g.position.copy(radial).multiplyScalar(0.715).setY(-0.078)
    const tecla = marca(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.04, 20), k.toon(CORAL)), lado)
    tecla.quaternion.setFromUnitVectors(cima, radial)
    k.contorno(tecla)
    const seta = marca(new THREE.Mesh(new THREE.ConeGeometry(0.026, 0.05, 3), k.toon(CREME)), lado)
    seta.quaternion.setFromUnitVectors(cima, tangente)
    seta.position.copy(radial).multiplyScalar(0.024)
    g.add(tecla, seta)
    g.userData.radial = radial
    g.userData.repouso = g.position.clone()
    botoes[lado] = g
    plinto.add(g)
  }

  return { prato, plinto, botoes, pick }
}
