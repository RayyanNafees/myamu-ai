import { getUser } from "@/lib/user";
import Uploader from "@/components/forms/uploader";
import type { Document, UserType } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadSheet } from "./upload-sheet";
import { getAllUploadedDocuments } from "@/lib/upload";
import { DataTableDemo } from "@/components/data-table";
import UploaderForm from "@/components/forms/uploader";
import { File } from "lucide-react";
import { DocsList } from "@/components/doc-list";
import {
	groupDocumentsByDate,
	sortGroupedDocumentsByDate,
} from "@/lib/document-utils";



export default async function Page() {
	const user = (await getUser()) as UserType & { id: string };
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const docs = (await getAllUploadedDocuments(user.id)) as any & {
		toJSON: () => void;
	};

	const groupedDocs = groupDocumentsByDate(docs as Document[]);
	const sortedGroupedDocs = sortGroupedDocumentsByDate(groupedDocs);

	console.log({ sortedGroupedDocs: sortedGroupedDocs["4/5/2025"][0] });

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-full">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Documents
			</h1>
			<p className="leading-7 [&:not(:first-child)]:mt-6">
				All your uploaded documents with dates
			</p>
			{/* <div className="flex max-w-lg items-center space-x-2">
				<Input
					type="search"
					placeholder="Search Documents"
					className="w-full"
				/>
				
			</div> */}
			<UploadSheet
				trigger={
					<Button type="submit" className="max-w-sm">
						Upload{" "}
					</Button>
				}
			>
				<UploaderForm
					subjects={user.subjects.map((i) => ({
						subject: i.subject,
						code: i.serial,
					}))}
					userId={user.id}
				/>
			</UploadSheet>
			<DocsList groupedDocs={sortedGroupedDocs} />
		</div>
	);
}
