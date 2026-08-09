<script>
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import BrandLogo from '$lib/components/BrandLogo.svelte';
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

<div class="flex min-h-screen items-center justify-center bg-background px-4 py-10">
	<div class="w-full max-w-[440px] rounded-lg border border-border bg-card p-10 sm:p-12">
		<BrandLogo class="mb-8" />
		<h1 class="mb-8 text-2xl font-semibold text-foreground">{m.login_title()}</h1>

		{#if error}
			<div class="mb-5 rounded-md border border-destructive/30 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</div>
		{/if}

		<form onsubmit={handleSubmit} class="mb-6 flex flex-col gap-5">
			<div class="flex flex-col gap-1.5">
				<Label for="email">{m.login_email()}</Label>
				<Input id="email" type="email" name="email" placeholder="ad@example.com" bind:value={form.email} required />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="password">{m.login_password()}</Label>
				<Input id="password" type="password" name="password" placeholder="••••••••" bind:value={form.password} required />
			</div>
			<Button type="submit" size="lg" class="w-full justify-center" disabled={loading}>
				{loading ? m.login_loading() : m.login_btn()}
			</Button>
		</form>

		<p class="text-center text-sm text-muted-foreground">
			{m.login_switch()}
			<a href="/signup" class="font-semibold text-primary hover:underline">{m.login_switchLink()}</a>
		</p>
	</div>
</div>
