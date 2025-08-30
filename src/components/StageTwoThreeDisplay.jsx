'use client';
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function StageTwoTabs({ legislationList, activeTab, setActiveTab, stageTwoResponseObtained }) {
  const responses = legislationList.filter(l => l.stageTwoResponse);

  return (
    <div className="flex overflow-x-auto border-b border-gray-300 mb-2">
      {responses.map((leg, idx) => (
        <button
          key={leg.id}
          onClick={() => setActiveTab(idx)}
          className={`px-2 py-1 text-sm rounded-t-md 
            ${activeTab === idx 
              ? "bg-gray-900 text-gray-100 border border-b-0 border-gray-300 font-medium" 
              : "bg-gray-900 text-gray-100 hover:bg-gray-300"}
          `}
        >
          {leg.name || `Legislation ${leg.id}`}
        </button>
      ))}

      {stageTwoResponseObtained && (
        <button
          key="Summary"
          onClick={() => setActiveTab(responses.length)} // special index
          className={`px-2 py-1 text-sm rounded-t-md 
            ${activeTab === responses.length
              ? "bg-gray-900 text-gray-100 border border-b-0 border-gray-300 font-medium"
              : "bg-gray-900 text-gray-100 hover:bg-gray-300"}
          `}
        >
          Summary
        </button>
      )}
    </div>
  );
}

function StageTwoResponseDisplay({ legislation, summary }) {
  // Case 1: Stage 3 summary
  if (summary) {
    return (
      <div className="p-4 bg-gray-900 text-gray-100 rounded-lg shadow prose max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    );
  }

  // Case 2: Stage 2 legislation response
  if (legislation) {
    return (
      <div className="p-4 bg-gray-900 text-gray-100 rounded-lg shadow prose max-w-none">
        <ReactMarkdown>{legislation.stageTwoResponse.replace('\n','\n\n')}</ReactMarkdown>
      </div>
    );
  }

  // Case 3: Nothing selected
  return <div className="p-4">No response available</div>;
}

export default function StageTwoThreeDisplay({ legislationList, stageTwoResponseObtained, stageThreeResponse }) {
  const responses = legislationList.filter(l => l.stageTwoResponse);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <StageTwoTabs
        legislationList={legislationList}
        stageTwoResponseObtained={stageTwoResponseObtained}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <StageTwoResponseDisplay
        legislation={activeTab < responses.length ? responses[activeTab] : null}
        summary={activeTab === responses.length ? stageThreeResponse : null}
      />

    </div>
  );
}
