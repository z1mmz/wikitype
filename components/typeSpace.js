
import React, { useEffect,useState } from 'react';
import useKeyPress from '../hooks/useKeyPress';
import typeStyles from './typeSpace.module.css'





export default function TypeSpace({data}) {

    const [leftPadding, setLeftPadding] = useState(
        new Array(20).fill(' ').join(''),
      );
    const [wikitext,setWikitext] = useState(data)
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState('');
    const [incomingChars, setIncomingChars] = useState('Loading wiki text.....');

    useEffect(() => {
        fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
          .then((res) => res.json())
          .then((data) => {
            console.log(data.extract)
            setWikitext(data.extract)
            setCurrentChar(data.extract.charAt(0))
            setIncomingChars(data.extract.substr(1))
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
        //   if (updatedIncomingChars.split(' ').length < 10) {
        //     updatedIncomingChars +=' ' + useEffect();
        //   }
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