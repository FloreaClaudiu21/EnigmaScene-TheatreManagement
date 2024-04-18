"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function NewOrEditContent({
	back_link,
	onSubmit,
	form,
	loading,
	children,
	title,
}: {
	form: any;
	onSubmit: any;
	title: string;
	loading: boolean;
	back_link: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="flex flex-1 flex-col">
				<Card>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-2"
								onSubmit={(e) => {
									e.preventDefault();
								}}
							>
								{children}
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-row items-center justify-between flex-wrap mt-4">
				<div className="flex flex-row justify-end gap-4 w-full">
					<Link href={back_link}>
						<Button
							size="sm"
							variant="outline"
							className="h-10 gap-1 shadow-sm rounded-md hover:bg-yellow-100"
						>
							<ArrowLeftIcon className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Back to prev page
							</span>
						</Button>
					</Link>
					<Button
						size="sm"
						disabled={loading}
						onClick={form.handleSubmit(onSubmit)}
						className="h-10 gap-1 shadow-sm bg-green-600 hover:bg-green-900 text-white"
					>
						<SaveIcon className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Save
						</span>
					</Button>
				</div>
			</div>
		</>
	);
}
