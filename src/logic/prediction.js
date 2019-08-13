
import memoize from "memoize-one"
import * as R from "ramda"

import newJoyDirStr from "./t9"

const trace = x => x //R.tap(console.log)


// example of the target: "the docmap"
// has one example prop doc "hallo"
const docmap = {
    // doc
    "hallo": {
        count: 5,
        cases: { //wordMap
            "Hallo": 4,
            "hallo": 1
        },
        followedBy: {
            "ruben": 3
        },
        joyDirStr: "L0L1R3L0"
    }
}

const N = {
    reduce: reducer => initial => arr => arr.reduce(R.uncurryN(4, reducer), initial)
}

const M = {
    toLower: memoize(R.toLower)
}

const D = {
    // safeExec: fn -> val -> null | fn(val)
    safeExec: fn =>
                ( R.ifElse )
                ( R.equals(null) )
                ( () => null )
                ( fn )
}

const splitBySpace = R.split(" ")
const splitByComma = R.split(",")
const splitByPoint = R.split(".")
const splitByExclamationMark = R.split("!")
const splitByQuestionMark = R.split("?")
const splitByLeftBracket = R.split("(")
const splitByRightBracket = R.split(")")

const filterOutEmpty = R.filter(R.complement(R.isEmpty))

// char -> bool
const isCharSpecial = char =>
    ( R.any )
    ( R.equals(char) )
    ( ["/",">","<","|","(",")","{","}","[","]","&","#","%","@","-","_","=",":",";","+","-","*","=","%","€","$","£","°","^","\\","\'","\"",",","`","‘","—"] )

// string -> bool
const isFirstCharSpecial =
    ( R.pipe )
    ( R.nth(0)
    , isCharSpecial )

// string -> bool
const isLastCharSpecial =
    ( R.pipe )
    ( R.last
    , isCharSpecial )

// str -> str
const removeFirstChar =
    ( R.slice )
    ( 1 )
    ( Infinity )

// str -> str
const removeLastChar = R.dropLast(1)

// str -> str
const trimSpecialCharsLeft =
    ( R.when )
    ( isFirstCharSpecial )
    ( ( R.pipe )
      ( removeFirstChar
      , a => trimSpecialCharsLeft(a)
      )
    )

// str -> str
const trimSpecialCharsRight =
    ( R.when )
    ( isLastCharSpecial )
    ( ( R.pipe )
      ( removeLastChar
      , a => trimSpecialCharsRight(a)
      )
    )

// str -> str
const trimSpecialChars =
    ( R.pipe )
    ( trimSpecialCharsLeft
    , trimSpecialCharsRight
    )


