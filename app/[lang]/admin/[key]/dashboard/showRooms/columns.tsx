"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
import { Button, Checkbox, Link } from "@nextui-org/react";
import { useDeleteModal } from "@/services/StateProvider";
import { CarBrand, TableTypes } from "@/lib/types";

function ActionButtons({ brand }: { brand: CarBrand }) {
	const deleteModal = useDeleteModal();
	return (
		<div className="flex flex-row items-center justify-center text-center gap-2">
			<Button
				as={Link}
				radius="none"
				variant="faded"
				aria-label="Edit"
				size="sm"
				className="text-zinc-600 border-zinc-400 font-medium"
				href={"carBrands/" + brand.id + "/edit"}
			>
				Edit
			</Button>
			<Button
				size="sm"
				isIconOnly
				radius="none"
				variant="light"
				className="text-zinc-600 hover:text-red-600"
				onPress={() => {
					deleteModal.setDeleteId(brand.id);
					deleteModal.setType(TableTypes.BRANDS);
					deleteModal.setVisible(true);
				}}
			>
				<Trash2Icon size={18} />
			</Button>
		</div>
	);
}

export const columns: ColumnDef<CarBrand>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<div className="flex flex-row items-center justify-center text-center">
				<Checkbox
					radius="none"
					onChange={(event) => {
						table.toggleAllPageRowsSelected(event.target.checked);
					}}
					isIndeterminate={table.getIsSomePageRowsSelected()}
					isSelected={table.getIsAllPageRowsSelected()}
					aria-label="Select all"
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex flex-row items-center justify-center text-center">
				<Checkbox
					radius="none"
					onChange={(event) => {
						row.toggleSelected(event.target.checked);
					}}
					isSelected={row.getIsSelected()}
					aria-label="Select row"
				/>
			</div>
		),
		enableSorting: false,
		enableHiding: true,
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const brand = row.original;
			return <ActionButtons brand={brand} />;
		},
	},
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<div className="text-center">
					<Button
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						ID
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(brand.id.toString())}
					>
						{brand.id}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "manufacturer",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Manufacturer
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(brand.manufacturer)}
					>
						{brand.manufacturer}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "model",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Model
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(brand.model)}
					>
						{brand.model}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "year",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Model Year
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(brand.year + "")}
					>
						{brand.year}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						radius="none"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Car Category
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(brand.category.toString())
						}
					>
						{brand.category.toString()}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "engineType",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Engine Type
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(brand.engineType)}
					>
						{brand.engineType}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "transmissionType",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Transmission Type
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(brand.transmissionType.toString())
						}
					>
						{brand.transmissionType.toString()}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "fuelType",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						radius="none"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Fuel Type
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(brand.fuelType.toString())
						}
					>
						{brand.fuelType.toString()}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "fuelCapacity",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						variant="light"
						radius="none"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Fuel Capacity
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() =>
							navigator.clipboard.writeText(brand.fuelCapacity.toString())
						}
					>
						{brand.fuelCapacity.toString()}
					</Button>
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Created At
						{column.getIsSorted() ? (
							column.getIsSorted() === "asc" ? (
								<ArrowUpIcon className="ml-2 h-4 w-4" />
							) : (
								<ArrowDownIcon className="ml-2 h-4 w-4" />
							)
						) : (
							""
						)}
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const brand = row.original;
			const theDate = brand.createdAt.toUTCString();
			return (
				<div className="flex flex-row items-center justify-center text-center">
					<Button
						radius="none"
						variant="light"
						onClick={() => navigator.clipboard.writeText(theDate)}
					>
						{theDate}
					</Button>
				</div>
			);
		},
	},
];
