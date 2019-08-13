//import R from "ramda"

import { alphabet } from "../config"

import * as R from "ramda"
import memoize from "memoize-one"

const trace = R.tap(console.log)


// ------------------------------------------ BEGIN ToJoyDirStr ------------------------------------------
const map = {
    "L0" : alphabet[0],
    "L1" : alphabet[1],
    "L2" : alphabet[2],
    "L3" : alphabet[3],
    "R0" : alphabet[4],
    "R1" : alphabet[5],
    "R2" : alphabet[6],
    "R3" : alphabet[7]
}


// length -> [wordsPairs] -> [wordsPairs]
const filterOtherLengthWords = length =>
    ( R.filter )
    ( ( R.compose )
      ( R.equals(length)
      , R.length
      , R.nth(0) )
    )

// wordPair -> length
const wordLength =
    ( R.compose )
    ( R.length
    , R.nth(0) )

// wordPairs -> wordPairs
const sortByPopularity =
    ( R.sort )
    ( ( R.descend )
      ( R.nth(1) )
    )

const nilThenEmptyStrElseIdentity =
    ( R.ifElse )
    ( R.isNil )
    ( R.always("") )
    ( R.identity )

const getSafe0thStr =
    ( R.compose )
    ( R.nth(0)
    , nilThenEmptyStrElseIdentity )

const convertCharToJoyDir = map => char =>
    ( R.compose )
    ( getSafe0thStr
    , ( R.find )
      ( ( R.compose )
        ( R.includes(char)
        , R.nth(1) )
      )
    , R.toPairs
    )
    ( map )


// str -> [arr]
export const convertStrToArr = R.split("")

// [arr] -> str
export const convertArrToStr =
    ( R.reduce )
    ( R.concat )
    ( "" )

// map -> word -> joyDirStr
const convertWordtoJoyDirStr = map =>
    ( R.compose )
    ( convertArrToStr
    , R.map(convertCharToJoyDir(map))
    , convertStrToArr
    , R.toLower
    )

const wordToJoyDirStr = convertWordtoJoyDirStr(map)

// word -> joyDirStr
const safeWordToJoyDirStr =
    ( R.ifElse )
    ( R.isNil )
    ( R.always("") )
    ( wordToJoyDirStr )

export default safeWordToJoyDirStr

// ------------------------------------------ END ToJoyDirStr ------------------------------------------





// ------------------------------------------ BEGIN GetWordsByJoyDirStr ------------------------------------------

// hasStringLength : length -> string -> bool
const hasStringLength = length =>
    ( R.pipe )
    ( R.length
    , R.equals(length) )

// [[key, value]] -> number
const getLengthOfFirstKey =
    ( R.pipe )
    ( R.head
    , R.nth(0)
    , R.length
    )

// length -> [key, value] -> bool
const hasKeyLength = length =>
    ( R.pipe )
    ( R.nth(0)
    , hasStringLength(length) )

// arr -> [key, value] -> bool
const isKeyLengthSameAsFirstKey =
    ( R.pipe )
    ( getLengthOfFirstKey
    , hasKeyLength )

// filterAllWithKeyLengthSameAsFirst : [[key, value]] -> [[key, value]]
const filterWithKeyLengthSameAsFirst = arr =>
    ( R.filter )
    ( isKeyLengthSameAsFirstKey(arr) )
    ( arr )


// docMap -> [word]
const docMapToWordsSortedByPopularity =
    ( R.pipe )
    ( R.toPairs
    , ( R.sort )
        ( ( R.descend )
          ( ( R.pipe )
            ( R.nth(1)
            , R.prop("count")
            )
          )
        )
    , R.map(R.nth(0) )
    )

const onKeyFromPair = fn =>
    ( R.pipe )
    ( R.nth(0)
    , fn )

const onValFromPair = fn =>
    ( R.pipe )
    ( R.nth(1)
    , fn )

// z -> [x, y] -> [y, z]
const shift = val =>
    ( R.compose )
    ( R.slice(1, Infinity)
    , R.append(val)
    )



const startsWith = strBegin => str => str.startsWith(strBegin)

// keyBegin -> obj -> boolean
const isKeyBeginPresent = keyBegin =>
    ( R.pipe )
    ( R.keys
    , ( R.filter )
      ( startsWith(keyBegin) )
    , R.length
    , R.lt(0)
    )

// keyBegin -> obj -> [keysThatBeginGood]
const getFilteredKeysByKeyBegin = keyBegin =>
    ( R.pipe )
    ( R.keys )
    ( ( R.filter )
      ( startsWith(keyBegin) )
    )

    

