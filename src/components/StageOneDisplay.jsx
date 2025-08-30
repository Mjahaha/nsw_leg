'use client';
import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { on } from 'events';
import Dump from "@/components/Dump";

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

export default function StageOneDisplay({ stageTwoCommenced, legislationList, onToggle }) {
    const yesList = legislationList.filter(legislation => legislation.applies);
    const noList = legislationList.filter(legislation => !legislation.applies);

    return (
        <motion.div 
            className={yesList.length > 0 || noList.length > 0 ? 'bg-gray-900 text-gray-100 rounded-xl p-4 mb-3 shadow-md' : 'hidden'}
            layout   // <-- this makes items animate when they move around lists
            initial={{ opacity: 0, y: 20 }}   // when it first shows up
            animate={{ opacity: 1, y: 0 }}    // when it’s visible
            exit={{ opacity: 0, y: -20 }}     // when it leaves
            transition={{ duration: 0.3 }}
        >   
            <Dump data={legislationList} />
            <div className={`flex ${stageTwoCommenced ? 'flex-col space-y-3' : 'flex-row space-x-3'}`}>
                <AnimatePresence>
                <div className={`${stageTwoCommenced ? 'w-full' : 'w-1/2'}`}>
                    <h3 className="text-lg font-semibold">Rules to deepdive into</h3>
                    <br></br>
                    {yesList.map((legislation) => (
                        <IndividualLegislation key={legislation.id} legislation={legislation} onToggle={onToggle} />
                    ))}
                </div>
                </AnimatePresence>
                <AnimatePresence>
                <div className={`${stageTwoCommenced ? 'w-full' : 'w-1/2'}`}>
                    <h3 className="text-lg font-semibold">Rules that we won't look into</h3>
                    <br></br>
                    {noList.map((legislation) => (
                        <IndividualLegislation key={legislation.id} legislation={legislation} onToggle={onToggle} />
                    ))}
                </div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}