import {words} from "lodash-es";

export const ucFirst = (str: string) => {
    let fullString = "";
    const wordByWord = words(str)
    wordByWord.forEach(word => {
        fullString += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " "
    })
    return fullString
}