// import { GoogleGenerativeAI } from "@google/generative-ai";
import  defaultIcons from "@/data/iconNames.json";
// import { User } from "@/models/User.model";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const defaultSubjects = [
	"Applied Mathematics",
	"Vehicle Body Design",
	"Automotive Elctrical & Electronics Systems",
	"Manufacturing Technology",
	"Additive Manufacturing",
	"Thermodynamcis & heat transfer",
];

export async function getCourseIcons(
	subjectNames: string[] = defaultSubjects,
	iconNames: string[] = defaultIcons,
) {
	const prompt = `

I have a list of university courses I am currently taking and a list of available Lucide icon names: Please map each course to the most relevant icon name from the provided list.

**My Courses:**
${JSON.stringify(subjectNames)}

**Available Lucide Icons:**
${JSON.stringify(iconNames)}

Your task is to generate a single, valid JSON object where:
1.  Each key is a course name from the 'My Courses' list.
2.  Each value is the corresponding *most relevant* & *unique* Lucide icon name chosen *only* from the 'Available Lucide Icons' list. *NO ICON NAME SHOULD BE REPEATED, USE DIFFERENT FOR EACH*
3.  The output must be **only** the JSON object, without any introductory text, comments, or explanations.

Example structure: \`{ "Course Name 1": "relevantIconName1", "Course Name 2": "relevantIconName2", ... }\`

`;
	if (!subjectNames.length || !iconNames.length) return {};
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: prompt,
	});
	const result = response.text
		?.replace(/^```json/, "")
		.replace(/```$/, "") as string;

	try {
		return JSON.parse(result);
	} catch (error) {
		console.error("Error parsing JSON:", error);
		console.log({ result, subjectNames });
		return {};
	}
}

console.log(await getCourseIcons());
