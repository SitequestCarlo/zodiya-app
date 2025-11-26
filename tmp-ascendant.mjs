import julian from 'astronomia/julian'
import nutation from 'astronomia/nutation'
import sidereal from 'astronomia/sidereal'
import base from 'astronomia/base'

const DEG2RAD = Math.PI / 180
const RAD2DEG = 180 / Math.PI

function toJulianDate(date) {
  const cal = new julian.Calendar(date)
  return cal.toJD()
}

function eclipticToEquatorial(lambda, epsilon) {
  const ra = Math.atan2(Math.sin(lambda) * Math.cos(epsilon), Math.cos(lambda))
  const dec = Math.asin(Math.sin(epsilon) * Math.sin(lambda))
  return { ra: (ra + 2 * Math.PI) % (2 * Math.PI), dec }
}

function altitudeForLambda(lambda, lstRad, latRad, epsilon) {
  const { ra, dec } = eclipticToEquatorial(lambda, epsilon)
  let H = lstRad - ra
  H = Math.atan2(Math.sin(H), Math.cos(H)) // normalize to -pi..pi
  const sinAlt = Math.sin(latRad) * Math.sin(dec) + Math.cos(latRad) * Math.cos(dec) * Math.cos(H)
  const alt = Math.asin(Math.min(1, Math.max(-1, sinAlt)))
  return { alt, H }
}

function normalizeAngle(rad) {
  const twoPi = 2 * Math.PI
  return ((rad % twoPi) + twoPi) % twoPi
}

function bruteForceAsc(lstRad, latRad, epsilon) {
  let bestLambda = 0
  let bestAlt = Infinity
  const step = 0.5 * DEG2RAD
  for (let rad = lstRad - Math.PI; rad < lstRad + Math.PI; rad += step) {
    const lambda = normalizeAngle(rad)
    const { alt, H } = altitudeForLambda(lambda, lstRad, latRad, epsilon)
    const absAlt = Math.abs(alt)
    if (absAlt < bestAlt && Math.sin(H) < 0) {
      bestAlt = absAlt
      bestLambda = lambda
    }
  }
  return bestLambda
}

function refinedAsc(lstRad, latRad, epsilon) {
  const coarse = bruteForceAsc(lstRad, latRad, epsilon)
  let current = coarse
  let delta = 5 * DEG2RAD
  let bestAlt = Math.abs(altitudeForLambda(current, lstRad, latRad, epsilon).alt)
  for (let i = 0; i < 12; i++) {
    delta /= 2
    const candidates = [normalizeAngle(current + delta), normalizeAngle(current - delta)]
    for (const cand of candidates) {
      const { alt, H } = altitudeForLambda(cand, lstRad, latRad, epsilon)
      if (Math.sin(H) >= 0) continue
      const absAlt = Math.abs(alt)
      if (absAlt < bestAlt) {
        bestAlt = absAlt
        current = cand
      }
    }
  }
  return current
}

function analyticAsc1(lstRad, latRad, epsilon) {
  const numerator = Math.sin(lstRad) * Math.cos(epsilon) + Math.tan(latRad) * Math.sin(epsilon)
  const denominator = Math.cos(lstRad)
  let lambda = Math.atan2(numerator, denominator)
  if (lambda < 0) lambda += 2 * Math.PI
  return lambda
}

function analyticAsc2(lstRad, latRad, epsilon) {
  const numerator = -Math.cos(lstRad)
  const denominator = Math.sin(lstRad) * Math.cos(epsilon) - Math.tan(latRad) * Math.sin(epsilon)
  let lambda = Math.atan2(numerator, denominator)
  if (lambda < 0) lambda += Math.PI
  if (lambda < 0) lambda += 2 * Math.PI
  return lambda
}

const date = new Date('2024-01-01T15:30:00Z')
const latitude = 52.52
const longitude = 13.405 // east positive
const jd = toJulianDate(date)
const epsilon = nutation.meanObliquity(jd)
const gstSeconds = sidereal.apparent(jd)
const lstRad = gstSeconds / 86400 * 2 * Math.PI + longitude * DEG2RAD
const latRad = latitude * DEG2RAD

const brute = bruteForceAsc(lstRad, latRad, epsilon)
const refined = refinedAsc(lstRad, latRad, epsilon)
const analytic1 = analyticAsc1(lstRad, latRad, epsilon)
const analytic2 = analyticAsc2(lstRad, latRad, epsilon)

console.log('brute', brute * RAD2DEG)
console.log('refined', refined * RAD2DEG)
console.log('analytic1', analytic1 * RAD2DEG)
console.log('analytic2', analytic2 * RAD2DEG)
