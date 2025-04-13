"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
	MoreHorizontal,
	File,
	Headphones,
	MessageSquare,
	MessageCircleQuestion,
} from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AudioPlayer } from "./audio-player";
import type { Document } from "@/types/user";

export const DropDown = ({ doc }: { doc: string }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost" className="h-8 w-8 p-0">
				<span className="sr-only">Open menu</span>
				<MoreHorizontal />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem onClick={() => navigator.clipboard.writeText("wow")}>
				Copy payment ID
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>View customer</DropdownMenuItem>
			<DropdownMenuItem>View payment details</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

const TTSButton = ({ doc }: { doc: Document }) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Popup
					title="AI Text to Speech"
					description="Listen to the text inside the document"
					dialogComponent={<AudioPlayer doc={doc} />}
				>
					<Button variant="outline" size="icon">
						<Headphones />
					</Button>
				</Popup>
			</TooltipTrigger>
			<TooltipContent>
				<p>Listen</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

const ActionButton = ({
	name,
	children,
}: PropsWithChildren<{ name: string }>) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Popup
					title="AI Text to Speech"
					description="Listen to the text inside the document"
					// dialogComponent={<AudioPlayer doc={docmas }/>}
				>
					<Button variant="outline" size="icon">
						{children}
					</Button>
				</Popup>
			</TooltipTrigger>
			<TooltipContent>
				<p>{name}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
);

export const Popup = ({
	children,
	dialogComponent,
	title,
	description,
	dialogFooter,
}: PropsWithChildren<
	Partial<{
		dialogComponent: ReactNode;
		title: string;
		description: string;
		dialogFooter: ReactNode;
	}>
>) => (
	<Dialog>
		<DialogTrigger asChild>{children}</DialogTrigger>
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			{dialogComponent}
			<DialogFooter>{dialogFooter}</DialogFooter>
		</DialogContent>
	</Dialog>
);

export function DocsList({
	groupedDocs,
}: {
	groupedDocs: {
		[date: string]: {
			name: string;
			url: string;
			type: string;
			description: string;
			id: string;
			// date: string;
		}[];
	};
}) {
	return (
		<dl>
			{Object.entries(groupedDocs).map(([date, docs]) => (
				<div key={date}>
					<dt className="p-4 text-lg text-slate-600 font-semibold">{date}</dt>
					{docs.map((doc) => (
						<dd key={doc.url}>
							<div className="ml-10 grid grid-cols-12 my-4 p-2 items-center rounded-md shadow-md">
								<Checkbox id="terms" className="col-span-1" />

								<File className="col-span-1" />
								<div className=" col-span-6">
									<Link href={doc.url} className="hover:underline">
										{doc.name}
									</Link>
									{/* <div className=" text-muted-foreground">
										{doc.description}
									</div> */}
								</div>

								<div className="grid grid-cols-3 gap-1 col-span-3">
									<TTSButton doc={doc} />
									<ActionButton name="AI Chat">
										<MessageSquare />
									</ActionButton>
									<ActionButton name="Quiz">
										<MessageCircleQuestion />
									</ActionButton>
								</div>
								<div className="col-span-1">
									{/* <Button variant="outline" size="icon"> */}
									{/* <DropDown /> */}
									{/* </Button> */}
								</div>
							</div>
						</dd>
					))}
				</div>
			))}
		</dl>
	);
}
