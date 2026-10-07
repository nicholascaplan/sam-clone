// Shared by Studio validation and the static build. Never accept arbitrary embed hosts.
export function parseMediaUrl(provider, value) {
  let url
  try { url = new URL(value) } catch { throw new Error('Enter a complete HTTPS provider URL.') }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) {
    throw new Error('Use an HTTPS provider URL without credentials or a custom port.')
  }
  const host = url.hostname
  if (provider === 'spotify' && host === 'open.spotify.com') {
    const match = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]{22})\/?$/)
    if (match) return {id: match[1], url: `https://open.spotify.com/track/${match[1]}`}
  }
  if (provider === 'youtube') {
    let id
    if (host === 'youtu.be') id = url.pathname.slice(1)
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
      id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)$/)?.[1]
    }
    if (/^[\w-]{11}$/.test(id || '')) return {id, url: `https://www.youtube.com/watch?v=${id}`}
  }
  if (provider === 'soundcloud') {
    if (url.searchParams.has('secret_token')) {
      throw new Error('Use a public SoundCloud track URL without private access tokens.')
    }
    if (host === 'api.soundcloud.com' && /^\/tracks\/[0-9]+\/?$/.test(url.pathname)) {
      return {url: `https://api.soundcloud.com${url.pathname.replace(/\/$/, '')}`}
    }
    if (['soundcloud.com', 'www.soundcloud.com'].includes(host) && /^\/[\w-]+\/[\w-]+\/?$/.test(url.pathname) && !url.pathname.includes('/sets/')) {
      return {url: `https://soundcloud.com${url.pathname.replace(/\/$/, '')}`}
    }
  }
  throw new Error(`Use a ${provider} ${provider === 'youtube' ? 'video' : 'track'} URL (not an artist, album, playlist or shortened sharing link).`)
}
