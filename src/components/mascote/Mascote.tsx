import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { drawFace, GW, GH, type FaceKey } from './faces'
import { montarBase, montarDetalhes, type Alvo, type Kit } from './detalhes'

/**
 * Mascote 3D: monitor CRT com cara em pixel, em pé numa vitrola que gira.
 * Modelo em /models/mascote.glb (gerado por build_mascote.py no Blender),
 * com as partes Head, Body, ArmL, ArmR, CableRoot e Screen; os enfeites e a
 * vitrola vêm de detalhes.ts.
 *
 * Carregado com React.lazy, então o three.js fica num chunk separado. O canvas
 * não captura o mouse: os eventos vêm da janela e só contam quando o raio acerta
 * o mascote ou a base. Arrastar gira com inércia; clicar na base ou nas setas
 * dá um empurrão.
 */
export type MascoteProps = {
  reduced: boolean
  className?: string
  /** 'aceno' deixa o braço levantado dando tchau */
  pose?: 'normal' | 'aceno'
  /** ângulo inicial em radianos (0 = de frente) */
  giro?: number
}

const CELL = 8
const GLOW: Record<string, number> = { CyanGlow: 1.6, BulbGlow: 1.25, LedRed: 1.6, LedCyan: 1.6, LedGreen: 1.6 }
const ARRASTO_MIN = 6 // px até um clique virar arrasto

