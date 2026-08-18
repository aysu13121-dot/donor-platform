<script>
	import Lock from '@lucide/svelte/icons/lock';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Phone from '@lucide/svelte/icons/phone';
	import Button from '$lib/components/ui/Button.svelte';
	import { cn } from '$lib/utils';

	let {
		phone,
		callLabel = 'Zəng et',
		whatsappLabel = 'WhatsApp',
		locked = false,
		class: className
	} = $props();

	let digits = $derived((phone || '').replace(/\D/g, ''));
</script>

{#if locked}
	<div class={cn('flex flex-col gap-2', className)}>
		<a
			href="/signin"
			class="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
		>
			<Lock class="size-3.5 shrink-0" aria-hidden="true" />
			Əlaqə üçün daxil ol
		</a>
	</div>
{:else}
	<div class={cn('grid grid-cols-2 gap-2', className)}>
		{#if phone}
			<Button href="tel:{phone}" variant="outline" size="sm" class="w-full">
				<Phone aria-hidden="true" />{callLabel}
			</Button>
		{:else}
			<Button variant="outline" size="sm" class="w-full opacity-40" disabled>
				<Phone aria-hidden="true" />{callLabel}
			</Button>
		{/if}

		{#if digits}
			<Button
				href="https://wa.me/{digits}"
				target="_blank"
				rel="noreferrer"
				variant="outline"
				size="sm"
				class="w-full"
			>
				<MessageCircle aria-hidden="true" />{whatsappLabel}
			</Button>
		{:else}
			<Button variant="outline" size="sm" class="w-full opacity-40" disabled>
				<MessageCircle aria-hidden="true" />{whatsappLabel}
			</Button>
		{/if}
	</div>
{/if}
