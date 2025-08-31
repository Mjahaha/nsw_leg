'use client';
import {useState, useEffect, useMemo} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {on} from 'events';
import Dump from "@/components/Dump";
import Container from "@/components/Container";
import {Card} from "@/components/ui/card";
import SwitchInput from "@/components/SwitchInput";

function IndividualLegislation({legislation, onToggle}) {
	const legislationName = legislation.name;
	const legislationComment = legislation.comment;
	const legislationApplies = legislation.applies;
	
	return (
		<Card className="bg-white rounded-xl p-4 mb-3 shadow-md">
			
			<h2>{legislationName}</h2>
			<div className="flex flex-row gap-4 items-start pt-2">
				<SwitchInput checked={legislationApplies} onChange={() => onToggle(legislation.id)}/>
				{/*<button*/}
				{/*	className={`px-3 py-1 cursor-pointer border rounded border-white hover:opacity-80 transition mr-6`}*/}
				{/*	onClick={() => onToggle(legislation.id)}*/}
				{/*>*/}
				{/*	<p>{legislationApplies ? '✔' : 'X'}</p>*/}
				{/*</button>*/}
				
				<p>Comment: {legislationComment}</p>
			</div>
		</Card>
	)
}

export default function StageOneDisplay({stageTwoCommenced, legislationList = [], onToggle}) {
	// const yesList = legislationList.filter(legislation => legislation.applies);
	// const noList = legislationList.filter(legislation => !legislation.applies);
	const {yesList, noList} = useMemo(() => {
		const yesList = legislationList?.filter(legislation => legislation.applies) ?? [];
		const noList = legislationList?.filter(legislation => !legislation.applies) ?? [];
		
		return {yesList, noList};
		
		
	}, [legislationList])
	
	if (!legislationList?.length) {
		return null;
	}
	
	return (
		<motion.div
			// className={yesList.length > 0 || noList.length > 0 ? 'bg-gray-900 text-gray-100 rounded-xl p-4 mb-3 shadow-md' : 'hidden'}
			layout   // <-- this makes items animate when they move around lists
			initial={{opacity: 0, y: 20}}   // when it first shows up
			animate={{opacity: 1, y: 0}}    // when it’s visible
			exit={{opacity: 0, y: -20}}     // when it leaves
			transition={{duration: 0.3}}
		>
			<Container>
				{/*<Dump data={legislationList}/>*/}
				
				<Card className={`flex bg-gray-100  rounded-xl p-4 mb-3 shadow-md`}>
					<AnimatePresence>
						<div>
							<h3 className="text-lg font-semibold">Rules to deepdive into</h3>
							<br></br>
							{yesList.map((legislation) => (
								<IndividualLegislation key={legislation.id} legislation={legislation}
													   onToggle={onToggle}/>
							))}
						</div>
					</AnimatePresence>
					<AnimatePresence>
						<div>
							<h3 className="text-lg font-semibold">Rules that we won't look into</h3>
							<br></br>
							{noList.map((legislation) => (
								<IndividualLegislation key={legislation.id} legislation={legislation}
													   onToggle={onToggle}/>
							))}
						</div>
					</AnimatePresence>
				</Card>
			</Container>
		</motion.div>
	);
}