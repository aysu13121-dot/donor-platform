<script>
	import * as m from '$lib/paraglide/messages.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const QUESTIONS = [
		{ key: 'age',     label: m.eligibility_q1, disqualifyIf: false, reason: m.eligibility_reason_age },
		{ key: 'weight',  label: m.eligibility_q2, disqualifyIf: false, reason: m.eligibility_reason_weight },
		{ key: 'recent',  label: m.eligibility_q3, disqualifyIf: true,  reason: m.eligibility_reason_recent },
		{ key: 'alcohol', label: m.eligibility_q4, disqualifyIf: true,  reason: m.eligibility_reason_alcohol },
		{ key: 'chronic', label: m.eligibility_q5, disqualifyIf: true,  reason: m.eligibility_reason_chronic },
		{ key: 'surgery', label: m.eligibility_q6, disqualifyIf: true,  reason: m.eligibility_reason_surgery },
	];

	let answers = $state({});
	let result = $state(null);

	function check() {
		for (const q of QUESTIONS) {
			const ans = answers[q.key];
			if (ans === undefined) return;
			if (q.disqualifyIf === true && ans === true) {
				result = { eligible: false, reason: q.reason() };
				return;
			}
			if (q.disqualifyIf === false && ans === false) {
				result = { eligible: false, reason: q.reason() };
				return;
			}
		}
		result = { eligible: true };
	}

	function reset() {
		answers = {};
		result = null;
	}

	let allAnswered = $derived(QUESTIONS.every(q => answers[q.key] !== undefined));
</script>

<svelte:head>
	<title>{m.eligibility_title()} — Donor.az</title>
</svelte:head>

<Navbar />

<main class="mx-auto max-w-2xl px-6 py-16">

	<div class="mb-12 text-center">
		<h1 class="mb-3 text-3xl font-semibold text-foreground">{m.eligibility_title()}</h1>
		<p class="text-sm text-muted-foreground">{m.eligibility_sub()}</p>
	</div>

	{#if !result}
		<div class="space-y-3">
			{#each QUESTIONS as q}
				<div class="rounded-xl border border-border bg-card px-6 py-5">
					<p class="mb-4 text-sm font-medium text-foreground">{q.label()}</p>
					<div class="flex gap-3">
						<button
							type="button"
							onclick={() => (answers[q.key] = true)}
							class="rounded-lg border px-5 py-2 text-sm font-medium transition-colors
								{answers[q.key] === true
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border bg-secondary text-foreground hover:border-primary hover:text-primary'}"
						>
							{m.eligibility_yes_label()}
						</button>
						<button
							type="button"
							onclick={() => (answers[q.key] = false)}
							class="rounded-lg border px-5 py-2 text-sm font-medium transition-colors
								{answers[q.key] === false
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border bg-secondary text-foreground hover:border-primary hover:text-primary'}"
						>
							{m.eligibility_no_label()}
						</button>
					</div>
				</div>
			{/each}

			<button
				type="button"
				onclick={check}
				disabled={!allAnswered}
				class="mt-2 w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-40"
			>
				{m.eligibility_check()}
			</button>
		</div>

		<p class="mt-6 text-center text-xs text-muted-foreground">{m.eligibility_disclaimer()}</p>

	{:else if result.eligible}
		<div class="rounded-xl border border-primary/30 bg-primary/5 p-10 text-center">
			<div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-2xl">✅</div>
			<h2 class="mb-2 text-lg font-semibold text-foreground">{m.eligibility_yes()}</h2>
			<p class="mb-6 text-sm text-muted-foreground">{m.eligibility_yes_desc()}</p>
			<div class="flex flex-wrap justify-center gap-3">
				<Button href="/locations">{m.footer_locations()}</Button>
				<button type="button" onclick={reset} class="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
					Yenidən yoxla
				</button>
			</div>
		</div>

	{:else}
		<div class="rounded-xl border border-border bg-card p-10 text-center">
			<div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-secondary text-2xl">⚠️</div>
			<h2 class="mb-2 text-lg font-semibold text-foreground">{m.eligibility_no()}</h2>
			<p class="mb-2 text-sm text-muted-foreground">{m.eligibility_no_desc()}</p>
			<p class="mb-6 text-sm font-medium text-primary">{result.reason}</p>
			<button type="button" onclick={reset} class="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
				Yenidən yoxla
			</button>
		</div>
	{/if}

</main>
