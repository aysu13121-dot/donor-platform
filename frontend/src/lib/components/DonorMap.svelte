<script>
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { CITY_COORDS } from '$lib/constants';

	// `cities` - [{ city, donors, urgent }]. Dairənin ölçüsü hazır donor sayına,
	// qırmızı nəbz isə həmin şəhərdə təcili sorğu olduğuna görədir.
	// Şəhərə klikləmək /donors?city=... səhifəsini açır.
	let { cities = [], donorsLabel = 'donors', urgentLabel = 'urgent' } = $props();

	let container;
	let map;

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(container, {
			center: [40.3, 47.7],
			zoom: 7,
			scrollWheelZoom: false,
			attributionControl: true
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
			maxZoom: 12
		}).addTo(map);

		const max = Math.max(1, ...cities.map((c) => c.donors));
		const points = [];

		for (const c of cities) {
			const pos = CITY_COORDS[c.city];
			if (!pos) continue;
			points.push(pos);

			const radius = c.donors > 0 ? 9 + 17 * Math.sqrt(c.donors / max) : 6;
			const circle = L.circleMarker(pos, {
				radius,
				color: '#c41e3a',
				weight: 2,
				fillColor: '#c41e3a',
				fillOpacity: c.donors > 0 ? 0.35 : 0.08
			}).addTo(map);

			const tip = `<strong>${c.city}</strong><br>${c.donors} ${donorsLabel}${c.urgent ? ` · ${c.urgent} ${urgentLabel}` : ''}`;
			circle.bindTooltip(tip, { direction: 'top', offset: [0, -radius] });
			circle.on('click', () => goto(`/donors?city=${encodeURIComponent(c.city)}`));

			if (c.urgent > 0) {
				const pulse = L.divIcon({
					className: '',
					html: '<span class="dm-pulse"><span></span></span>',
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				});
				L.marker(pos, { icon: pulse, interactive: false, keyboard: false }).addTo(map);
			}
		}

		if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 8 });
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div
	bind:this={container}
	class="isolate h-[22rem] w-full overflow-hidden rounded-2xl border border-border md:h-[26rem] [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:font-sans"
></div>

<style>
	:global(.dm-pulse) {
		position: relative;
		display: block;
		width: 16px;
		height: 16px;
	}
	:global(.dm-pulse span),
	:global(.dm-pulse::before) {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
	}
	:global(.dm-pulse span) {
		background: #c41e3a;
		border: 3px solid #fff;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
	}
	:global(.dm-pulse::before) {
		content: '';
		background: #c41e3a;
		animation: dm-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
	}
	@keyframes -global-dm-ping {
		75%,
		100% {
			transform: scale(2.6);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.dm-pulse::before) {
			animation: none;
		}
	}
	/* Qaranlıq temada xəritə kaşılarını tərsinə çeviririk (LocationsMap ilə eyni üsul). */
	:global(.dark) :global(.leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
	}
	:global(.dark) :global(.leaflet-tooltip) {
		background: #1e1317;
		color: #fbf3f4;
		border-color: #3a2830;
	}
</style>
