<script>
	import Save from '@lucide/svelte/icons/save';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import { goto, invalidateAll } from '$app/navigation';
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

	let confirmingDelete = $state(false);
	let deleting = $state(false);
	let deleteError = $state('');

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

	async function handleDeleteAccount() {
		deleteError = '';
		deleting = true;
		try {
			await api.delete('/api/me');
			await api.post('/api/logout');
			await goto('/', { invalidateAll: true });
		} catch (err) {
			deleteError = err instanceof ApiError ? err.message : m.dashboard_deleteError();
			deleting = false;
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

	<div class="mt-8 border-t border-border pt-6">
		<button
			type="button"
			onclick={() => (confirmingDelete = true)}
			class="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-6 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
		>
			<Trash2 class="size-4" aria-hidden="true" />
			{m.dashboard_deleteAccount()}
		</button>
	</div>
</div>

{#if confirmingDelete}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<div class="absolute inset-0 bg-foreground/40" onclick={() => !deleting && (confirmingDelete = false)} aria-hidden="true"></div>

		<div class="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
			<button
				type="button"
				onclick={() => (confirmingDelete = false)}
				disabled={deleting}
				aria-label={m.createRequest_cancel()}
				class="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
			>
				<X class="size-4" aria-hidden="true" />
			</button>

			<h3 class="mb-2 text-center text-base font-semibold text-foreground">{m.dashboard_deleteAccount()}</h3>
			<p class="mb-5 text-center text-sm leading-relaxed text-muted-foreground">{m.dashboard_deleteAccountWarning()}</p>

			{#if deleteError}
				<p class="mb-4 text-center text-sm text-destructive">{deleteError}</p>
			{/if}

			<div class="flex gap-3">
				<Button type="button" variant="destructive" size="sm" class="flex-1 justify-center" onclick={handleDeleteAccount} disabled={deleting}>
					{deleting ? m.dashboard_saving() : m.dashboard_deleteAccountConfirm()}
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					class="flex-1 justify-center hover:bg-transparent hover:border-primary hover:text-primary"
					onclick={() => (confirmingDelete = false)}
					disabled={deleting}
				>
					{m.createRequest_cancel()}
				</Button>
			</div>
		</div>
	</div>
{/if}
