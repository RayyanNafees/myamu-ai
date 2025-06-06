import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "MyAMU AI",
	description: "AI Study companion for students at AMU",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<link rel="shortcut icon" href="icon.png" type="image/png" />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* <ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				> */}
					{children}
					<Toaster richColors />
				{/* </ThemeProvider> */}
			</body>
		</html>
	);
}
