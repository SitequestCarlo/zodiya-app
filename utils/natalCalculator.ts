import base from 'astronomia/base'
import julian from 'astronomia/julian'
import moonposition from 'astronomia/moonposition'
import nutation from 'astronomia/nutation'
import sidereal from 'astronomia/sidereal'
import solar from 'astronomia/solar'

export interface NatalPositions {
  sunSign: string
  moonSign: string
  ascendant: string
  sunLongitude: number
  moonLongitude: number
  ascendantLongitude: number
}

const DEG2RAD = Math.PI / 180
const RAD2DEG = 180 / Math.PI
const TWO_PI = Math.PI * 2
const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

function normalizeAngle(rad: number): number {
  return ((rad % TWO_PI) + TWO_PI) % TWO_PI
}

function degreesToSign(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return ZODIAC_SIGNS[index] ?? ZODIAC_SIGNS[0]
}

function eclipticToEquatorial(lambda: number, epsilon: number) {
  const ra = Math.atan2(Math.sin(lambda) * Math.cos(epsilon), Math.cos(lambda))
  const dec = Math.asin(Math.sin(epsilon) * Math.sin(lambda))
  return { ra: normalizeAngle(ra), dec }
}

function altitudeForLambda(lambda: number, lstRad: number, latRad: number, epsilon: number) {
  const { ra, dec } = eclipticToEquatorial(lambda, epsilon)
  let H = lstRad - ra
  H = Math.atan2(Math.sin(H), Math.cos(H))
  const sinAlt = Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(H)
  const alt = Math.asin(Math.min(1, Math.max(-1, sinAlt)))
  return { alt, sinH: Math.sin(H) }
}

function computeAscendant(lstRad: number, latRad: number, epsilon: number) {
  let bestLambda = 0
  let bestAlt = Number.POSITIVE_INFINITY
  const coarseStep = DEG2RAD
  for (let offset = -Math.PI; offset <= Math.PI; offset += coarseStep) {
    const candidate = normalizeAngle(lstRad + offset)
    const { alt, sinH } = altitudeForLambda(candidate, lstRad, latRad, epsilon)
    const absAlt = Math.abs(alt)
    if (sinH < 0 && absAlt < bestAlt) {
      bestAlt = absAlt
      bestLambda = candidate
    }
  }

  let current = bestLambda
  let delta = 5 * DEG2RAD
  for (let i = 0; i < 12; i++) {
    delta /= 2
    const nextCandidates = [normalizeAngle(current + delta), normalizeAngle(current - delta)]
    for (const candidate of nextCandidates) {
      const { alt, sinH } = altitudeForLambda(candidate, lstRad, latRad, epsilon)
      const absAlt = Math.abs(alt)
      if (sinH < 0 && absAlt < bestAlt) {
        bestAlt = absAlt
        current = candidate
      }
    }
  }

  return current
}

export function calculateNatalPositions(date: Date, latitude: number, longitude: number): NatalPositions {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Ungültige Koordinaten übergeben.')
  }

  const cal = new julian.Calendar(date)
  const jd = cal.toJD()
  const epsilon = nutation.meanObliquity(jd)
  const T = base.J2000Century(jd)
  const sunLongitude = normalizeAngle(solar.apparentLongitude(T))
  const moonLongitude = normalizeAngle(moonposition.position(jd).lon)
  const gstSeconds = sidereal.apparent(jd)
  const gstRad = (gstSeconds / 86400) * TWO_PI
  const lstRad = normalizeAngle(gstRad + longitude * DEG2RAD)
  const latRad = latitude * DEG2RAD
  const ascendantLongitude = computeAscendant(lstRad, latRad, epsilon)

  return {
    sunLongitude,
    moonLongitude,
    ascendantLongitude,
    sunSign: degreesToSign(sunLongitude * RAD2DEG),
    moonSign: degreesToSign(moonLongitude * RAD2DEG),
    ascendant: degreesToSign(ascendantLongitude * RAD2DEG),
  }
}
