<script>
	import Send from '@lucide/svelte/icons/send';
	import * as m from '$lib/paraglide/messages.js';
	import Button from '$lib/components/ui/Button.svelte';
	import { Input, Label, Select, Textarea } from '$lib/components/ui';
	import { ApiError, api } from '$lib/api';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';
	import { isValidPhone } from '$lib/utils';

	// Sorğu yaratma formu - dashboard-un `?panel=create` panelində istifadə
	// olunur.
	let { onSuccess, onCancel, submitLabel } = $props();

	let form = $state({
		patient_name: '',
		blood_type: '',
		hospital: '',
		city: '',
		units_needed: 1,
		urgency: 'Urgent',
		contact_phone: '',
		note: ''
	});
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		if (!isValidPhone(form.contact_phone)) {
			error = m.signup_invalidPhone();
			return;
		}
		loading = true;
		try {
			const data = await api.post('/api/requests', {
				...form,
				units_needed: Number(form.units_needed) || 1,
				note: form.note.trim() || null
			});
			onSuccess?.(data.request);
		} catch (err) {
			error = err instanceof ApiError ? err.message : m.createRequest_error();
		} finally {
			loading = false;
		}
	}
</script>

<div>
	{#if error}
		<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
	{/if}

	<form class="grid grid-cols-1 gap-4 sm:grid-cols-2" onsubmit={handleSubmit}>
		<div class="flex flex-col gap-1.5">
			<Label for="patient_name">{m.createRequest_patientName()}</Label>
			<Input id="patient_name" name="patient_name" bind:value={form.patient_name} required />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="blood_type">{m.createRequest_bloodType()}</Label>
			<Select id="blood_type" name="blood_type" bind:value={form.blood_type} required>
				<option value="">{m.createRequest_select()}</option>
				{#each BLOOD_TYPES as type (type)}
					<option value={type}>{type}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="hospital">{m.createRequest_hospital()}</Label>
			<Input id="hospital" name="hospital" bind:value={form.hospital} required />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="city">{m.createRequest_city()}</Label>
			<Select id="city" name="city" bind:value={form.city} required>
				<option value="">{m.createRequest_select()}</option>
				{#each CITIES as item (item)}
					<option value={item}>{item}</option>
				{/each}
			</Select>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="units_needed">{m.createRequest_unitsNeeded()}</Label>
			<Input id="units_needed" name="units_needed" type="number" min="1" bind:value={form.units_needed} required />
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="urgency">{m.createRequest_urgency()}</Label>
			<Select id="urgency" name="urgency" bind:value={form.urgency} required>
				<option value="Urgent">{m.createRequest_urgent()}</option>
				<option value="Normal">{m.createRequest_normal()}</option>
			</Select>
		</div>

		<div class="flex flex-col gap-1.5">
			<Label for="contact_phone">{m.createRequest_contactPhone()}</Label>
			<Input id="contact_phone" name="contact_phone" bind:value={form.contact_phone} required />
		</div>

		<div class="col-span-full flex flex-col gap-1.5">
			<Label for="note">{m.createRequest_note()}</Label>
			<Textarea id="note" name="note" rows="3" bind:value={form.note} />
		</div>

		<div class="col-span-full flex gap-3">
			{#if onCancel}
				<Button type="button" variant="outline" size="lg" class="flex-1 justify-center" onclick={onCancel}>
					{m.createRequest_cancel()}
				</Button>
			{/if}
			<Button type="submit" size="lg" class={onCancel ? 'flex-1 justify-center' : 'w-full justify-center'} disabled={loading}>
				<Send aria-hidden="true" />
				{loading ? m.createRequest_loading() : submitLabel || m.createRequest_submit()}
			</Button>
		</div>
	</form>
</div>
