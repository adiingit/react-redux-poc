/**
 * Get the bounding box of a skewed rectangle using its height and width with the angle of rotation.
 * @private
 */
export function getBoundingBoxDimensions (crossAxis, mainAxis, angle) {
  const absSin = Math.abs(Math.sin(angle * Math.PI / 180))
  const absCos = Math.abs(Math.cos(angle * Math.PI / 180))

  return {
    crossAxis: (absSin * mainAxis) + (absCos * crossAxis),
    mainAxis: (absSin * crossAxis) + (absCos * mainAxis)
  }
}

export function getPointOnCircle(radius,centerX,centerY,angle){
	return{
		x:centerX + radius * Math.cos(angle * Math.PI / 180),
		y:centerY + radius * Math.sin(angle * Math.PI / 180)
	}
}
