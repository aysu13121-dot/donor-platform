// Render-in pulsuz planında API 15 dəqiqə boş qalanda yatır. Oyanana qədər
// (1-2 dəqiqə) Render özü JSON yox, düz mətn "Too Many Requests" (429) və ya
// 502/503 qaytarır. Belə cavab gəldikdə bir az gözləyib yenidən cəhd edirik ki,
// istifadəçi "xəta" görməsin. Flask-ın öz JSON cavablarına toxunmuruq.
const WAKE_STATUSES = new Set([429, 502, 503, 504]);

function isWakeResponse(res) {
	if (!WAKE_STATUSES.has(res.status)) return false;
	const type = res.headers.get('content-type') || '';
	return !type.includes('application/json');
}

export async function fetchWithWake(fetchFn, url, init, { tries = 8, delayMs = 4000 } = {}) {
	let res;
	for (let i = 0; i < tries; i++) {
		res = await fetchFn(url, init);
		if (!isWakeResponse(res) || i === tries - 1) return res;
		await res.arrayBuffer().catch(() => null);
		await new Promise((r) => setTimeout(r, delayMs));
	}
	return res;
}
