<script>
	import Save from '@lucide/svelte/icons/save';
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Input, Label, Textarea } from '$lib/components/ui';
	import { ApiError, api } from '$lib/api';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';
	import { isValidPhone } from '$lib/utils';

	// Profil redaktə formu - dashboard-un sol sidebar-ındakı profil bloku
	// bura yönləndirir (/dashboard?panel=profile).
	let { user, onSuccess } = $props();

	let form = $state({
		full_name: user?.full_name || '',
		blood_type: user?.blood_type || '',
		city: user?.city || '',
		phone: user?.phone || '',
		last_donation_date: user?.last_donation_date || '',
		bio: user?.bio || '',
		is_available: Boolean(user?.is_available)
	});
	let error = $state('');
	let saving = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		if (!form.blood_type) {
			error = m.dashboard_bloodTypeRequired();
			return;
		}
		if (!form.city) {
			error = m.dashboard_cityRequired();
			return;
		}
		if (form.phone && !isValidPhone(form.phone)) {
			error = m.signup_invalidPhone();
			return;
		}
		saving = true;
		try {
			const data = await api.put('/api/me', {
				full_name: form.full_name,
				blood_type: form.blood_type,
				city: form.city,
				phone: form.phone,
				last_donation_date: form.last_donation_date || null,
				bio: form.bio || null,
				is_available: form.is_available
			});
			// `user` `+layout.server.js`-dən gəlir - `invalidateAll` sidebar-dakı
			// ad/vəziyyəti də dərhal yeniləyir.
			await invalidateAll();
			onSuccess?.(data.user);
		} catch (err) {
			error = err instanceof ApiError ? err.message : m.dashboard_updateError();
		} finally {
			saving = false;
		}
	}
</script>

<div>
	{#if error}
		<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
	{/if}

	<form class="grid grid-cols-1 gap-5 sm:grid-cols-2" onsubmit={handleSubmit}>
		<div class="col-span-full flex flex-col gap-1.5">
			<Label for="full_name">{m.dashboard_fullName()}</Label>
			<Input id="full_name" name="full_name" bind:value={form.full_name} />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="blood_type">{m.dashboard_bloodType()}</Label>
			<FilterSelect
				id="blood_type"
				variant="field"
				value={form.blood_type}
				onChange={(val) => (form.blood_type = val)}
				options={BLOOD_TYPES.map((b) => ({ value: b, label: b }))}
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="city">{m.dashboard_city()}</Label>
			<FilterSelect
				id="city"
				variant="field"
				value={form.city}
				onChange={(val) => (form.city = val)}
				options={CITIES.map((c) => ({ value: c, label: c }))}
			/>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="phone">{m.dashboard_phone()}</Label>
			<Input id="phone" name="phone" bind:value={form.phone} />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="last_donation_date">{m.dashboard_lastDonation()}</Label>
			<Input id="last_donation_date" name="last_donation_date" type="date" bind:value={form.last_donation_date} />
		</div>

		<div class="col-span-full flex items-center justify-between rounded-md border border-input px-3.5 py-2.5">
			<Label for="is_available" class="cursor-pointer">{m.dashboard_available()}</Label>
			<input id="is_available" name="is_available" type="checkbox" class="size-4 accent-primary" bind:checked={form.is_available} />
		</div>

		<div class="col-span-full flex flex-col gap-1.5">
			<Label for="bio">{m.dashboard_bio()}</Label>
			<Textarea id="bio" name="bio" rows="3" bind:value={form.bio} />
		</div>

		<Button type="submit" size="lg" class="col-span-full w-full justify-center" disabled={saving}>
			<Save aria-hidden="true" />
			{saving ? m.dashboard_saving() : m.dashboard_save()}
		</Button>
	</form>
</div>
