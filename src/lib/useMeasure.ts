import { useLayoutEffect, useRef, useState } from 'react'

export type Size = { width: number; height: number }

/**
 * Mede um elemento e reage a mudanças de tamanho.
 *
 * O rasgo do papel do zine.js é calculado em pixels, não em porcentagem — é o
 * que mantém o dente do mesmo tamanho num card pequeno e num card grande. Para
 * isso o componente precisa saber a largura e a altura reais, e refazer o
 * recorte quando elas mudam (resize, fonte carregando, acordeão abrindo).
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const ro = new ResizeObserver(([entry]) => {
      /*
        borderBoxSize, não contentRect: clip-path usa a caixa de borda como
        referência. Medir o content box gerava um polígono menor que o elemento
        pelo tamanho do padding, e o recorte comia o conteúdo da direita.
      */
      const bb = entry.borderBoxSize?.[0]
      const box = bb
        ? { width: bb.inlineSize, height: bb.blockSize }
        : { width: el.offsetWidth, height: el.offsetHeight }

      setSize((prev) =>
        // arredonda: sem isso, frações de pixel disparam re-render em loop
        Math.round(prev.width) === Math.round(box.width) &&
        Math.round(prev.height) === Math.round(box.height)
          ? prev
          : { width: box.width, height: box.height },
      )
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}
