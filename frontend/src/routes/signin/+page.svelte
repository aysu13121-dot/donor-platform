<script>
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import AuthShell from '$lib/components/AuthShell.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { Input, Label } from '$lib/components/ui';
	import { ApiError, api } from '$lib/api';

	let form = $state({ email: '', password: '' });
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		error = '';
		loading = true;
		try {
			await api.post('/api/signin', form);
			// Cookie backend tərəfindən artıq qoyulub - `invalidateAll` layout-un
			// `load()`-unu yenidən işə salır ki, `$page.data.user` təzələnsin.
			await goto('/dashboard', { invalidateAll: true });
		} catch (err) {
			error = err instanceof ApiError ? err.message : m.login_serverErr();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{m.login_title()} - Donor.az</title>
</svelte:head>

<AuthShell title={m.login_title()}>
	{#if error}
		<div class="mb-5 rounded-xl border border-primary/30 bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground" role="alert">{error}</div>
	{/if}

	<form onsubmit={handleSubmit} class="mb-6 flex flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<Label for="email">{m.login_email()}</Label>
			<Input id="email" type="email" name="email" autocomplete="email" placeholder="ad@example.com" bind:value={form.email} required />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="password">{m.login_password()}</Label>
			<Input id="password" type="password" name="password" autocomplete="current-password" placeholder="••••••••" bind:value={form.password} required />
		</div>
		<Button type="submit" size="lg" class="w-full justify-center" disabled={loading}>
			{loading ? m.login_loading() : m.login_btn()}
		</Button>
	</form>

	<p class="text-center text-sm text-muted-foreground">
		{m.login_switch()}
		<a href="/signup" class="font-bold text-primary hover:underline">{m.login_switchLink()}</a>
	</p>
</AuthShell>
