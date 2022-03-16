
import React, { useEffect,useState } from 'react';
import useKeyPress from '../hooks/useKeyPress';
import typeStyles from './typeSpace.module.css'
import unidecode from 'unidecode';

function slugify(text) {
  return unidecode(text)
}


export default function TypeSpace({data}) {

    const [leftPadding, setLeftPadding] = useState(
        new Array(20).fill(' ').join(''),
      );
    const [wikitext,setWikitext] = useState(data)
    const [nextWikitext,setNextWikitest] = useState('')
    const [loading,setLoading] = useState(false)
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState('');
    const [incomingChars, setIncomingChars] = useState('Loading wiki text.....');
    const fetchMore =  () =>{
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then((res) => res.json())
          .then((data) => {setNextWikitest(data.extract)
                            console.log(data.extract)})
          
    }
    
    useEffect(() => {
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then((res) => res.json())
          .then((data) => {
            let cleanText = slugify(data.extract)
            console.log(cleanText)
            setWikitext(cleanText)
            setCurrentChar(cleanText.charAt(0))
            setIncomingChars(cleanText.substr(1))
          })
      }, [])
      
      useKeyPress(key => {
        //1
        let updatedOutgoingChars = outgoingChars;
        let updatedIncomingChars = incomingChars;
        
        //2
        if (key === currentChar) {
          //3
          if (leftPadding.length > 0) {
            setLeftPadding(leftPadding.substring(1));
          }
          //4
          updatedOutgoingChars += currentChar;
          setOutgoingChars(updatedOutgoingChars);
          
          //5      
          setCurrentChar(incomingChars.charAt(0));
          
          //6
          updatedIncomingChars = incomingChars.substring(1);

          if(nextWikitext != '' & loading == true){
            updatedIncomingChars +=' '+nextWikitext
            setNextWikitest('')
            setLoading(false)
          }else if (nextWikitext == '' & updatedIncomingChars.split(' ').length < 10 & loading != true) {
            setLoading(true)
            fetchMore()
          } 
          setIncomingChars(updatedIncomingChars);
        
        }
      });
    
    return(
    <p className={typeStyles.Character}>
        <span className={typeStyles.CharacterOut}>
        {(leftPadding + outgoingChars).slice(-20)}
        </span>
        <span className={typeStyles.CharacterCurrent}>{currentChar}</span>
        <span>{incomingChars.substr(0, 20)}</span>
    </p>
    )
    }