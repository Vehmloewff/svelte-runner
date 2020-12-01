import e = require('express')
import { describe } from 'zip-tap'
import { pathIsPattern } from './path-is-pattern'

describe('path-is-pattern', it => {
	it(`should validate simple paths`, expect => {
		expect(pathIsPattern('/hello/there', '/hello/there')).toBe(true)
	})

	it(`should validate wild paths`, expect => {
		expect(pathIsPattern('/hello/*', '/hello/there')).toBe(true)
	})

	it(`should validate wild paths with wild wildcard positions`, expect => {
		expect(pathIsPattern('/*/there', '/hello/there')).toBe(true)
	})

	it(`should not treat wilds as greedy wilds`, expect => {
		expect(pathIsPattern('/*', '/hello/there')).toBe(false)
	})

	it(`should validate greedy wilds`, expect => {
		expect(pathIsPattern('/hello/**', '/hello/there/how/are/you')).toBe(true)
	})

	it(`should validate greedy wilds in wild locations`, expect => {
		expect(pathIsPattern('/**/you', '/hello/there/how/are/you')).toBe(true)
	})

	it(`should not validate invalid greedy wilds`, expect => {
		expect(pathIsPattern('/**/are', '/hello/there/how/are/you')).toBe(false)
	})

	it(`should validate greedy wilds that represent nothing`, expect => {
		expect(pathIsPattern('/**', '/')).toBe(true)
	})

	it(`should validate greedy wilds in wild locations that represent nothing`, expect => {
		expect(pathIsPattern('/**/hello', '/hello')).toBe(true)
	})

	it(`should not validate invalid greedy wilds in wild locations`, expect => {
		expect(pathIsPattern('/**/hello', '/are')).toBe(false)
	})

	it(`should let simple wilds only cover part of a section`, expect => {
		expect(pathIsPattern('/*.js', '/core.js')).toBe(true)
	})

	it(`should let simple wilds (in wild locations) only cover part of a section`, expect => {
		expect(pathIsPattern('/hee-*-hoo*haa*.*.js', '/hee--hoo-haa.test.js')).toBe(true)
	})
})
