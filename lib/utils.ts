import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string): string {
	if (str.length === 0) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export const urlLink = (pathname: string) => {
	let start = "";
	const pathNames = pathname.split("/");
	if (pathNames.length <= 5) {
		start = "./";
	} else if (pathNames.length == 6) {
		start = "../";
	} else if (pathNames.length == 7) {
		start = "../../";
	} else if (pathNames.length == 8) {
		start = "../../../";
	} else {
		start = "../../../../";
	}
	return start + "dashboard/";
};

export const homeUrl = (pathname: string) => {
	const pathNames = pathname.split("/");
	if (pathNames.length <= 5) {
		return "../../";
	} else if (pathNames.length == 6) {
		return "../../../";
	} else if (pathNames.length == 7) {
		return "../../../../";
	} else if (pathNames.length == 8) {
		return "../../../../../";
	} else {
		return "../../../../../../";
	}
};

export function isNumeric(num: any){
  return !isNaN(num)
}

export function getRandomNumber(max: number): number {
	return Math.floor(Math.random() * (max - 0 + 1)) + 0;
}

export function getRandomElement<T>(array: T[]): T {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export const getRandomSpecification = (): boolean => Math.random() < 0.5;

/*
export const getRandomFeatures = (): CarFeatures[] => {
	const numberOfFeatures = Math.floor(
		Math.random() * (carFeaturesList.length + 1)
	);
	const shuffledFeatures = carFeaturesList.toSorted(() => Math.random() - 0.5);
	return shuffledFeatures.slice(0, numberOfFeatures);
};

export const manufacturers = (carBrands: CarBrand[]) => {
	const manu: string[] = [];
	carBrands.map((v: CarBrand) => {
		if (!manu.includes(v.manufacturer)) {
			manu.push(v.manufacturer);
		}
	});
	return manu;
};
export const models = (filters: SelectedFilters, carBrands: CarBrand[]) => {
	const mod: string[] = [];
	if (filters.models.length > 0) {
		filters.models.map((v) => {
			mod.push(v.split(" ")[1]);
		});
	} else {
		carBrands.map((v: CarBrand) => {
			const name = v.model;
			if (!mod.includes(name)) {
				mod.push(name);
			}
		});
	}
	return mod;
};
export const categories = (filters: SelectedFilters, carBrands: CarBrand[]) => {
	const mod: CarCategory[] = [];
	if (filters.categories.length > 0) {
		filters.categories.map((v: string) => {
			mod.push(CarCategory[v as keyof typeof CarCategory]);
		});
	} else {
		carBrands.map((v: CarBrand) => {
			const name = v.category;
			if (!mod.includes(name)) {
				mod.push(name);
			}
		});
	}
	return mod;
};
export const fuelTypes = (filters: SelectedFilters, carBrands: CarBrand[]) => {
	const mod: FuelType[] = [];
	if (filters.fuelTypes.length > 0) {
		filters.fuelTypes.map((v: string) => {
			mod.push(FuelType[v as keyof typeof FuelType]);
		});
	} else {
		carBrands.map((v: CarBrand) => {
			const name = v.fuelType;
			if (!mod.includes(name)) {
				mod.push(name);
			}
		});
	}
	return mod;
};
export const transmissionTypes = (filters: SelectedFilters, carBrands: CarBrand[]) => {
	const mod: TransmissionType[] = [];
	if (filters.transmissions.length > 0) {
		filters.transmissions.map((v: string) => {
			mod.push(TransmissionType[v as keyof typeof TransmissionType]);
		});
	} else {
		carBrands.map((v: CarBrand) => {
			const name = v.transmissionType;
			if (!mod.includes(name)) {
				mod.push(name);
			}
		});
	}
	return mod;
};
export const locTypesList = (filters: SelectedFilters, locTypes: LocationType[]) => {
	const mod: string[] = [];
	if (filters.locationType.length > 0) {
		filters.locationType.map((v) => {
			mod.push(v);
		});
	} else {
		locTypes.map((v) => {
			mod.push(v.name);
		});
	}
	return mod;
};
export const fuelPolicyList = (filters: SelectedFilters, fuelPolicy: FuelPolicy[]) => {
	const mod: string[] = [];
	if (filters.fuelPolicy.length > 0) {
		filters.fuelPolicy.map((v) => {
			mod.push(v);
		});
	} else {
		fuelPolicy.map((v) => {
			mod.push(v.name);
		});
	}
	return mod;
};
export const doorsNrGreater = (value: string) => {
	if (value === "2 doors" || value ==="2 usi") {
		return 2;
	} else if (value === "4 doors" || value === "4 usi") {
		return 4;
	} else if (value === "6 doors" || value === "6 usi") {
		return 6;
	}
};
export const seatsNrGreater = (value: string) => {
	if (value === "4 seats" || value === "4 locuri") {
		return 4;
	} else if (value === "5 seats" || value === "5 locuri") {
		return 5;
	} else if (value === "6 seats" || value === "6 locuri") {
		return 6;
	}
};
export const specs = (filters: SelectedFilters) => {
	const mod: CarFeatures[] = [];
	if (filters.specs.length > 0) {
		filters.specs.map((v) => {
			mod.push(
				CarFeatures[
					v.toUpperCase().replaceAll(" ", "_") as keyof typeof CarFeatures
				]
			);
		});
	} else {
		return carFeaturesList;
	}
	return mod;
};

export const calculateAverageScore = (ratings: CarRating[] | undefined): number => {
  if (!ratings || ratings.length === 0) {
    return 0;
  }
  const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  const averageScore = totalStars / ratings.length;
  const scaledScore = (averageScore / 5) * 10;
  return Math.min(Math.max(scaledScore, 1), 10);
};

export  const filterCarsByRating = (filters: any, filteredCars: any, car: Car, averageScore: number, minScore: number): void => {
  if (filters.ratings && averageScore >= minScore) {
    filteredCars.push(car);
  }
};

export const parseRentalDetails = (val: string) => {
	const currentDate = new Date();
	const nextDay = new Date(currentDate);
	nextDay.setMonth(currentDate.getMonth());
	nextDay.setDate(currentDate.getDate() + 1);
	const parsedDetails = JSON.parse(val) as RentalDetails;
	const isPickupTimeOlder =
				parsedDetails.pickUpDate &&
				new Date(parsedDetails.pickUpDate) < currentDate;
	const isDropOffTimeOlder =
				parsedDetails.dropOffDate &&
				new Date(parsedDetails.dropOffDate) < currentDate;
	return {
		pickupLoc: parsedDetails.pickupLoc,
					dropOffLoc: parsedDetails.dropOffLoc,
					pickUpTime: parsedDetails.pickUpTime,
					dropOffTime: parsedDetails.dropOffTime,
					pickUpDate:
						isPickupTimeOlder || isDropOffTimeOlder
							? currentDate.toDateString()
							: new Date(parsedDetails.pickUpDate).toDateString(),
					dropOffDate:
						isPickupTimeOlder || isDropOffTimeOlder
							? nextDay.toDateString()
							: new Date(parsedDetails.dropOffDate).toDateString(),
	}
}

export const daysDiff = (start: Date, end: Date) => {
	const timeDiff = end.getTime() - start.getTime();
	const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return daysDiff;
}

export const hoursDiff = (start: Date, end: Date) => {
	const timeDiff = end.getTime() - start.getTime();
	const hoursDiff = Math.ceil(timeDiff / (1000 * 60 * 60));
	return hoursDiff;
};
*/