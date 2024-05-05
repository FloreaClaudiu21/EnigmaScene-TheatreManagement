export default async function AdminKeyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-[#eeee] bg-gradient-to-tl from-white via-transparent to-red-300 dark:from-black dark:via-transparent dark:to-red-900">
			{children}
		</div>
	);
}
