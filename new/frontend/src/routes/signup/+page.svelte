<script>
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Input, Label } from '$lib/components/ui';
	import { ApiError, api } from '$lib/api';
	import { BLOOD_TYPES, CITIES } from '$lib/constants';
	import { isValidPhone } from '$lib/utils';

	let form = $state({ full_name: '', email: '', password: '', blood_type: '', city: '', phone: '' });
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		if (!form.blood_type || !form.city || !form.phone) {
			error = m.signup_requiredError();
			return;
		}
		if (!isValidPhone(form.phone)) {
			error = m.signup_invalidPhone();
			return;
		}
		if (form.password.length < 4) {
			error = m.signup_passwordHint();
			return;
		}
		loading = true;
		try {
			await api.post('/api/signup', form);
			await goto('/dashboard', { invalidateAll: true });
		} catch (err) {
			error = err instanceof ApiError ? err.message : m.signup_serverErr();
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-10">
	<div class="w-full max-w-[600px] rounded-lg border border-border bg-card p-10 sm:p-12">
		<BrandLogo class="mb-8" />
		<h1 class="mb-8 text-2xl font-semibold text-foreground">{m.signup_title()}</h1>

		{#if error}
			<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
		{/if}

		<form onsubmit={handleSubmit} class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<Label for="full_name">{m.signup_fullName()}</Label>
				<Input id="full_name" type="text" name="full_name" placeholder={m.signup_fullNamePlaceholder()} bind:value={form.full_name} required />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="email">{m.signup_email()}</Label>
				<Input id="email" type="email" name="email" placeholder="ad@example.com" bind:value={form.email} required />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="password">{m.signup_password()}</Label>
				<Input id="password" type="password" name="password" placeholder="••••••••" bind:value={form.password} required />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="phone">{m.signup_phone()}</Label>
				<Input id="phone" type="tel" name="phone" placeholder="+994 XX XXX XX XX" bind:value={form.phone} required />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="blood_type">{m.signup_bloodType()}</Label>
				<FilterSelect
					id="blood_type"
					variant="field"
					value={form.blood_type}
					onChange={(val) => (form.blood_type = val)}
					options={[{ value: '', label: m.signup_select() }, ...BLOOD_TYPES.map((bt) => ({ value: bt, label: bt }))]}
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="city">{m.signup_city()}</Label>
				<FilterSelect
					id="city"
					variant="field"
					value={form.city}
					onChange={(val) => (form.city = val)}
					options={[{ value: '', label: m.signup_select() }, ...CITIES.map((c) => ({ value: c, label: c }))]}
				/>
			</div>
			<Button type="submit" size="lg" class="col-span-full w-full justify-center" disabled={loading}>
				{loading ? m.signup_loading() : m.signup_btn()}
			</Button>
		</form>

		<p class="text-center text-sm text-muted-foreground">
			{m.signup_switch()}
			<a href="/signin" class="font-semibold text-primary hover:underline">{m.signup_switchLink()}</a>
		</p>
	</div>
</div>
