import Video from '../video'

let DEFAULT_WIDTH = 1600
let DEFAULT_HEIGHT = 900

export default abstract class VideoImplementation<T> {
  element: Video<T>
  url: any

  constructor(element: Video<T>) {
    this.element = element
  }

  get width(): number {
    let width = this.element.getAttribute('width')
    return width ? parseInt(width) : DEFAULT_WIDTH
  }

  get height() {
    let height = this.element.getAttribute('height')
    return height ? parseInt(height) : DEFAULT_HEIGHT
  }

  abstract get iframe(): string
  abstract get posterImageUrl(): string
}
