'use client';
import { useState } from 'react';
import MainUserTextbox from './MainUserTextbox';
import StageOneDisplay from './StageOneDisplay';
import StageTwoThreeDisplay from './StageTwoThreeDisplay';


export default function Body() {
  const [legislationList, setLegislationList] = useState([]);
  const [stageTwoCommenced, setStageTwoCommenced] = useState(false);

  const stageOneHandler = async (query) => {
    const retrievedLegislationList = await fetch(`/api/legislation/stageOne?query=${encodeURIComponent(query)}`); 
    setLegislationList(await retrievedLegislationList.json());
  }

  const stageTwoHandler = async (question, legislationList) => {
    const legislationKeyArray = legislationList.filter(item => item.applies).map(item => item.id);
    console.log("MainUserTextBoxComponent is sending keys for stage two:", legislationKeyArray);
    const stageTwoResults = await fetch(`/api/legislation/stageTwo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, legislationKeyArray }),
    });
    setStageTwoCommenced(true);
    return stageTwoResults.json();
  }

  const toggleApplies = (id) => {
    setLegislationList( previousList => {
      return previousList.map( legislation => {
        if (legislation.id === id) {
          return { ...legislation, applies: !legislation.applies };
        } else {
          return legislation;
        }
      })
    })
  }

  const addStageTwoResponseForLegislation = (id, response) => {
    setLegislationList(previousList => {
      return previousList.map(legislation => {
        if (legislation.id === id) {
          return { ...legislation, stageTwoResponse: response };
        } else {
          return legislation;
        }
      })
    })
  }

  return (
    <main className={`flex transition-all duration-500 ${stageTwoCommenced ? 'flex-row' : 'flex-col'}`}>
      <section className={`${stageTwoCommenced ? 'w-2/5' : ''}`}>
        <div 
          className={legislationList.length > 0 ? 
          "flex flex-col items-center justify-center min-h-40 bg-black-50 p-8 pb-10" : 
          "flex flex-col items-center justify-center min-h-120 bg-black-50 p-8 pb-10"}
        >
          <h1 className="text-2xl font-bold">What is your question around NSW building law?</h1>
          <MainUserTextbox 
            submitStageOneFunction={stageOneHandler} 
            submitStageTwoFunction={stageTwoHandler} 
            addStageTwoResponseForLegislation={addStageTwoResponseForLegislation}
            legislationList={legislationList} 
            stageTwoCommenced={stageTwoCommenced}
          />
        </div>
        <div className={`flex flex-col items-center justify-center p-8 pb-10 transition-all duration-500 ${legislationList.length > 0 ? 'mt-4' : 'hidden'}`}>
          <StageOneDisplay 
            stageTwoCommenced={stageTwoCommenced}
            legislationList={legislationList} 
            onToggle={toggleApplies} 
          />
        </div>
      </section>
      {stageTwoCommenced && (
        <section className="flex flex-col p-8 w-3/5 border-l border-gray-300">
          <StageTwoThreeDisplay legislationList={legislationList} />
        </section>
      )}
    </main>
  );
}