export default function Mascote({ reduced, className, pose = 'normal', giro: giroInicial = 0 }: MascoteProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let disposed = false

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    wrap.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50)
    camera.position.set(0, 1.4, 5.6)
    camera.lookAt(0, 0.98, 0)
    scene.add(new THREE.AmbientLight(0xffffff, 1.05))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(-2.5, 4, 4)
    scene.add(key)

    const texturas: THREE.Texture[] = []
    const gData = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255])
    const gradient = new THREE.DataTexture(gData, 3, 1, THREE.RGBAFormat)
    gradient.minFilter = gradient.magFilter = THREE.NearestFilter
    gradient.needsUpdate = true
    texturas.push(gradient)

    const outlineMat = new THREE.MeshBasicMaterial({ color: 0x141414, side: THREE.BackSide })
    outlineMat.onBeforeCompile = (s) => {
      s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = position + normal * 0.011;')
    }

    const kit: Kit = {
      toon: (cor, map) => {
        const m = new THREE.MeshToonMaterial({ color: cor, map: map ?? null, gradientMap: gradient })
        if (map) { m.transparent = true; m.alphaTest = 0.5 }
        return m
      },
      contorno: (o) => {
        const ol = new THREE.Mesh(o.geometry, outlineMat)
        ol.raycast = () => {}
        o.add(ol)
      },
      textura: (c) => {
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        texturas.push(t)
        return t
      },
    }

    // sombra chapada em cima do prato
    const sh = document.createElement('canvas')
    sh.width = sh.height = 64
    const shc = sh.getContext('2d')!
    shc.fillStyle = '#141414'
    shc.beginPath(); shc.ellipse(32, 32, 31, 31, 0, 0, Math.PI * 2); shc.fill()
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 0.5),
      new THREE.MeshBasicMaterial({ map: kit.textura(sh), transparent: true, opacity: 0.55, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.set(0.12, 0.004, 0.05)
    scene.add(shadow)

    // vitrola: o plinto fica parado, o prato e o mascote giram dentro de `spin`
    const spin = new THREE.Group()
    scene.add(spin)
    const base = montarBase(kit)
    spin.add(base.prato)
    scene.add(base.plinto)

    // halo da lâmpada (sem pós-processamento, para o fundo continuar transparente)
    const hc = document.createElement('canvas')
    hc.width = hc.height = 128
    const hcx = hc.getContext('2d')!
    const g = hcx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255,231,176,0.9)'); g.addColorStop(0.35, 'rgba(255,200,120,0.35)'); g.addColorStop(1, 'rgba(255,200,120,0)')
    hcx.fillStyle = g; hcx.fillRect(0, 0, 128, 128)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: kit.textura(hc), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }))
    halo.scale.setScalar(0.42)

    // tela
    const screenCanvas = document.createElement('canvas')
    screenCanvas.width = GW * CELL; screenCanvas.height = GH * CELL
    const sctx = screenCanvas.getContext('2d')!
    const faceCanvas = document.createElement('canvas')
    faceCanvas.width = GW * CELL; faceCanvas.height = GH * CELL
    const fctx = faceCanvas.getContext('2d')!
    const screenTex = kit.textura(screenCanvas)
    screenTex.flipY = false
    screenTex.magFilter = THREE.NearestFilter

    const parts: Record<string, THREE.Object3D> = {}
    const glowMats: Record<string, THREE.MeshBasicMaterial> = {}
    const pickables: THREE.Object3D[] = [...base.pick]

    new GLTFLoader().load('/models/mascote.glb', (gltf) => {
      if (disposed) return
      const root = gltf.scene
      const meshes: THREE.Mesh[] = []
      root.traverse((o) => {
        if (o.name) parts[o.name] = o
        if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh)
      })
      for (const o of meshes) {
        const src = o.material as THREE.MeshStandardMaterial
        const name = src.name || ''
        if (name === 'Screen') {
          o.material = new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false })
        } else if (GLOW[name]) {
          const m = new THREE.MeshBasicMaterial({ color: src.color.clone().multiplyScalar(GLOW[name]), toneMapped: false })
          m.userData.base = m.color.clone()
          glowMats[name] = m
          o.material = m
        } else {
          const m = new THREE.MeshToonMaterial({ color: src.color, map: src.map ?? null, gradientMap: gradient })
          if (src.map) { m.transparent = true; m.alphaTest = 0.5 }
          o.material = m
          if (!src.map) kit.contorno(o)
        }
      }
      root.updateMatrixWorld(true)
      meshes.push(...montarDetalhes(parts, kit))
      for (const o of meshes) {
        o.userData.alvo = 'mascote'
        pickables.push(o)
      }
      const bulb = parts.Bulb as THREE.Mesh | undefined
      if (bulb?.geometry) {
        bulb.geometry.computeBoundingBox()
        bulb.geometry.boundingBox!.getCenter(halo.position)
        bulb.add(halo)
      }
      spin.add(root)
    })

    // tamanho
    const resize = () => {
      const w = wrap.clientWidth, h = wrap.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    // entrada
    const pointer = { x: 0, y: 0, ndc: new THREE.Vector2(9, 9), last: performance.now(), speed: 0 }
    const ray = new THREE.Raycaster()
    let alvo: Alvo | null = null
    let holdStart = 0
    let clicks: number[] = []
    const until = { happy: 0, error: 0, glitch: 0, surprise: 0, wink: 0, jump: 0, flash: 0, esq: 0, dir: 0 }
    const giro = { ang: giroInicial, vel: 0 }
    let arrasto: { x: number; t: number; andou: number; alvo: Alvo } | null = null

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      const nx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)
      const ny = (e.clientY - (r.top + r.height * 0.25)) / (window.innerHeight / 2)
      const now = performance.now()
      const d = (Math.hypot(nx - pointer.x, ny - pointer.y) / Math.max(1, now - pointer.last)) * 1000
      pointer.speed = pointer.speed * 0.8 + d * 0.2
      pointer.x = THREE.MathUtils.clamp(nx, -1, 1)
      pointer.y = THREE.MathUtils.clamp(ny, -1, 1)
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (inside) pointer.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
      else pointer.ndc.set(9, 9)
      pointer.last = now
      if (arrasto) {
        const dx = e.clientX - arrasto.x
        const dt = Math.max(8, now - arrasto.t) / 1000
        arrasto.x = e.clientX; arrasto.t = now
        arrasto.andou += Math.abs(dx)
        if (arrasto.andou >= ARRASTO_MIN) {
          const da = dx * 0.012
          giro.ang += da
          giro.vel = giro.vel * 0.5 + (da / dt) * 0.5
        }
      }
    }
    const onDown = (e: PointerEvent) => {
      if (!alvo) return
      e.preventDefault() // não seleciona texto enquanto arrasta
      const now = performance.now()
      arrasto = { x: e.clientX, t: now, andou: 0, alvo }
      giro.vel = 0
      if (alvo === 'mascote') holdStart = now
    }
    const onUp = () => {
      const a = arrasto
      arrasto = null
      holdStart = 0
      if (!a) return
      const now = performance.now()
      if (a.andou >= ARRASTO_MIN) {
        if (now - a.t > 90) giro.vel = 0 // soltou parado: não sai girando
        return
      }
      if (a.alvo === 'esq' || a.alvo === 'dir') {
        giro.vel = a.alvo === 'dir' ? 5 : -5
        until[a.alvo] = now + 160
      } else if (a.alvo === 'base') {
        giro.vel = 7
      } else {
        clicks = clicks.filter((t) => now - t < 1200)
        clicks.push(now)
        if (clicks.length >= 3) {
          until.error = now + 1700; until.glitch = now + 1100; clicks = []
        } else {
          until.happy = now + 1300; until.flash = now + 700
          if (!reduced) until.jump = now + 520
        }
      }
    }
    const onCancel = () => { arrasto = null; holdStart = 0 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)

    // cursor: só mexe quando o estado deste mascote muda, para não brigar com outro na página
    let cursor = ''
    const setCursor = (c: string) => {
      if (c === cursor) return
      cursor = c
      document.body.style.cursor = c
    }

    // só anima com o mascote visível e a aba aberta
    let visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(wrap)

    const clock = new THREE.Clock()
    let lastNow = performance.now()
    let nextBlink = 2, blinkEnd = 0, nextGlitch = 6 + Math.random() * 6, nextWink = 5
    const look = { x: 0, y: 0 }
    const errColor = new THREE.Color(1.6, 0.35, 0.25)

    const chooseFace = (now: number, t: number): FaceKey => {
      const hovering = alvo === 'mascote'
      if (until.error > now) return 'erro'
      if (holdStart && hovering && arrasto && arrasto.andou < ARRASTO_MIN && now - holdStart > 900) return 'bravo'
      if (until.happy > now) return 'feliz'
      if (Math.abs(giro.vel) > 6) return 'surpreso'
      if (arrasto && arrasto.andou >= ARRASTO_MIN) return 'feliz'
      if (pointer.speed > 9 && hovering) until.surprise = now + 700
      if (until.surprise > now) return 'surpreso'
      const idle = (now - pointer.last) / 1000
      if (idle > 7 && idle < 10) return 'carregando'
      if (alvo) {
        if (t > nextWink) { until.wink = now + 650; nextWink = t + 5 + Math.random() * 4 }
        return until.wink > now ? 'piscadinha' : 'confiante'
      }
      return 'entediado'
    }

    const renderScreen = (face: FaceKey, t: number, now: number, frente: number) => {
      if (t > nextBlink) { blinkEnd = t + 0.12; nextBlink = t + 2.5 + Math.random() * 3 }
      drawFace(fctx, face, CELL, Math.round(look.x * 2.4 * frente), Math.round(look.y * 1.6), t < blinkEnd, t)
      const glitching = !reduced && (until.glitch > now || (t > nextGlitch && t < nextGlitch + 0.18))
      if (t > nextGlitch + 0.18) nextGlitch = t + 6 + Math.random() * 8
      const W = screenCanvas.width, H = screenCanvas.height
      sctx.globalCompositeOperation = 'source-over'
      if (glitching) {
        sctx.fillStyle = '#020605'; sctx.fillRect(0, 0, W, H)
        for (let i = 0; i < 5; i++) {
          const y0 = Math.floor(Math.random() * GH) * CELL
          const h = (1 + Math.floor(Math.random() * 3)) * CELL
          const dx = (Math.floor(Math.random() * 5) - 2) * CELL
          sctx.drawImage(faceCanvas, 0, y0, W, h, dx, y0, W, h)
        }
        sctx.globalAlpha = 0.6; sctx.drawImage(faceCanvas, CELL, 0); sctx.globalAlpha = 1
        sctx.globalCompositeOperation = 'source-atop'
        sctx.fillStyle = 'rgba(232,80,58,0.35)'
        sctx.fillRect(0, ((Math.random() * GH) | 0) * CELL, W, CELL * 2)
        sctx.globalCompositeOperation = 'source-over'
      } else {
        sctx.drawImage(faceCanvas, 0, 0)
      }
      sctx.fillStyle = 'rgba(0,0,0,0.28)'
      for (let y = 0; y < H; y += 4) sctx.fillRect(0, y, W, 1)
      sctx.fillStyle = 'rgba(46,242,224,0.06)'
      sctx.fillRect(0, ((t * 40) % (H + 40)) - 40, W, 24)
      screenTex.needsUpdate = true
    }

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const now = performance.now()
      const dt = Math.min(0.05, (now - lastNow) / 1000)
      lastNow = now
      if (!visible || document.hidden) {
        alvo = null
        if (!arrasto) setCursor('')
        return
      }
      const t = clock.getElapsedTime()

      if (pointer.ndc.x < 5) {
        ray.setFromCamera(pointer.ndc, camera)
        const hit = ray.intersectObjects(pickables, false)[0]
        alvo = (hit?.object.userData.alvo as Alvo | undefined) ?? null
      } else alvo = null
      setCursor(arrasto && arrasto.andou >= ARRASTO_MIN ? 'grabbing' : alvo === 'esq' || alvo === 'dir' ? 'pointer' : alvo ? 'grab' : '')

      // giro com inércia
      if (!arrasto) {
        giro.ang += giro.vel * dt
        giro.vel *= Math.exp(-dt * 1.6)
        if (Math.abs(giro.vel) < 0.02) giro.vel = 0
      }
      spin.rotation.y = giro.ang
      for (const lado of ['esq', 'dir'] as const) {
        const bt = base.botoes[lado]
        const fundo = until[lado] > now ? -0.018 : 0
        bt.position.copy(bt.userData.repouso).addScaledVector(bt.userData.radial, fundo)
      }

      const P = parts
      if (P.Mascote && P.Head && P.Body && P.ArmL && P.ArmR && P.CableRoot) {
        // de costas, olhar para o mouse inverteria o lado: some aos poucos
        const frente = Math.max(0, Math.cos(giro.ang))
        const face = chooseFace(now, t)
        look.x += (pointer.x - look.x) * 0.12
        look.y += (pointer.y - look.y) * 0.12
        renderScreen(face, t, now, frente)

        const m = reduced ? 0 : 1
        P.Head.rotation.y = look.x * 0.5 * frente
        P.Head.rotation.x = look.y * 0.22
        P.Head.rotation.z = Math.sin(t * 0.9) * 0.035 * m - look.x * 0.06 * frente
        P.Body.position.y = Math.sin(t * 2.1) * 0.012 * m
        P.Body.rotation.y = look.x * 0.12 * frente
        P.Body.position.x = face === 'bravo' ? (Math.random() - 0.5) * 0.012 * m : 0
        P.ArmL.rotation.z = Math.sin(t * 2.1 + 0.6) * 0.04 * m
        P.ArmR.rotation.z = -Math.sin(t * 2.1 + 0.6) * 0.04 * m
        if (face === 'feliz' && m) {
          P.ArmL.rotation.z += 0.5 + Math.sin(t * 14) * 0.15
          P.ArmR.rotation.z -= 0.5 + Math.sin(t * 14 + 1) * 0.15
        }
        if (pose === 'aceno') P.ArmL.rotation.z = 1.75 + Math.sin(t * 7) * 0.3 * m
        P.CableRoot.rotation.z = Math.sin(t * 1.3) * 0.05 * m
        P.CableRoot.rotation.x = Math.sin(t * 1.7) * 0.03 * m

        let jy = 0
        if (until.jump > now) jy = Math.sin((1 - (until.jump - now) / 520) * Math.PI) * 0.28
        P.Mascote.position.y = jy
        shadow.scale.setScalar(1 - jy * 0.9)

        const flash = until.flash > now ? 1 + ((until.flash - now) / 700) * 1.5 : 1
        const pulse = 0.85 + Math.sin(t * 3) * 0.15
        const bulb = glowMats.BulbGlow
        if (bulb) bulb.color.copy(bulb.userData.base).multiplyScalar(pulse * flash)
        halo.material.opacity = Math.min(1, 0.55 * pulse * flash)
        halo.scale.setScalar(0.42 * (1 + (flash - 1) * 0.5))

        const seq = Math.floor(t * 4) % 6
        ;(['LedRed', 'LedCyan', 'LedGreen'] as const).forEach((n, i) => {
          const gm = glowMats[n]
          if (!gm) return
          const on = face === 'erro' ? Math.floor(t * 10) % 2 === 1 && n === 'LedRed' : seq !== i
          gm.color.copy(gm.userData.base).multiplyScalar(on ? 1 : 0.2)
        })
        const cy = glowMats.CyanGlow
        if (cy) cy.color.copy(face === 'erro' ? errColor : cy.userData.base).multiplyScalar(0.85 + Math.sin(t * 2.4) * 0.15)
      }
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      if (cursor) document.body.style.cursor = ''
      ro.disconnect(); io.disconnect()
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.isMesh) {
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((mm) => mm?.dispose())
        }
      })
      texturas.forEach((tx) => tx.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reduced, pose, giroInicial])

  return <div ref={wrapRef} className={className} />
}
