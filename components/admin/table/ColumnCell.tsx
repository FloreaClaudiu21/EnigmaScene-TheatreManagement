import React from "react";

export default function ColumnCell({
	data,
	className,
}: {
	data: any;
	className?: string;
}) {
	return (
		<div className="flex flex-row items-start justify-center text-center h-full break-words">
			<p className={className}>{data}</p>
		</div>
	);
}
