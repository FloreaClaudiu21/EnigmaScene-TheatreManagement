/* eslint-disable jsx-a11y/alt-text */
"use client";
import { formateazaDataComplet } from "@/lib/intervaleOptiuni";
import {
	capitalizeazaPrima,
	eliminaDiacritice,
	esteValoareData,
	normalizeazaString,
	randuriSiColoaneValide,
} from "@/lib/metodeUtile";
import { ModalRaport } from "@/services/general/FurnizorStare";
import {
	Document,
	Page,
	View,
	Text,
	Image,
	StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: {
		padding: 15,
		flexDirection: "column",
		backgroundColor: "#f0f0f0",
	},
	header: {
		gap: 2,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 20,
		borderBottom: 2,
		borderColor: "black",
		paddingBottom: 10,
	},
	logo: {
		width: 100,
		height: 50,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
	},
	tableContainer: {
		flex: 1,
		border: 1,
		borderRadius: 4,
		borderColor: "red",
		marginBottom: 20,
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "red",
		borderRadius: 4,
		borderBottom: 1,
		borderColor: "black",
		padding: 5,
	},
	tableHeaderCell: {
		flex: 1,
		color: "white",
		fontSize: 13,
		fontWeight: "bold",
		textAlign: "center",
	},
	tableRow: {
		flexDirection: "row",
		borderBottom: 1,
		borderColor: "black",
		padding: 5,
	},
	tableCell: {
		flex: 1,
		fontSize: 12,
		textAlign: "center",
	},
	footer: {
		fontSize: 12,
		textAlign: "center",
		marginTop: 10,
		paddingTop: 10,
		borderTop: 1,
		borderColor: "black",
	},
});

export const RaportHartie = ({
	titlu,
	raportModal,
}: {
	titlu: string;
	raportModal: ModalRaport;
}) => {
	const { randuri, coloane } = randuriSiColoaneValide(raportModal);
	return (
		<Document
			title={titlu}
			subject="Raport"
			author="EnigmaScene"
			creationDate={new Date()}
		>
			<Page size="A4" style={styles.page} orientation="landscape">
				<View style={styles.header}>
					<View
						style={{
							gap: 6,
							width: "100%",
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<Image
							src={"https://i.imgur.com/QJCzXqh.png"}
							style={styles.logo}
						/>
						<View style={{ flex: 1 }}>
							<Text>Enigma Scene</Text>
							<Text style={{ fontSize: 12 }}>
								Municipiul Bucuresti, Sector 2, Bulevardul Imaginatiei nr. 123,
								Romania
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 10, color: "gray" }}>
								Generat Pe:{" "}
								{normalizeazaString(formateazaDataComplet(new Date()))}
							</Text>
							<Text style={{ fontSize: 10, color: "gray" }}>
								Generat De: floreaclaudiu128@gmail.com
							</Text>
						</View>
					</View>
					<View>
						<Text style={styles.title}>{titlu}</Text>
					</View>
				</View>
				<View style={styles.tableContainer}>
					<View style={styles.tableHeader}>
						{coloane.map((column) => (
							<Text key={column.id} style={styles.tableHeaderCell}>
								{capitalizeazaPrima(column.column.id)}
							</Text>
						))}
					</View>
					{randuri.map((row, rowIndex) => (
						<View key={rowIndex} style={styles.tableRow}>
							{coloane.map((column) => {
								const value = row.original[column.id];
								const isDate = esteValoareData(value);
								const show = eliminaDiacritice(
									isDate ? formateazaDataComplet(new Date(value)) : value
								);
								return (
									<Text key={column.id} style={styles.tableCell}>
										{show}
									</Text>
								);
							})}
						</View>
					))}
				</View>
				<View
					style={styles.footer}
					render={({ pageNumber, subPageNumber }) =>
						`Pagina ${pageNumber} / ${subPageNumber}`
					}
				/>
			</Page>
		</Document>
	);
};
