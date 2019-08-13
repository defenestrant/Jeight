import * as R from "ramda"
import memoize from "memoize-one"
import { findDirection, cutCircle, distanceFromOrigin } from "./trigon"

// deadzone -> data -> data
const deadzoneBlackhole = memoize((deadzone, data) => {
    const distance = distanceFromOrigin(data)
    return distance > deadzone ? data : [0, 0]
})

// [ xProp, yProp ] -> deadzone -> data -> data
const deadzoneOnProps = props => deadzone => data =>
{
    const [ xProp, yProp ] = props
    const x = R.prop(xProp)(data)
    const y = R.prop(yProp)(data)
    const [ newX, newY ] = deadzoneBlackhole(deadzone, [x, y])

    let obj = R.set(R.lensProp(xProp), newX, data)
    obj = R.set(R.lensProp(yProp), newY, obj)

    return obj
}

// deadzone -> data -> data
const deadzoneOnLeftJoystick  = deadzoneOnProps(["leftAnalogX", "leftAnalogY"])
const deadzoneOnRightJoystick = deadzoneOnProps(["rightAnalogX", "rightAnalogY"])

// deadzone -> data -> data
const deadzoneOnData = deadzone => R.pipe(deadzoneOnLeftJoystick(deadzone), deadzoneOnRightJoystick(deadzone))

const gamepadAPIInputToUseableObj = input => ({
    leftAnalogX: round(input.axes[0]),
    leftAnalogY: round(input.axes[1]),
    rightAnalogX: round(input.axes[2]),
    rightAnalogY: round(input.axes[3]),
    r1: input.buttons[5].pressed,
    l1: input.buttons[4].pressed,
    r2: input.buttons[7].pressed,
    l2: input.buttons[6].pressed,
    square: input.buttons[2].pressed,
    cross: input.buttons[0].pressed,
    triangle: input.buttons[3].pressed,
    circle: input.buttons[1].pressed,
    dPadUp: input.buttons[12].pressed,
    dPadDown: input.buttons[13].pressed,
    dPadLeft: input.buttons[14].pressed,
    dPadRight: input.buttons[15].pressed
})

const round = float => Math.round(float * 100) / 100


// >>>>>>>>>>>>>>>>> CONSTANTLY GET CONTROLLER VALUES DURING WHOLE APP >>>>>>>>>>>>>>>>>>
let prevDatas = {}
let currData = null

const step = () =>
{
    const gamepad = navigator.getGamepads()[0]

    if(gamepad != null)
    {
        //console.log(gamepad)
        const data = gamepadAPIInputToUseableObj(gamepad)
        currData = deadzoneOnData(0.7)(data)
    }

    window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
// <<<<<<<<<<<<<<<<<<<<<< END CONSTANTLY GET CONTROLLER VALUES DURING WHOLE APP <<<<<<<<<<<<<<<<<<<<


export const subscribeToGamepadData = (key, fn) =>
{
    const cancelId = setInterval(() =>
    {
        fn({prev: prevDatas[key], curr: currData})
        prevDatas[key] = currData

    }, 25)

    return () => clearInterval(cancelId)
}



// buttonPropName -> state -> bool
export const isButtonDown = R.prop

// buttonPropName -> state -> bool
export const isButtonUp = R.complement(R.prop)

// propname -> object -> boolean
const propGt0 = R.pipe(R.prop, R.lt(0))
const propIs0 = R.pipe(R.prop, R.equals(0))

// buttonPropName -> prevState -> currState -> bool
export const didButtonGoDown =
    ( R.curry )
    ( ( buttonPropName, prevState, currState ) =>
        ( R.and )
        ( isButtonUp(buttonPropName)(prevState) )
        ( isButtonDown(buttonPropName)(currState) )
    )

// buttonPropName -> prevState -> currState -> bool
export const didButtonGoUp =
    ( R.curry )
    ( ( buttonPropName, prevState, currState ) =>
        ( R.and )
        ( isButtonDown(buttonPropName)(prevState) )
        ( isButtonUp(buttonPropName)(currState) )
    )

// trigger -> prevState -> currState -> bool
export const didTriggerGoUp = 
    ( R.curry )
    ( ( trigger, prevState, currState ) =>
        ( R.and )
        ( propGt0(trigger)(prevState) )
        ( propIs0(trigger)(currState) )
    )

// dirs -> string | null
export const analyzeDirections = dirs =>
{
    if(dirs.prevLeftDir != dirs.currLeftDir && dirs.prevLeftDir != -1)
        return `L${dirs.prevLeftDir}`

    if(dirs.prevRightDir != dirs.currRightDir && dirs.prevRightDir != -1)
        return `R${dirs.prevRightDir}`

    return null
}

const fourAngles = cutCircle(4, true)

// prevControllerData -> currControllerData -> dirs
export const findJoysticksDirections = prev => curr =>
{
    const prevLeftPoint = [prev.leftAnalogX, prev.leftAnalogY]
    const prevLeftDir = findDirection(prevLeftPoint)(fourAngles)
    const prevRightPoint = [prev.rightAnalogX, prev.rightAnalogY]
    const prevRightDir = findDirection(prevRightPoint)(fourAngles)

    const currLeftPoint = [curr.leftAnalogX, curr.leftAnalogY]
    const currLeftDir = findDirection(currLeftPoint)(fourAngles)
    const currRightPoint = [curr.rightAnalogX, curr.rightAnalogY]
    const currRightDir = findDirection(currRightPoint)(fourAngles)

    return {
        prevLeftDir,
        prevRightDir,
        currLeftDir,
        currRightDir
    }
}

