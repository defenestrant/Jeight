
import * as R from "ramda"

// char -> bool
const isCharLowerCase = char => R.toLower(char) == char

// char -> bool
const isCharUpperCase = R.complement(isCharLowerCase)

// char -> char
const toggleCharCase =
    ( R.ifElse )
    ( isCharUpperCase )
    ( R.toLower )
    ( R.toUpper )

// index -> str -> str
const indexToUpper =
    ( R.pipe )
    ( R.adjust(R.__, R.toUpper, R.__)
    , R.reduce(R.concat, "")
    )

// str -> index
const lastIndex =
    R.pipe(R.length, R.add(-1))

// str -> str
const lastIndexToUpper = str => indexToUpper(lastIndex(str), str)

const reduceWithIndex = R.addIndex(R.reduce)
const mapWithIndex = R.addIndex(R.map)

// str -> [ index ]
const uppercasePositions =
    ( reduceWithIndex )
    ( (acc, curr, index) => isCharUpperCase(curr) ? R.append(index, acc) : acc )
    ( [] )

// cases -> [ index ]
const uppercasePositionsInCases =
    ( reduceWithIndex )
    ( (acc, curr, index) => R.equals("u")(curr) ? R.append(index, acc) : acc )
    ( [] )

// str -> [ index ] -> str
const upCasesByPositions = R.reduce(R.flip(indexToUpper))

// // strWithoutUppercases -> strWithUppercases -> str
// const alignCasing = str =>
//     ( R.pipe )
//     ( uppercasePositions
//     , upCasesByPositions(str)
//     )

// cases -> str -> strWithCases
export const alignCases = cases => str => upCasesByPositions(str)(uppercasePositionsInCases(cases))

// phraseWithoutUpperCases -> casing -> casedPhrase
export const alignPhraseCasing = phrase =>
    ( mapWithIndex )
    ( (val, i) =>
        ( alignCases )
        ( val )
        ( R.nth(i)(phrase) )
    )

// phrase -> str
export const phraseToStr = R.reduce(R.concat, "")

// cursorPosition -> phrase -> [phrase, word, phrase]
export const cutPhrase = cursorPosition => phrase => [
    R.slice(0, cursorPosition, phrase),
    ( R.defaultTo )
    ( "" )
    ( R.nth(cursorPosition)(phrase) )
    ,
    R.slice(cursorPosition + 1, Infinity, phrase)
]


// cursorPosition -> phrase -> phrase
export const backSpaceInPhrase = cursorPosition => phrase => {

    console.log("PPPHHHHRRRRAAASSSEEE", phrase)

    if(phrase == null || phrase == "")
        return phrase

    const word = R.nth(cursorPosition)(phrase)

    if(word == null)
        return phrase

    if(word.length == 1)
        return R.remove(cursorPosition, 1, phrase)

    return phrase.map((v, i) => i == cursorPosition ? R.dropLast(1, v) : v)
}

// cursorPosition -> phrase -> phrase
export const backSpaceWordInPhrase = cursorPosition => ({ phrase, casing }) => {

    if(phrase == null || phrase.length == 0)
        return { newPhrase: phrase, newCasing: casing }

    const word = R.nth(cursorPosition)(phrase)

    if(word == null)
        return { newPhrase: phrase, newCasing: casing }

    let newPhrase = phrase
    let newCasing = casing

    if(word == " ")
    {
        newPhrase = R.remove(cursorPosition, 1, newPhrase)
        newCasing = R.remove(cursorPosition, 1, newCasing)

        if(phrase.length > 0)
        {
            newPhrase = R.remove(cursorPosition - 1, 1, newPhrase)
            newCasing = R.remove(cursorPosition - 1, 1, newCasing)
        }
            
    }
    else
    {
        newPhrase = R.remove(cursorPosition, 1, newPhrase)
        newCasing = R.remove(cursorPosition, 1, newCasing)
    }

    return {
        newPhrase,
        newCasing
    }
}


// cursorPosition -> word -> phrase -> phrase
export const changeWordAtCursor = cursorPosition => word =>
    ( R.ifElse )
    ( R.pipe(R.length, R.gte(cursorPosition) ))
    ( R.append(word) )
    ( R.update(cursorPosition)(word) )