'use client';
import { useState, useEffect } from 'react';
import MainUserTextbox from './MainUserTextbox';
import StageOneDisplay from './StageOneDisplay';
import StageTwoThreeDisplay from './StageTwoThreeDisplay';
import { q } from 'framer-motion/client';


export default function Body() {
  const [question, setQuestion] = useState("");
  const [legislationList, setLegislationList] = useState([]);
  const [stageTwoCommenced, setStageTwoCommenced] = useState(false);
  const [stageTwoResponseObtained, setStageTwoResponseObtained] = useState(false);
  const [stageThreeResponse, setStageThreeResponse] = useState(null);

  // Function to trigger stage one
  const stageOneHandler = async (query) => {
    const retrievedLegislationList = await fetch(`/api/legislation/stageOne?query=${encodeURIComponent(query)}`); 
    setLegislationList(await retrievedLegislationList.json());
  }

  // Function to trigger stage two
  const stageTwoHandler = async (question, legislationList) => {
    const legislationKeyArray = legislationList.filter(item => item.applies).map(item => item.id);
    console.log("MainUserTextBoxComponent is sending keys for stage two:", legislationKeyArray);
    setStageTwoCommenced(true);
    const stageTwoResults = await fetch(`/api/legislation/stageTwo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, legislationKeyArray }),
    });
    return stageTwoResults.json();
  }

  // Function to trigger stage three 
  const stageThreeHandler = async (question, legislationList) => {
    console.log("MainUserTextBoxComponent is sending keys for stage three:", legislationList);
    const stageThreeResults = await fetch(`/api/legislation/stageThree`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, legislationList }),
    });
    return stageThreeResults.json();
  }

  // Function to toggle the "applies" status of a legislation items on legislationList 
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

  // Function to add stage two response to legislationList
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

  // Check if all stage two responses are obtained to set stageTwoResponseObtained
  useEffect(() => {
    const appliedOnes = legislationList.filter(l => l.applies);
    const allDone =
      appliedOnes.length > 0 && appliedOnes.every(l => !!l.stageTwoResponse);

    console.log("Applied legislation:", appliedOnes);
    console.log("All done?", allDone);
    console.log("stageTwoResponseObtained?", stageTwoResponseObtained);

    if (allDone && !stageTwoResponseObtained) {
      console.log("✅ Stage two responses complete. Triggering stage three...");

      setStageTwoResponseObtained(true);

      stageThreeHandler(question, appliedOnes)
        .then(data => {
          console.log("Stage three response:", data);
          setStageThreeResponse(data);
        })
        .catch(err => {
          console.error("Stage three handler failed:", err);
        });
    }
  }, [legislationList, stageTwoResponseObtained]);



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
            question={question} setQuestion={setQuestion}
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
          <StageTwoThreeDisplay 
            legislationList={legislationList} 
            stageTwoResponseObtained={stageTwoResponseObtained}
            stageThreeResponse={stageThreeResponse}
          />
        </section>
      )}
    </main>
  );
}
