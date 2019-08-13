import * as R from "ramda"
import { curryAndFlip } from "./utils"

const flipSign = num => num - num - num
export const percentageToRadians = percentage => percentage * 2 * Math.PI
export const radiansToPercentage = radians => radians / (2 * Math.PI)
export const radiansToDegrees = radians => radians * (180 / Math.PI)
export const percentageToDegrees = R.pipe(percentageToRadians, radiansToDegrees)

const distanceBetweenTwoPoints = ( [x1, y1] ) => ( [x2, y2] ) => Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
)

export const distanceFromOrigin = distanceBetweenTwoPoints([0,0])

console.log(distanceFromOrigin([-0.8, 0.1]))

// [x, y] -> rad
export const thetaInRad = point =>
{
    const [ x, y ] = point

    if(y < 0)
		return 2 * Math.PI + Math.atan2(y, x)

	return Math.atan2(y, x)
}

export const thetaInDegrees = R.pipe(thetaInRad, radiansToDegrees)

// [x, y] -> percentage
export const thetaInPercentage =
	( R.compose )
	( radiansToPercentage
	, thetaInRad )

// (radius, angleInRadians) -> [x,y]
export const pointOnCircle = (r, a, cx = 0, cy = 0) =>
{
	const x = cx + r * Math.cos(a)
	const y = cy + r * Math.sin(a)
	return [x, y]
}


// [a1, a2, a3, a4, a5]
// numberOfPieces -> [angle]
export const cutCircle = (amountOfPieces, pieUp) =>
{
	const delta = 1 / amountOfPieces
	const initialOffset = 0.25
	const additionalOffset = pieUp ? (delta / 2) : 0

	let arr = []
	for(let i = 0; i < amountOfPieces; i++)
	{
		let angle = i * delta - initialOffset - additionalOffset
		if(angle < 0)
			angle = 1 + angle

		arr.push(
			angle
		)
	}

	return arr
}


// [angles] -> [[angles]]
const pairAngles = angles =>
{
	let anglePairs = []
	for(let i = 0; i < angles.length; i++)
	{
		if(i == angles.length - 1) //last element
		{
			anglePairs.push({
				beginAngle: angles[i],
				endAngle: angles[0]
			})
		}
		else
		{
			anglePairs.push({
				beginAngle: angles[i],
				endAngle: angles[i + 1]
			})
		}
	}
	return anglePairs
}


// [[angles]] -> angle -> directionString
export const findDirection = point => angles =>
{
	const [x, y] = point
	const angle = thetaInPercentage(point)
	const anglePairs = pairAngles(angles)

	if(x == 0 && y == 0)
		return -1

	return anglePairs.findIndex(d =>
	{
		if(d.beginAngle > d.endAngle)
			return ( angle > d.beginAngle && angle <= 1 ) || ( angle < d.endAngle && angle >= 0 )

		return angle > d.beginAngle && angle < d.endAngle
	})
}



console.log(distanceFromOrigin([6,8]))