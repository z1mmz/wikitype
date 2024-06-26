import React, { useEffect,useState } from 'react';
import useKeyPress from '../hooks/useKeyPress';
import { slugify } from '../utils/textCean';
import typeStyles from './typeSpace.module.css'
import { currentTime } from '../utils/time';


export default function TypeSpace(props) {

    const [leftPadding, setLeftPadding] = useState(
        new Array(20).fill(' ').join(''),
      );
    const [wikiData,setWikiData] = useState()
    const [nextwikiData,setNextwikiData] = useState()
    const [nextWikitext,setNextWikitext] = useState('')
    const [remainingWords, setRemainingWords] = useState(0)
    const [wpm,setWpm] = useState(0)
    const [startTime, setStartTime] = useState()
    const [wordCount, setWordCount] = useState(0)
    const [loading,setLoading] = useState(false)
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState('');
    const [incomingChars, setIncomingChars] = useState('Loading wiki text.....');

    const fetchMore =  () =>{
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then((res) => res.json())
          .then((data) => {
            let cleanText = slugify(data.extract)
            setNextwikiData(data)
            setNextWikitext(cleanText)
            console.log(cleanText)
            return cleanText})
          
    }
    useEffect(() => {
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then((res) => res.json())
          .then((data) => {
            let cleanText = slugify(data.extract)
            setWikiData(data)
            setCurrentChar(cleanText.charAt(0))
            setIncomingChars(cleanText.substr(1))
            setRemainingWords(cleanText.split(' ').length)
          })
      }, [])
      
      useKeyPress(key => {
        // Create variables and init WPM
        let updatedOutgoingChars = outgoingChars;
        let updatedIncomingChars = incomingChars;
        if (!startTime) {
          setStartTime(currentTime());
        }
        // if the Key is correct
        if (key === currentChar) {
          // update WPM at end of word
          if (incomingChars.charAt(0) === ' ') {
            setWordCount(wordCount + 1);
            console.log(remainingWords)
            
            const durationInMinutes = (currentTime() - startTime) / 60000.0;
            let currentWpm = ((wordCount + 1) / durationInMinutes).toFixed(2)
            setWpm(currentWpm);
            props.setWpm(currentWpm)
            if(remainingWords != 0){
              setRemainingWords(remainingWords-1)
              if(remainingWords-1 == 0){
                setWikiData(nextwikiData)
                setRemainingWords(nextWikitext.split(' ').length)
                setNextWikitext('')
              }
            }
          }
          //remove initial padding untill filled with words
          if (leftPadding.length > 0) {
            setLeftPadding(leftPadding.substring(1));
          }
          //Update the list of correct chars
          updatedOutgoingChars += currentChar;
          setOutgoingChars(updatedOutgoingChars);
          
          //move cursor to next char
          setCurrentChar(incomingChars.charAt(0));
          
          //update new income chars
          updatedIncomingChars = incomingChars.substring(1);

          //If close to finishing current data fetch new data and appends to incoming
          if(nextWikitext != '' & loading == true){
            updatedIncomingChars +=' '+nextWikitext
            setLoading(false)
          }else if (nextWikitext == '' & updatedIncomingChars.split(' ').length < 10 & loading != true) {
            setLoading(true)
            fetchMore()
          } 
          setIncomingChars(updatedIncomingChars);
        }
      });
    
    return(
      <div>
        <span className={typeStyles.info}>WPM:{wpm}</span>{" "}
        <a href={wikiData ? wikiData.content_urls.desktop.page :""} 
          rel="noreferrer noopener" 
          target="_blank" className={typeStyles.link}>{wikiData ? wikiData.title :"" }</a>
      <p className={typeStyles.Character}>
          <span className={typeStyles.CharacterOut}>
          {(leftPadding + outgoingChars).slice(-20)}
          </span>
          <span className={typeStyles.CharacterCurrent}>{currentChar}</span>
          <span>{incomingChars.substr(0, 20)}</span>
      </p>
    </div>
    )
    }