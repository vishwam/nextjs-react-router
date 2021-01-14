/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg' {
  import type { ExoticComponent, SVGProps } from 'react'

  /**
   * Import SVG as a React component. Use this ONLY for files < 10KB: larger
   * images should be pulled in as <img> so: (a) they don't bloat our bundle
   * size, and (b) the browser can cache and optimize them.
   */
  export const ReactComponent: ExoticComponent<SVGProps<SVGSVGElement>>

  const src: string
  export default src
}
