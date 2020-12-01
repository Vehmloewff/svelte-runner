import { isTemplateExpression } from 'typescript'

export function pathIsPattern(pattern: string, path: string) {
	if (!pattern.startsWith('/')) throw new Error(`${pattern} is an improperly configured pattern.  All patterns must start with a slash.`)
	if (!path.startsWith('/')) throw new Error(`How on earth did you get a path that doesn't start with a slash?`)

	// Remove the first slash from the path/pattern, and split the rest up on the slashes
	const patternSegments = pattern.slice(1).split('/')
	const pathSegments = path.slice(1).split('/')

	let patternIndex = 0
	let lastWasGreedy = false
	let failed = false
	for (let pathSegment of pathSegments) {
		const patternSegment = patternSegments[patternIndex]

		if (!patternSegment) {
			if (!lastWasGreedy) failed = true
			break
		} else if (patternSegment === '**') {
			patternIndex++

			const nextPatternSegment = patternSegments[patternIndex]
			if (nextPatternSegment && isEqual(nextPatternSegment, pathSegment)) patternIndex++
			else lastWasGreedy = true

			continue
		} else {
			if (isEqual(patternSegment, pathSegment)) {
				lastWasGreedy = false
				patternIndex++
				continue
			} else if (lastWasGreedy) {
				continue
			} else {
				failed = true
				break
			}
		}
	}

	if (!failed && patternIndex < patternSegments.length) failed = true

	return !failed
}

function isEqual(patternSegment: string, pathSegment: string): boolean {
	if (patternSegment === '*') return true

	if (patternSegment.indexOf('*') !== -1) {
		const parts = patternSegment.split('*')

		let playPath = pathSegment
		let failed = false
		for (let i in parts) {
			const index = Number(i)
			const part = parts[index]
			const firstOne = index === 0
			const lastOne = index === parts.length - 1

			const matchIndex = playPath.indexOf(part)

			if (matchIndex === -1) {
				failed = true
				break
			}

			if (firstOne && matchIndex !== 0) {
				failed = true
				break
			}

			if (lastOne && matchIndex + part.length !== playPath.length) {
				// the last item is not at the end
				failed = true
				break
			}

			playPath = playPath.slice(matchIndex + part.length)
		}

		if (failed) return false
		return true
	}

	return patternSegment === pathSegment
}
