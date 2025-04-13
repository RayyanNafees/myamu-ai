"use client";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from "@/components/ui/file-upload";
import type { UserType } from "@/types/user";
import Link from "next/link";
// import { Documents } from "@/models/Documents.model";
// import { useRouter } from "next/router";

const formSchema = z.object({
	date: z.coerce.date(),
	course: z.string(),
	description: z.string().optional(),
	files: z.string().optional(),
});

type SubjectInput = Array<Pick<UserType["subjects"][0], "code" | "subject">>;

export default function UploaderForm({
	subjects,
	userId,
}: { subjects: SubjectInput; userId: string }) {
	const [files, setFiles] = useState<File[] | null>(null);
  const [fileIds, setFileIds] = useState<string[]>([]);
	const [uploadedURLs, setUploadedURLs] = useState<string[]>([]);
  // const router = useRouter()

	const dropZoneConfig = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 4,
		multiple: true,
	};
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const signURL = async (fileName: string, id:string) =>
			fetch(`/sign?filename=${id}-${fileName}`).then((r) => r.text());
		const uploadFile = async (signedURL: string, file: File, id: string) =>
			fetch(signedURL, {
				method: "PUT",
				body: file,
				// headers: {
				//   "Content-Type": "application/octet-stream",
				// },
			})
				.then(() => `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${id}-${file.name}`)
				.catch(console.error);

		try {
			console.log(values);
			toast(
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">
						{JSON.stringify(
							{ ...values, files: files?.map((i) => i.name) },
							null,
							2,
						)}
					</code>
				</pre>,
			);
			if (!files) return;

			const uploadFiles = Promise.all(files?.map((i, n) => signURL(i.name, fileIds[n])) ?? [])
				.then((fileURLS) =>
					Promise.all(fileURLS.map((i, n) => uploadFile(i, files[n], fileIds[n]))),
				)
				.then((urls) => {
					fetch("/add-uploads", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(
							urls.map((i, n) => ({
								name: files[n].name,
                fileID: fileIds[n],
								url: i,
								type: files[n].type,
								description: values.description,
                course: values.course,
								date: values.date,
								userId,
							})),
						),
					});

					return urls;
				});

			toast.promise(uploadFiles as Promise<string[]>, {
				loading: `uploading ${files?.length} files...`,
				success: async (urls: string[]) => {
					setUploadedURLs(urls);
          // router.reload()
					return `${urls.length} Files Uploaded`;
				},
				error: "Error",
			});
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 max-w-3xl mx-auto py-10"
			>
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date of Upload</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(
												"w-[240px] pl-3 text-left font-normal",
												!field.value && "text-muted-foreground",
											)}
										>
											{field.value ? (
												format(field.value, "PPP")
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>The date to upload the docs of</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="course"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Course name</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="eg, Applied Mathematics" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{subjects?.map(({ subject, code }) => (
										<SelectItem key={code} value={code}>
											{subject}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>
								The course name the documents are of{" "}
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="eg, Topics, Questions etc"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Add other details like Topic name etc
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="files"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Upload Documents</FormLabel>
							<FormControl>
								<FileUploader
									value={files}
									onValueChange={(files) => {
                    if (!files) return
                    setFiles(files)
                    setFileIds(files?.map(()=>crypto.randomUUID()))
                  }}
									dropzoneOptions={dropZoneConfig}
									className="relative bg-background rounded-lg p-2"
								>
									<FileInput
										id="fileInput"
										className="outline-dashed outline-1 outline-slate-500"
									>
										<div className="flex items-center justify-center flex-col p-8 w-full ">
											<CloudUpload className="text-gray-500 w-10 h-10" />
											<p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
												<span className="font-semibold">Click to upload</span>
												&nbsp; or drag and drop
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												SVG, PNG, JPG or GIF
											</p>
										</div>
									</FileInput>
									<FileUploaderContent>
										{files &&
											files.length > 0 &&
											files.map((file, i) => (
												<FileUploaderItem key={file.name} index={i}>
													<Paperclip className="h-4 w-4 stroke-current" />
													<span>{file.name}</span>
												</FileUploaderItem>
											))}
									</FileUploaderContent>
								</FileUploader>
							</FormControl>
							<FormDescription>
								Select the Files / Audios to upload
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>

			{/* {uploadedURLs.length > 0 &&
				uploadedURLs.map((i) => (
					<Link key={i} href={i} target="_blank">
						{i}
					</Link>
				))} */}
			<Toaster richColors />
		</Form>
	);
}
