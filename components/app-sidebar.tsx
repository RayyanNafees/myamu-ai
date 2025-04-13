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
	Palmtree,
	PieChart,
	Settings2,
	ShieldCheck,
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
import { RandomIcon } from "./random-icon";
import type { UserType } from "@/types/user";

// This is sample data.
const data = {

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

};

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
export function AppSidebar({ user }: { user: UserType }) {
	const profile = {
		name: user.name,
		email: user.faculty,
		avatar: 'https://picsum.photos/100/100',
	}

	const projects = user.subjects.map(s => ({ name: s.subject, url: `/dashboard/daily-upload?subject=${s.subject}`, icon: s.iconName }))

	const teams = [
		{
			name: user.college,
			logo: Palmtree,
			plan: user.branch,
		},
		{
			name: "IIT Roorkee",
			logo: ShieldCheck,
			plan: "Data Science & AI",
		},
	]
	return (
		<Sidebar collapsible="icon" >
			<SidebarHeader>
				<TeamSwitcher teams={teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={profile} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
