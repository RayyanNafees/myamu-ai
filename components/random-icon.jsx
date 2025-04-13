import { DynamicIcon, iconNames } from "lucide-react/dynamic";

export const RandomIcon = ({ ...props }) => {
	console.time("RandomIcon");
	const icon = iconNames[Math.floor(Math.random() * iconNames.length)];
	console.timeEnd("RandomIcon");

	return <DynamicIcon name={icon} {...props} />;
};
