import { createYoutubeVideo } from '../../../test/lib/util'
import '../../video'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('YouTube Video', () => {
  it('should provide the poster image', async () => {
    let { query } = await createYoutubeVideo('m6UOo2YGbIE')

    expect(query('img').getAttribute('src')).toBe(
      '/video/youtube/m6UOo2YGbIE-poster-image',
    )
  })

  it('should provide the poster image overwritten via attribute', async () => {
    let posterImage = 'http://www.test.de/youtube'
    let { query } = await createYoutubeVideo('m6UOo2YGbIE', {
      'poster-image': posterImage,
    })
    expect(query('img').getAttribute('src')).toBe(posterImage)
  })

  it('should load the youtube player after click', async () => {
    let { query, element } = await createYoutubeVideo('m6UOo2YGbIE')
    expect(query('iframe')).toBeNull()
    element.activate()
    expect(query('iframe')).toBeDefined()
  })

  it('should use the privacy-enhanced mode', async () => {
    let { query, element } = await createYoutubeVideo('m6UOo2YGbIE')
    element.activate()
    let iframeSrc = query('iframe').getAttribute('src')
    expect(iframeSrc).toBe(
      '//www.youtube-nocookie.com/embed/m6UOo2YGbIE?autoplay=1&start=0',
    )
  })

  it('[start-at]', async () => {
    let { element, query } = await createYoutubeVideo('XvDZLjaCJuw', {
      'start-at': '37',
    })
    element.activate()
    let iframeSrc = query('iframe').getAttribute('src')
    expect(iframeSrc).toBe(
      '//www.youtube-nocookie.com/embed/XvDZLjaCJuw?autoplay=1&start=37',
    )
  })
})
