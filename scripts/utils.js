/**
 * Shared runtime helpers used across modules.
 */
'use strict'

export function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
