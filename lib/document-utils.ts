type Document = {
	// id: string;
	name: string;
	url: string;
	type: string;
	description: string;
	date: string | Date;
	// userId: string;
};

const filterKeys = <K extends string, V>(
	obj: Record<K, V>,
	excludeKeys: string[] = [],
) =>
	Object.fromEntries(
		Object.entries(obj).filter(([k, _]) => !excludeKeys.includes(k)),
	);
export function groupDocumentsByDate(documents: Document[], locale = "en-US") {
	return documents.reduce(
		(acc, doc) => {
			const date = new Date(doc.date);
			const localeDate = date.toLocaleDateString(locale);

			if (!acc[localeDate]) {
				acc[localeDate] = [];
			}

			acc[localeDate].push({
				name: doc.name,
				url: doc.url,
				type: doc.type,
				description: doc.description,
				date: doc.date.toLocaleString(),
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
