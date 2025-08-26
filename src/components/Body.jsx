'use client';
import { useState } from 'react';
import MainUserTextbox from './MainUserTextbox';
import StageOneDisplay from './StageOneDisplay';

export default function Body() {
  const [legislationList, setLegislationList] = useState([]);

  const stageOneHandler = async (query) => {
    const retrievedLegislationList = await fetch(`/api/legislation?query=${encodeURIComponent(query)}`); 
    setLegislationList(await retrievedLegislationList.json());
  }

  return (
    <main>
      <section 
        className={legislationList.length > 0 ? 
        "flex flex-col items-center justify-center min-h-40 bg-black-50 p-8 pb-10" : 
        "flex flex-col items-center justify-center min-h-120 bg-black-50 p-8 pb-10"}
      >
        <h1 className="text-2xl font-bold">What is your question around NSW building law?</h1>
        <MainUserTextbox submitFunction={stageOneHandler} legislationList={legislationList} />
      </section>
      <section className={`flex flex-col items-center justify-center p-8 pb-10 transition-all duration-500 ${legislationList.length > 0 ? 'mt-4' : 'hidden'}`}>
        <StageOneDisplay legislationList={legislationList} />
      </section>
    </main>
  );
}
