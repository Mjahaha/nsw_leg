'use client';
import { useState } from 'react'; 

function IndividualLegislation({ legislation }) {
    const legislationName = legislation.name; 
    const legislationComment = legislation.comment;
    const [applies, setApplies] = useState(legislation.applies);

    return (
        <div>
            <h2>{legislationName}</h2>
            <div className="flex-row items-center">
                <div
                    className='border-white'
                    onClick={() => setApplies(!applies)}
                >
                    <p>{applies ? '✔' : 'X'}</p>
                </div>
                <p>Comment: {legislationComment}</p>
            </div>
        </div>
    )
}

export default function StageOneDisplay({ legislationList }) {
    const legislations = legislationList;

    return (
        <div>
            {legislations.map((legislation) => (
                <IndividualLegislation key={legislation.id} legislation={legislation} />
            ))}
        </div>
    );
}