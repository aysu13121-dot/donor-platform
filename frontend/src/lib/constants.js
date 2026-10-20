// Tətbiq boyu təkrarlanan sabitlər tək yerdə.
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki'];

// Donor xəritəsi üçün şəhər mərkəzlərinin təxmini koordinatları [lat, lng].
export const CITY_COORDS = {
	Bakı: [40.4093, 49.8671],
	Gəncə: [40.6828, 46.3606],
	Sumqayıt: [40.5897, 49.6686],
	Mingəçevir: [40.7703, 47.0496],
	Naxçıvan: [39.2089, 45.4122],
	Şirvan: [39.9318, 48.9206],
	Lənkəran: [38.7543, 48.8506],
	Şəki: [41.1919, 47.1706]
};

// Landing səhifəsindəki qan-qrupu uyğunluq cədvəli. O- hamıya verə bilər,
// AB+ hamıdan ala bilər.
export function bloodCompatibility() {
	return [
		{ type: 'A+', gives: ['A+', 'AB+'], receives: ['A+', 'A-', 'O+', 'O-'] },
		{ type: 'A-', gives: ['A+', 'A-', 'AB+', 'AB-'], receives: ['A-', 'O-'] },
		{ type: 'B+', gives: ['B+', 'AB+'], receives: ['B+', 'B-', 'O+', 'O-'] },
		{ type: 'B-', gives: ['B+', 'B-', 'AB+', 'AB-'], receives: ['B-', 'O-'] },
		{ type: 'O+', gives: ['O+', 'A+', 'B+', 'AB+'], receives: ['O+', 'O-'] },
		{ type: 'O-', gives: BLOOD_TYPES, receives: ['O-'] },
		{ type: 'AB+', gives: ['AB+'], receives: BLOOD_TYPES },
		{ type: 'AB-', gives: ['AB+', 'AB-'], receives: ['AB-', 'A-', 'B-', 'O-'] }
	];
}
