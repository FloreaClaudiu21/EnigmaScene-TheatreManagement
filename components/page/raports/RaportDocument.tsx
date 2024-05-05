/* eslint-disable jsx-a11y/alt-text */
"use client";
import { formatDate } from "@/lib/rangeOptions";
import { capitalizeFirst, validRowsAndCols } from "@/lib/utils";
import { RaportModal } from "@/services/StateProvider";
import config from "@/tailwind.config";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const tw = createTw(config);

export const RaportDocument = ({
	title,
	raportModal,
}: {
	title: any;
	raportModal: RaportModal;
}) => {
	const { rows, cols } = validRowsAndCols(raportModal);
	return (
		<Document
			title={title}
			subject="Raport"
			author="EnigmaScene"
			creationDate={new Date()}
		>
			<Page
				wrap
				size="A4"
				orientation="landscape"
				style={tw("invoice-bg bg-[#eee]")}
			>
				<View
					style={{
						gap: 2,
						marginLeft: 10,
						display: "flex",
						borderBottom: 1,
						marginBottom: 5,
						marginRight: 10,
						alignItems: "center",
						flexDirection: "column",
						borderBottomColor: "red",
						justifyContent: "center",
					}}
					fixed
				>
					<Image
						src={"https://i.imgur.com/QJCzXqh.png"}
						style={{ height: "64px", width: "120px" }}
					/>
					<Text style={{ fontSize: 16, marginBottom: 5 }}>{title}</Text>
				</View>
				<View
					wrap
					style={{
						flex: 1,
						padding: 5,
						paddingLeft: 0,
						paddingRight: 0,
						marginRight: 10,
						marginLeft: 10,
					}}
				>
					<View
						style={{
							border: 1,
							flexDirection: "row",
							backgroundColor: "rgb(239 68 68 / 50)",
						}}
					>
						{cols.map((column) => (
							<Text
								key={column.id}
								style={{
									padding: 5,
									fontSize: 12,
									color: "white",
									fontWeight: 700,
									textAlign: "center",
									width: column.id != "id" ? "25%" : "10%",
								}}
							>
								{capitalizeFirst(column.column.id)}
							</Text>
						))}
					</View>
					{rows.map((row, rowIndex) => (
						<View
							key={rowIndex}
							style={{
								borderLeft: 1,
								borderRight: 2,
								borderBottom: 1,
								flexDirection: "row",
								justifyContent: "center",
							}}
						>
							{cols.map((column) => {
								const value = row.original[column.id];
								const isDate = value instanceof Date;
								return (
									<Text
										key={column.id}
										style={{
											padding: 4,
											fontSize: 10,
											textAlign: "center",
											textOverflow: "ellipsis",
											width: column.id != "id" ? "25%" : "10%",
										}}
									>
										{isDate ? formatDate(value) : value}
									</Text>
								);
							})}
						</View>
					))}
				</View>
				<Text
					style={{
						fontSize: 12,
						marginTop: 5,
						marginBottom: 5,
						textAlign: "center",
					}}
					render={({ pageNumber, totalPages }) =>
						`Pagina ${pageNumber} / ${totalPages}`
					}
					fixed
				/>
			</Page>
		</Document>
	);
};
