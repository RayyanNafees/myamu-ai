"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
	MoreHorizontal,
	File,
	Headphones,
	MessageSquare,
	MessageCircleQuestion,
} from "lucide-react";
import type { PropsWithChildren } from "react";
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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const DropDown = () => (
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

const ActionButton = ({
	name,
	children,
}: PropsWithChildren<{ name: string }>) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline" size="icon">
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{name}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
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
									<ActionButton name="Listen">
										<Headphones />
									</ActionButton>
									<ActionButton name="AI Chat">
										<MessageSquare />
									</ActionButton>
									<ActionButton name="Quiz">
										<MessageCircleQuestion />
									</ActionButton>
								</div>
								<div className="col-span-1">
									{/* <Button variant="outline" size="icon"> */}
									<DropDown />
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
