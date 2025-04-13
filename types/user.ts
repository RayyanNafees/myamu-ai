export type UserType = {
	college: string;
	course: string;
	branch: string;
	name: string;
	class: string;
	serial: number;
	faculty: string;
	enrollment: string;
	hall: string;
	subjects: Array<{
		serial: string;
		category: string;
		code: string;
		subject: string;
		mode: string;
		credits: number;
		iconName: string;
	}>;
};
