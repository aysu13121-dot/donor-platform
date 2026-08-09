// Tətbiq boyu təkrarlanan sabitlər tək yerdə.
export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki'];

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