const cleanSource =
    ( R.pipe )
    ( R.replace(/[/><|(){}\[\]&#%@\-_=:;+\-*=%€$£°^\—“"?!.]/g)(",") // replace all weird chars with a comma
    , R.replace(/[’`]/g)("'")                                       // replace all weird ’ with a standard '
    , R.split(/\r?\n/)                                              // createLineArr
    , R.chain(splitByComma)                                         // map over lines, split them by their commas and concatenate the results
    , R.map(R.trim)                                                 // trim the leftover phrases
    , filterOutEmpty                                                // remove the empty phrases
    , R.map(splitBySpace)                                           // split the sentences in words
    , R.map(R.map(R.trim))                                          // trim the words
    , R.map(R.map(trimSpecialChars))                                // trim the leftover special characters
    , R.map(filterOutEmpty)                                         // filter out the empty words
    //, trace
    )

// getCount : doc -> count
const getCount =
    ( R.ifElse )
    ( R.has("count") )
    ( R.prop("count") )
    ( R.always(0) )

// newCount : doc -> count
const newCount =
    ( R.compose )
    ( R.add(1)
    , getCount )

// newCountInDoc : doc -> doc
const newCountInDoc = doc =>
    ( R.set )
    ( R.lensProp("count") )
    ( newCount(doc) )
    ( doc )

// getCase : casedWord -> wordMap -> number
const getWordCount = word =>
    ( R.ifElse )
    ( R.has(word) )
    ( R.prop(word) )
    ( R.always(0) )

// newCase : casedWord -> cases -> number
const newCaseCount = word =>
    ( R.compose )
    ( R.add(1)
    , getWordCount(word) )

// getCases : doc -> wordMap
const getCases =
    ( R.ifElse )
    ( R.has("cases") )
    ( R.prop("cases") )
    ( R.always({}) )

// newCases : casedWord -> wordMap -> wordMap
const newCases = word => cases =>
    ( R.set )
    ( R.lensProp(word) )
    ( ( newCaseCount )
      ( word )
      ( cases ) )
    ( cases )

// newCasesInDoc = casedWord -> doc -> doc
const newCasesInDoc = word => doc =>
    ( R.set )
    ( R.lensProp("cases") )
    ( ( newCases )
      ( word )
      ( getCases(doc) ) )
    ( doc )

// getFollowedBy : doc -> followedBy
const getFollowedBy =
    ( R.ifElse )
    ( R.has("fb") )
    ( R.prop("fb") )
    ( R.always({}) )

// newFollowedByCount : nextword -> followedBy -> number
const newFollowedByCount = nextword =>
    ( R.compose )
    ( R.add(1)
    , getWordCount(nextword) )

// newFollowedBy : nextword -> followedBy -> followedBy
const newFollowedBy = nextword => followedBy => {

    if(nextword == null)
        return followedBy

    return ( R.set )
           ( R.lensProp(nextword) )
           ( newFollowedByCount(nextword)(followedBy) )
           ( followedBy )
}


// newFollowedByInDoc : nextword -> doc -> doc
const newFollowedByInDoc = nextword => doc =>
    ( R.set )
    ( R.lensProp("fb") )
    ( ( newFollowedBy )
      ( nextword )
      ( getFollowedBy(doc) )
    )
    ( doc )

//getJoyDirStr : doc -> doc
const getJoyDirStr =
    ( R.ifElse )
    ( R.has("joyDirStr") )
    ( R.prop("joyDirStr") )
    ( R.always("") )

//newJoyDirStrInDoc : word -> doc -> doc
const newJoyDirStrInDoc = word =>
    ( R.set )
    ( R.lensProp("joyDirStr") )
    ( newJoyDirStr(word) )

//getDoc : word -> docMap -> doc
const getDoc = word =>
    ( R.ifElse )
    ( R.has(R.toLower(word)) )
    ( R.prop(R.toLower(word)) )
    ( R.always({}) )

// newDoc : word -> nextword -> docMap -> doc
const newDoc = word => nextword =>
    ( R.compose )
    ( newCountInDoc
    , newJoyDirStrInDoc(word)
    , newCasesInDoc(word)
    , newFollowedByInDoc
      ( ( D.safeExec )
        ( R.toLower )
        ( nextword )
      )
    //, trace
    , getDoc(word) )

// newDocInDocMap : word -> nextword -> docMap -> docMap
const newDocInDocMap = word => nextword => docMap =>
    ( R.set )
    ( ( R.lensProp )
      ( R.toLower(word) )
    )
    ( newDoc(word)(nextword)(docMap) )
    ( docMap )


// analyzeLine : docMap -> wordArr -> docMap
const analyzeLine = docMap =>
    ( N.reduce )
    ( docMap => word => index => arr =>
        ( newDocInDocMap )
        ( word )
        ( index == arr.length - 1 ? null : arr[index + 1] )
        ( docMap )
    )
    ( docMap )

// analyzeLineArr : docMap -> lineArr -> docMap
const analyzeLineArr =
    ( N.reduce )
    ( analyzeLine )



// createDocMap : docMap -> input -> docMap
const newDocMap = docMap =>
    ( R.pipe )
    ( cleanSource
    , analyzeLineArr(docMap)
    )

export default newDocMap


// >>>>>>>>>>>>>>>>>>> basedocmap >>>>>>>>>>>>>>>>>><

// lens -> transformer -> obj -> newObj
const overObj = lens => transformer => obj =>
    ( R.set )
    ( lens )
    ( transformer(obj) )
    ( obj )

// limit -> obj -> arr
const objKeysToSortedArrByValues = limit =>
    ( R.pipe )
    ( R.toPairs
    , ( R.sort )
      ( ( R.descend )
        ( R.nth(1) )
      )
    , R.map(R.nth(0) )
    , R.take(limit)
    )

// sortingPropname -> keyToPropName -> obj -> arr
const objValuesToSortedArrByProp = sortingPropName => keyToPropName => limit => obj =>
    ( R.pipe )
    ( R.toPairs
    , ( R.sort ) // sort by prop value
      ( ( R.descend )
        ( ( R.pipe )
          ( R.nth(1)
          , R.prop(sortingPropName)
          )
        )
      )
    , R.take(limit)
    , ( R.map ) // insert key in obj with keyToPropName-arg as key and the original key as value
      ( ( overObj )
        ( R.lensPath([1, keyToPropName]) )
        ( R.nth(0) )
      )
    , R.map(R.nth(1)) // create list with only the created objects
    , R.map(R.dissoc(sortingPropName))  // remove prop that was used to filter
    )
    ( obj )

// doc -> baseDoc
const docToBasedoc =
    ( R.pipe )
    ( ( R.over )
      ( R.lensProp("fb") )
      ( objKeysToSortedArrByValues(7) )
    , ( R.dissoc("cases") )
    )


// joyDirStrMap : docMap -> joyDirStrMap
export const newJoyDirStrObjMap =
    ( R.pipe )
    ( ( R.toPairs )
    , ( R.groupBy )
      ( ( R.pipe )
        ( R.nth(1)
        , R.prop("joyDirStr")
        )
      )
    , ( R.map )
      ( ( R.map )
        ( R.dissocPath([1, "joyDirStr"]) )
      )
    , ( R.pickBy )
      ( (val, key) => key != "" )
    , ( R.map(R.fromPairs) )
    )


const joyDirStrObjToBaseJoyDirStrObj = objValuesToSortedArrByProp("count")("w")(15)


// docmap -> basedocmap
export const docmapToBasedocmap =
    ( R.pipe )
    ( R.map(docToBasedoc)
    , newJoyDirStrObjMap
    , R.map(joyDirStrObjToBaseJoyDirStrObj)
    )


// createBaseDocmap : input -> basedDocmap
export const newBaseDocmap = R.pipe(newDocMap({}), docmapToBasedocmap)

// <<<<<<<<<<<<<<<<<< BASEDOCMAP <<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>> PHRASING >>>>>>>>>>>>>>>>>

// isCharOnlyChar : number -> string -> bool
const hasStringLength = length =>
    ( R.compose )
    ( R.equals(length)
    , R.length )

const flippedConcat = R.flip(R.concat)


// isLastCharSpace : string -> bool
const isLastCharSpace =
    ( R.pipe )
    ( R.last
    , R.equals(" ")
    )

// newSentence : word -> existingSentence -> newSentence
export const newSentenceWithWord = word =>
    ( R.ifElse )
    ( ( R.either )
      ( isLastCharSpace )
      ( hasStringLength(0) )
    )
    ( R.concat(R.__, word) )
    ( ( R.pipe )
      ( R.concat(R.__, " ")
      , R.concat(R.__, word)
      )
    )

// phrase -> word -> phrase
const addSpaceAndWord = phrase => word =>
    ( R.append )
    ( word )
    ( ( R.append )
      ( " " )
      ( phrase )
    )


// phrase -> word -> phrase
export const newPhraseWithWord = phrase =>
    ( R.ifElse )
    ( (R.either )
      ( isLastCharSpace )
      ( hasStringLength(0) )
    )
    ( R.concat(phrase) )
    ( addSpaceAndWord(phrase) )

// <<<<<<<<<<<<<<<<< PHRASING <<<<<<<<<<<<<<<<<