// takeFirstSimilarDoc : joyDirStr -> baseDocmap -> [word]
const takeMostSimilarWordsFromBaseDocmap = joyDirStr =>
    ( R.pipe )
    ( R.toPairs
    , ( R.filter )
      ( ( onKeyFromPair )
        ( startsWith(joyDirStr) )
      )
    , R.map(R.nth(1))
    , R.chain(R.identity)
    , R.map(R.prop("w"))
    , R.map(str => str.substring(0, joyDirStr.length / 2))
    , R.uniq
    )

window.uniq = R.uniq

// takeFirstSimilarDoc : joyDirStr -> [baseDocmap] -> [word]
const takeMostSimilarWords = joyDirStr =>
    ( memoize )
    ( ( R.pipe )
      ( ( R.chain )
        ( takeMostSimilarWordsFromBaseDocmap(joyDirStr) )
      , R.uniq
      )
    )

window.takeMostSimilarWords = takeMostSimilarWords

//     ( R.pipe )
//     ( R.toPairs // key : joyDirStr, val : word
//   , ( R.filter )
//   ( onKeyFromPair(key => key.startsWith(joyDirStr)) ) // get all those that start with the same joyDirStr
//   , ( R.sortBy )
//   ( onKeyFromPair(R.length) ) // sort words with shortest first

//   //, filterWithKeyLengthSameAsFirst
//   , R.chain(R.nth(1))
//   , R.reduce(R.mergeLeft, {})
//   , docMapToWordsSortedByPopularity
//   , R.map(R.slice(0, joyDirStr.length / 2))
//   , R.uniq
//   )




// (joyDirArr, joyDirStrMap) -> [word]
//const getWordsByJoyDirArr = memoize((joyDirStr, joyDirStrMap) => getWordsByJoyDirStr(convertArrToStr(joyDirStr), joyDirStrMap))



// joyDirStr -> [baseDocmaps] -> boolean
const joyDirStrExists = joyDirStr =>
    ( R.any )
    ( R.has(joyDirStr) )

// joyDirStr -> [baseDocmaps] -> [word]
export const wordsForJoyDirStr = joyDirStr =>
    ( R.pipe )
    ( ( R.chain )
      ( R.prop(joyDirStr) )
    , R.filter(R.complement(R.isNil))
    , R.map(R.prop("w"))
    , R.uniq
    )

window.wordsForJoyDirStr = wordsForJoyDirStr
window.joyDirStrExists = joyDirStrExists

//joyDirStr -> [baseDocmap] -> [word]
export const getWordsByJoyDirStr =
    ( R.curry )
    (( joyDirStr, baseDocmaps ) =>
    {
        if(R.isNil(joyDirStr) || R.isEmpty(joyDirStr))
            return []

        if(joyDirStrExists(joyDirStr)(baseDocmaps))
        {
            return wordsForJoyDirStr(joyDirStr)(baseDocmaps)
        }
        
        const mostSimilarWords = takeMostSimilarWords(joyDirStr)(baseDocmaps)
        //console.log("Most similar words: ", mostSimilarWords)
        return mostSimilarWords
    })

// ------------------------------------------ END GetWordsByJoyDirStr ------------------------------------------


export const punctuations = [".", ",", "?", "!", ":", "'"]

// char -> bool
export const isCharPunctuation = char =>
    ( R.any )
    ( R.equals(char) )
    ( punctuations )



const stringIsOneChar = R.pipe(R.length, R.equals(1))

// baseDocmaps -> word -> [ word ]
export const getOtherWordsOrChars = baseDocmaps => R.cond([
    [ R.both(stringIsOneChar, isCharPunctuation), R.always(punctuations) ],
    [ R.isNil, R.always([]) ],
    [ R.T, R.pipe(wordToJoyDirStr, getWordsByJoyDirStr(R.__, baseDocmaps)) ]
])

// word -> [basedocmap] -> basedoc
export const getFollowedByWord = word => basedocmaps =>
{
    const joyDirStr = wordToJoyDirStr(word)
    const followedBy = []
    for(let i = 0; i < basedocmaps.length; i++)
    {
        const basedocmap = basedocmaps[i]
        const basedocsForOneJoyDirStr = basedocmap[joyDirStr]
        if(basedocsForOneJoyDirStr != null)
        {
            const basedoc = basedocsForOneJoyDirStr.find(basedoc => basedoc.w == word)
            if(basedoc != null)
            {
                for(let j = 0; j < basedoc.fb.length; j++)
                {
                    followedBy.push(basedoc.fb[j])
                }
            }
        }
        
    }

    return R.uniq(followedBy)
}