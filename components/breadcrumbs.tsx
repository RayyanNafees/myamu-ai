"use client";

import React, { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
	const pathname = usePathname();
	const paths = pathname.split("/").filter((i) => i);
	console.log({ paths });
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{paths.map((path, index) => (
					<Fragment key={path}>
						<BreadcrumbItem
							className="hidden md:block -mt-1 hover:underline"
						>
							<BreadcrumbLink href={path}>{path}</BreadcrumbLink>
						</BreadcrumbItem>
						{index !== paths.length - 1 && (
							<BreadcrumbSeparator
								className="hidden md:block  -mt-1 hover:underline"
							/>
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default Breadcrumbs;
