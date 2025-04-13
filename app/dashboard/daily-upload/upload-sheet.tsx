import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { JSX, PropsWithChildren } from "react";

export function UploadSheet({
	trigger,
	children,
}: PropsWithChildren<{
	trigger: React.ReactNode;
}>) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				{/* <Button variant="outline">Open</Button> */}
				{trigger}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Upload Documents</SheetTitle>
					<SheetDescription>Upload your daily documents here</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4 overflow-y-scroll overflow-x-hidden">
					{children}
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Upload</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
