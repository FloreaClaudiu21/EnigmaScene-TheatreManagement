import { useToast } from "@/components/ui/use-toast";
import { Button } from "@nextui-org/react";
import React from "react";

export default function ColumnCell({
	data,
	className,
}: {
	data: any;
	className?: string;
}) {
	const { toast } = useToast();
	return (
		<div className="flex flex-row items-center justify-center text-center">
			<Button
				radius="md"
				variant="light"
				className={className}
				onClick={() => {
					navigator.clipboard.writeText(data);
					toast({
						description: "Text copied to the clipboard.",
					});
				}}
			>
				{data}
			</Button>
		</div>
	);
}
