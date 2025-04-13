"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	X,
	MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Document } from "@/types/user";

const playerData = {
	initialSong: {
		name: "Song name",
		author: "Author Title",
		cover: "https://i.scdn.co/image/ab67616d0000b2731d1cc2e40d533d7bcebf5dae",
		audio:
			"/audio?text=I love building and shipping new features for our users!",
	},
	sidhuSong: {
		name: "295",
		author: "Sidhu Moosewala",
		cover: "https://i.scdn.co/image/ab67616d0000b2731d1cc2e40d533d7bcebf5dae",
		audio:''
			// "/audio?text=I love building and shipping new features for our users!",
	},
};

const secs2Time = (secs: number | undefined, defaultValue: string) => {
	if (!secs) return defaultValue;
	const mins = Math.floor(secs / 60);
	const secsLeft = secs % 60;
	return `${mins}:${secsLeft < 10 ? "0" : ""}${Math.ceil(secsLeft)}`;
};

export function AudioPlayer({ doc }: { doc: Document }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [currentSong, setCurrentSong] = useState(playerData.initialSong);
	const [isAudioLoaded, setIsAudioLoaded] = useState(false);
	const audioRef = useRef<HTMLAudioElement>(null);
	const progressControls = useAnimation();

	// Improved typing effect
	useEffect(() => {
		fetch('/doc-tts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(doc),
		})
			.then((r) => r.json())
			.then(({ base64, docName, docCourse }) => {
				setCurrentSong({
					name: doc.name,
					author: doc.description,
					cover:
						"https://i.scdn.co/image/ab67616d0000b2731d1cc2e40d533d7bcebf5dae",
					audio: `data:audio/wav;base64,${base64}`,
				});
				loadAudio();
				setIsPlaying(true);
				animateProgress();
			});
	}, [doc]);

	const loadAudio = () => {
		if (audioRef.current) {
			audioRef.current.src = playerData.sidhuSong.audio;
			audioRef.current.load();
			audioRef.current.oncanplaythrough = () => {
				setIsAudioLoaded(true);
				setIsPlaying(true);
				audioRef.current
					?.play()
					.catch((error) => console.error("Audio playback failed:", error));
			};
		}
	};

	// Handle audio progress
	useEffect(() => {
		if (audioRef.current) {
			if (isPlaying && isAudioLoaded) {
				audioRef.current.play().catch((error) => {
					console.error("Audio playback failed:", error);
					setIsPlaying(false);
				});
			} else {
				audioRef.current.pause();
			}
		}
	}, [isPlaying, isAudioLoaded]);

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			const progress =
				(audioRef.current.currentTime / audioRef.current.duration) * 100;
			setProgress(progress);
		}
	};

	const togglePlayPause = () => {
		if (isAudioLoaded) {
			setIsPlaying(!isPlaying);
		} else if (currentSong === playerData.sidhuSong) {
			loadAudio();
		}
	};

	const animateProgress = () => {
		progressControls.start({
			width: progress,
			transition: { duration: 30, ease: "linear" },
		});
	};

	const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
		const progressBar = e.currentTarget;
		const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
		const percentageClicked = (clickPosition / progressBar.offsetWidth) * 100;

		if (audioRef.current) {
			const newTime = (percentageClicked / 100) * audioRef.current.duration;
			audioRef.current.currentTime = newTime;
			setProgress(percentageClicked);
		}
	};

	return (
		<div className="flex flex-col items-start gap-8 w-full max-w-[680px]">
			<Card className="w-[calc(100%-80px)] overflow-hidden mx-auto">
				<CardHeader className="flex flex-row items-center justify-between py-1 px-3 bg-neutral-50">
					<div className="font-medium text-sm">Music Player </div>
					<Button variant="ghost" size="icon" className="h-6 w-6">
						<X className="h-4 w-4" />
					</Button>
				</CardHeader>

				<CardContent className="flex px-4 pt-4 pb-2">
					<motion.div
						className="flex-1 w-full"
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-neutral-50 rounded-[4px] border border-solid border-[#00000014] overflow-hidden">
								{currentSong === playerData.sidhuSong && (
									<img
										src={currentSong?.cover || "/placeholder.svg"}
										alt={currentSong.name}
										className="w-full h-full object-cover"
									/>
								)}
							</div>
							<div className="space-y-0.5">
								<div className="font-medium text-sm text-neutral-900">
									{currentSong.name}
								</div>
								<div className="font-medium text-sm text-[#666666]">
									{currentSong.author}
								</div>
							</div>
						</div>
						<div className="mt-6 flex w-full items-center justify-between">
							<div>{secs2Time(audioRef.current?.currentTime, "00:00")}</div>
							<div>{secs2Time(audioRef.current?.duration, "--:--")}</div>
						</div>
						<div
							className=" relative h-1.5 hover:cursor-pointer bg-neutral-200 rounded-full overflow-hidden"
							onClick={handleSeek}
							onKeyUp={() => false}
							title="seek"
						>
							<Progress
								value={progress}
								style={{ width: `${progress}%` }}
								className="absolute top-0 left-0 h-full bg-teal-500 rounded-full"
							/>
						</div>

						<div className="flex justify-center gap-6 mt-6">
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<SkipBack className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={togglePlayPause}
							>
								{isPlaying ? (
									<Pause className="h-4 w-4" />
								) : (
									<Play className="h-4 w-4" />
								)}
							</Button>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<SkipForward className="h-4 w-4" />
							</Button>
						</div>
					</motion.div>
				</CardContent>
			</Card>

			<audio
				ref={audioRef}
				onTimeUpdate={handleTimeUpdate}
				onEnded={() => setIsPlaying(false)}
				crossOrigin="anonymous"
        src={currentSong.audio}
			>
				<track kind="captions" />
			</audio>
		</div>
	);
}
