"use client";

import type React from "react";
import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map as MapIcon,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
	user: {
		name: "Rayyan Nafees",
		email: "nafees.rayyan@gmail.com",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "AMU",
			logo: GalleryVerticalEnd,
			plan: "Mechanical Engg",
		},
		{
			name: "IIT Roorkee",
			logo: AudioWaveform,
			plan: "Data Science",
		},
	],
	navMain: [
		{
			title: "Data",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Daily Uploads",
					url: "#",
				},
				{
					title: "Documents",
					url: "#",
				},
				{
					title: "Notes",
					url: "#",
				},
				{
					title: "Books",
					url: "#",
				},
			],
		},
		{
			title: "Search",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "AMU sites",
					url: "#",
				},
				{
					title: "Professor",
					url: "#",
				},
				{
					title: "Seniors",
					url: "#",
				},
			],
		},
		{
			title: "Content",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Scholarship",
					url: "#",
				},
				{
					title: "Courses",
					url: "#",
				},
				{
					title: "Research Articles",
					url: "#",
				},
			],
		},
		
	],
	projects: [
		{
			name: "Applied Mathematics",
			url: "#",
			icon: Frame,
		},
		{
			name: "Sales & Marketing",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Travel",
			url: "#",
			icon: MapIcon,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
