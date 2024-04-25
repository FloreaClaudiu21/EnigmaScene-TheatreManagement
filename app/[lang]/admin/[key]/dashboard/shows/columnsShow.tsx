"use client";
import { ColumnDef } from "@tanstack/react-table";
import ColumnHeader from "@/components/admin/table/ColumnHeader";
import ColumnCell from "@/components/admin/table/ColumnCell";
import {
	ColumnSelectCell,
	ColumnSelectHeader,
} from "@/components/admin/table/ColumnSelect";
import { Show, TableTypes } from "@/lib/types";
import ColumnCellActions from "@/components/admin/table/ColumnCellActions";
import { Image, Listbox, ListboxItem } from "@nextui-org/react";

const MatDecorationList = ({ show }: { show: Show }) => {
	return (
		<Listbox
			classNames={{
				base: "max-w-xs",
				list: "max-h-[300px] overflow-scroll",
			}}
			items={show.materials ?? []}
			selectionMode="none"
			variant="flat"
		>
			{(item) => (
				<ListboxItem key={item.id} textValue={item.material?.name_en}>
					<div className="flex items-center">
						<div className="flex flex-col">
							<span className="text-small">{item.material?.name_en}</span>
							<span className="text-tiny text-default-400">
								{item.material?.stock}
							</span>
						</div>
					</div>
				</ListboxItem>
			)}
		</Listbox>
	);
};

export const columnsShow: ColumnDef<Show>[] = [
	{
		id: "select",
		header: ({ table }) => {
			return <ColumnSelectHeader table={table} />;
		},
		cell: ({ row }) => {
			return <ColumnSelectCell row={row} />;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<ColumnCellActions
					type={TableTypes.SHOW}
					deleteId={row.original.id}
					link_edit={"shows/" + row.original.id + "/edit"}
				/>
			);
		},
		enableSorting: false,
	},
	{
		id: "photo",
		cell: ({ row: { original } }) => {
			return (
				<div className="min-w-48 min-h-24 !pr-0">
					<Image
						height={96}
						alt="No Photo"
						src={original.image}
						className="w-full h-24 object-contain rounded-sm"
					/>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "id",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Id" />;
		},
		cell: ({ row }) => {
			const user = row.original;
			return <ColumnCell data={user.id} />;
		},
	},
	{
		accessorKey: "title",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Title" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.title} />;
		},
	},
	{
		accessorKey: "title_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Title EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.title_en} />;
		},
	},
	{
		accessorKey: "description",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Description" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.description} />;
		},
	},
	{
		accessorKey: "description_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Description EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.description} />;
		},
	},
	{
		accessorKey: "content",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Content" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.content} />;
		},
	},
	{
		accessorKey: "content_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Content EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.content_en} />;
		},
	},
	{
		accessorKey: "image",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Picture" />;
		},
		cell: ({ row }) => {
			return <ColumnCell data={row.original.image} />;
		},
	},
	{
		accessorKey: "startTime",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Start Time & Date" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.startTime.replace("T", " ").split(".")[0];
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "endTime",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="End Time & Date" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.endTime.replace("T", " ").split(".")[0];
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "ticketsSold",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Tickets Sold" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.ticketsSold?.length} />;
		},
	},
	{
		accessorKey: "ticketsAvailable",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Tickets Available" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoom?.seats?.length} />;
		},
	},
	{
		accessorKey: "showRoomId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Room Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoomId} />;
		},
	},
	{
		accessorKey: "showRoomName",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Room Name" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showRoom?.number} />;
		},
	},
	{
		accessorKey: "seasonId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Season Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.season.id} />;
		},
	},
	{
		accessorKey: "season",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Season" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.season.name} />;
		},
	},
	{
		accessorKey: "season_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Season EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.season.name_en} />;
		},
	},
	{
		accessorKey: "showTypeId",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Type Id" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showTypeId} />;
		},
	},
	{
		accessorKey: "showType",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Type" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showType.name} />;
		},
	},
	{
		accessorKey: "showType_en",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Show Type EN" />;
		},
		cell: ({ row: { original } }) => {
			return <ColumnCell data={original.showType.name_en} />;
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Created At" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.createdAt.toUTCString();
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Updated At" />;
		},
		cell: ({ row }) => {
			const show = row.original;
			const theDate = show.updatedAt.toUTCString();
			return <ColumnCell data={theDate} />;
		},
	},
	{
		accessorKey: "materials",
		header: ({ column }) => {
			return <ColumnHeader column={column} title="Decoration Materials" />;
		},
		cell: ({ row }) => {
			return <MatDecorationList show={row.original} />;
		},
	},
];
