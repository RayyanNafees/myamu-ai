import type { Document } from "@/types/user";

export function groupDocumentsByDate(documents: Document[], locale = "en-US") {
	return documents.reduce(
		(acc, doc) => {
			const date = new Date(doc.date ?? Date.now());
			const localeDate = date.toLocaleDateString(locale);

			if (!acc[localeDate]) {
				acc[localeDate] = [];
			}

			acc[localeDate].push({
				name: doc.name,
				url: doc.url,
				type: doc.type,
				description: doc.description,
				date: new Date(doc.date ?? Date.now()).toLocaleString(),
				id: doc.id,
			});
			return acc;
		},
		{} as Record<string, Document[]>,
	);
}

export function sortGroupedDocumentsByDate(
	groupedDocs: Record<string, Document[]>,
) {
	const sortedEntries = Object.entries(groupedDocs).sort(([dateA], [dateB]) => {
		return new Date(dateB).getTime() - new Date(dateA).getTime();
	});

	return Object.fromEntries(sortedEntries);
}
