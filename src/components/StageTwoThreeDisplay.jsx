'use client';
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function StageTwoTabs({ legislationList, activeTab, setActiveTab }) {
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
    </div>
  );
}

function StageTwoResponseDisplay({ legislation }) {
  if (!legislation) return <div>No response available</div>;

  return (
    <div className="p-4 bg-gray-900 text-gray-100 rounded-lg shadow prose max-w-none">
      <ReactMarkdown>{legislation.stageTwoResponse}</ReactMarkdown>
    </div>
  );
}

export default function StageTwoThreeDisplay({ legislationList }) {
  const responses = legislationList.filter(l => l.stageTwoResponse);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col h-full">
      <StageTwoTabs
        legislationList={legislationList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <StageTwoResponseDisplay legislation={responses[activeTab]} />
    </div>
  );
}
