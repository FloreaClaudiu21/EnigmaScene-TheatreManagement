/* eslint-disable jsx-a11y/alt-text */
"use client";
import { formatDate, formatDateFull } from "@/lib/rangeOptions";
import {
	capitalizeFirst,
	isDateValue,
	removeDiacritics,
	validRowsAndCols,
} from "@/lib/utils";
import { RaportModal } from "@/services/StateProvider";
import {
	Document,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
} from "@react-pdf/renderer";

export const RaportDocument = ({
	title,
	raportModal,
}: {
	title: any;
	raportModal: RaportModal;
}) => {
	const { rows, cols } = validRowsAndCols(raportModal);
	const columnWidth = 100 / cols.length + "%";
	return (
		<Document
			title={title}
			subject="Raport"
			author="EnigmaScene"
			creationDate={new Date()}
		>
			<Page size="A4" orientation="landscape" style={styles.page}>
				<View style={styles.header} fixed>
					<View style={styles.generatedOn}>
						<Text>Generat Pe: {formatDate(new Date())}</Text>
					</View>
					<Image src={"https://i.imgur.com/QJCzXqh.png"} style={styles.logo} />
					<Text
						style={{
							textAlign: "center",
							fontSize: 12,
							color: "gray",
							marginBottom: 5,
						}}
					>
						{removeDiacritics(
							"Municipiul București, Sector 2, Bulevardul Imaginației nr. 123,România."
						)}
					</Text>
					<Text style={styles.title}>{title}</Text>
				</View>
				<View style={styles.tableContainer}>
					<View style={styles.tableHeader}>
						{cols.map((column) => {
							return (
								<Text
									key={column.id}
									style={[styles.tableHeaderCell, { width: columnWidth }]}
								>
									{capitalizeFirst(column.column.id)}
								</Text>
							);
						})}
					</View>
					{rows.map((row, rowIndex) => (
						<View key={rowIndex} style={styles.tableRow}>
							{cols.map((column) => {
								const value = row.original[column.id];
								const isDate = isDateValue(value);
								const show = removeDiacritics(
									isDate ? formatDateFull(new Date(value)) : value
								);
								return (
									<Text
										key={column.id}
										style={[styles.tableCell, { width: columnWidth }]}
									>
										{show}
									</Text>
								);
							})}
						</View>
					))}
				</View>
				<View fixed>
					<Text
						style={styles.footer}
						render={({ pageNumber, totalPages }) =>
							`Pagina ${pageNumber} / ${totalPages}`
						}
					/>
				</View>
			</Page>
		</Document>
	);
};

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		padding: 10,
	},
	logo: {
		height: 80,
		width: 164,
	},
	generatedOn: {
		position: "absolute",
		top: 10,
		right: 10,
		fontSize: 10,
		textAlign: "right",
	},
	header: {
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
	},
	title: {
		fontSize: 18,
		marginBottom: 5,
	},
	tableContainer: {
		flex: 1,
		width: "100%",
		marginVertical: 5,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "red",
		borderWidth: 1,
		borderColor: "#000",
	},
	tableHeaderCell: {
		display: "flex",
		padding: 5,
		fontSize: 12,
		color: "white",
		fontWeight: "semibold",
		textAlign: "center",
		borderRightWidth: 1,
		borderColor: "#000",
		alignItems: "center",
		justifyContent: "center",
	},
	tableRow: {
		flexDirection: "row",
		justifyContent: "center",
		borderLeftWidth: 1,
		borderRightWidth: 2,
		borderBottomWidth: 1,
		borderColor: "#000",
	},
	tableCell: {
		padding: 4,
		fontSize: 10,
		textAlign: "center",
		textOverflow: "ellipsis",
		borderRightWidth: 1,
		borderColor: "#000",
	},
	footer: {
		fontSize: 13,
		fontWeight: "semibold",
		marginTop: 5,
		marginBottom: 5,
		textAlign: "center",
	},
});
