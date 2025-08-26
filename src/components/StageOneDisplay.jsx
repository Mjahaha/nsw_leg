'use client';
import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';

function IndividualLegislation({ legislation, onToggle }) {
    const legislationName = legislation.name; 
    const legislationComment = legislation.comment; 
    const legislationApplies = legislation.applies; 

    return (
        <div className="bg-gray-900 text-gray-100 rounded-xl p-4 mb-3 shadow-md">

            <h2>{legislationName}</h2>
            <div className="flex flex-row items-center">
                <button
                    className={`px-3 py-1 cursor-pointer border rounded border-white hover:opacity-80 transition mr-6`}
                    onClick={() => onToggle(legislation.id)}
                >
                    <p>{legislationApplies ? '✔' : 'X'}</p>
                </button>
                
                <p className="text-gray-300 mt-2">Comment: {legislationComment}</p>
            </div>
        </div>
    )
}

export default function StageOneDisplay({ legislationList }) {
    const [ list, setList ] = useState(legislationList);
    useEffect(() => {
        setList(legislationList);
    }, [legislationList]);
    const yesList = list.filter(legislation => legislation.applies);
    const noList = list.filter(legislation => !legislation.applies);
    const toggleApplies = id => {
        setList(prevList => 
            prevList.map(legislation => 
                legislation.id === id ? { ...legislation, applies: !legislation.applies } : legislation
            )
        );
    }
    

    return (
        <motion.div 
            className={yesList.length > 0 || noList.length > 0 ? 'bg-gray-900 text-gray-100 rounded-xl p-4 mb-3 shadow-md' : 'hidden'}
            layout   // <-- this makes items animate when they move around lists
            initial={{ opacity: 0, y: 20 }}   // when it first shows up
            animate={{ opacity: 1, y: 0 }}    // when it’s visible
            exit={{ opacity: 0, y: -20 }}     // when it leaves
            transition={{ duration: 0.3 }}
        >   
            <div className='flex space-x-3'>
                <AnimatePresence>
                <div className="w-1/2">
                    <h3 className="text-lg font-semibold">Applicable Legislation</h3>
                    <br></br>
                    {yesList.map((legislation) => (
                        <IndividualLegislation key={legislation.id} legislation={legislation} onToggle={toggleApplies} />
                    ))}
                </div>
                </AnimatePresence>
                <AnimatePresence>
                <div className="w-1/2">
                    <h3 className="text-lg font-semibold">Not Applicable Legislation</h3>
                    <br></br>
                    {noList.map((legislation) => (
                        <IndividualLegislation key={legislation.id} legislation={legislation} onToggle={toggleApplies} />
                    ))}
                </div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}