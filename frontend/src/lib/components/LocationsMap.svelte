<script>
	import 'leaflet/dist/leaflet.css';
	import { onDestroy, onMount } from 'svelte';

	// `groups` - hər biri bir şəhəri təmsil edən marker: { label, lat, lng, items: [{ name, address }] }.
	// Konkret xəstəxana ünvanları üçün dəqiq koordinat mənbəyi yoxdur, ona görə
	// hər şəhər üçün tək bir mərkəzi marker qoyulur - içindəki siyahıda o
	// şəhərdəki bütün mərkəzlər sadalanır (yanlış "dəqiq" pin göstərməkdənsə).
	let { groups = [] } = $props();

	let container;
	let map;

	onMount(async () => {
		const L = (await import('leaflet')).default;

		map = L.map(container, {
			center: [40.15, 47.5],
			zoom: 6,
			scrollWheelZoom: false,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
			maxZoom: 18,
		}).addTo(map);

		const icon = L.divIcon({
			className: '',
			html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#c41e3a;border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,.45);"></span>',
			iconSize: [14, 14],
			iconAnchor: [7, 7],
			popupAnchor: [0, -8],
		});

		for (const group of groups) {
			const items = group.items
				.map((it) => `<li style="margin-bottom:4px;"><strong>${it.name}</strong><br><span style="color:#71717a;">${it.address}</span></li>`)
				.join('');
			L.marker([group.lat, group.lng], { icon })
				.addTo(map)
				.bindPopup(
					`<div style="font-size:13px;line-height:1.4;"><p style="font-weight:600;margin:0 0 6px;">${group.label}</p><ul style="padding-left:16px;margin:0;">${items}</ul></div>`
				);
		}
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<div bind:this={container} class="h-80 w-full rounded-xl border border-border [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-xl [&_.leaflet-container]:font-sans"></div>

<style>
	/* Qaranlıq temada xəritə kaşılarını (tile) tərsinə çevirib uyğunlaşdırırıq -
	   ayrıca qaranlıq tile provayderi/açar tələb etmədən işlək bir nəticə verir. */
	:global(.dark) :global(.leaflet-tile-pane) {
		filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
	}
	:global(.dark) :global(.leaflet-popup-content-wrapper),
	:global(.dark) :global(.leaflet-popup-tip) {
		background: #18181b;
		color: #e4e4e7;
	}
</style>
