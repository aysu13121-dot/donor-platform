<script>
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import AuthShell from '$lib/components/AuthShell.svelte';
	import BloodTypePills from '$lib/components/BloodTypePills.svelte';
	import FilterSelect from '$lib/components/FilterSelect.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Input, Label } from '$lib/components/ui';
	import { ApiError, api } from '$lib/api';
	import { CITIES } from '$lib/constants';
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

<svelte:head>
	<title>{m.signup_title()} - Donor.az</title>
</svelte:head>

<AuthShell title={m.signup_title()} wide>
	{#if error}
		<div class="mb-5 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground" role="alert">{error}</div>
	{/if}

	<form onsubmit={handleSubmit} class="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
		<div class="flex flex-col gap-1.5">
			<Label for="full_name">{m.signup_fullName()}</Label>
			<Input id="full_name" type="text" name="full_name" autocomplete="name" placeholder={m.signup_fullNamePlaceholder()} bind:value={form.full_name} required />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="email">{m.signup_email()}</Label>
			<Input id="email" type="email" name="email" autocomplete="email" placeholder="ad@example.com" bind:value={form.email} required />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="password">{m.signup_password()}</Label>
			<Input id="password" type="password" name="password" autocomplete="new-password" placeholder="••••••••" bind:value={form.password} required />
			<p class="text-xs text-muted-foreground">{m.signup_passwordHint()}</p>
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="phone">{m.signup_phone()}</Label>
			<Input id="phone" type="tel" name="phone" autocomplete="tel" placeholder="+994 XX XXX XX XX" bind:value={form.phone} required />
		</div>
		<div class="col-span-full flex flex-col gap-2">
			<span class="text-sm font-medium text-foreground">{m.signup_bloodType()}</span>
			<BloodTypePills value={form.blood_type} showAll={false} onChange={(val) => (form.blood_type = val)} />
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
		<a href="/signin" class="font-bold text-primary hover:underline">{m.signup_switchLink()}</a>
	</p>
</AuthShell>
