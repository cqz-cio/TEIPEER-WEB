export function randomId(cryptoImpl = globalThis.crypto) {
  const bytes = cryptoImpl.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128
  const hex = [...bytes].map(x => x.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function pageView(path, { preview = false, consent = false, id = randomId } = {}) {
  if (preview || !consent || typeof path !== 'string' || !/^\/(?:[a-z0-9-]+\/?)*$/.test(path) || path.includes('preview')) return null
  return { eventId: id(), eventType: 5, pagePath: path, deviceType: 9 }
}

export function createAnalyticsClient({ fetchImpl = globalThis.fetch, timeoutMs = 8000 } = {}) {
  async function request(path, body, headers = {}) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetchImpl('/cms-api/statistics/' + path, {
        method: body ? 'POST' : 'GET', credentials: 'omit', cache: 'no-store', signal: controller.signal,
        referrerPolicy: 'no-referrer', headers: { ...headers, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!response.ok) throw new Error('Statistics request failed')
      const result = await response.json()
      if (result.code !== 0) throw new Error('Statistics request failed')
      return result.data
    } finally { clearTimeout(timer) }
  }
  return {
    config: () => request('website-traffic/config'),
    consent: policyVersion => request('consent/evidence', { consentId: randomId(), policyVersion, analytics: true, preferences: false, marketing: false }),
    withdraw: evidence => request('consent/withdraw', {}, { 'x-analytics-consent-evidence': evidence }),
    track: (event, identity) => request('website-traffic/track', event, {
      'x-analytics-consent-evidence': identity.evidence, 'x-analytics-visitor-id': identity.visitor, 'x-analytics-session-id': identity.session,
    }),
  }
}
