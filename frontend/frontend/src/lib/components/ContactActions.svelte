<script>
	import Lock from '@lucide/svelte/icons/lock';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Phone from '@lucide/svelte/icons/phone';
	import * as m from '$lib/paraglide/messages.js';
	import Button from '$lib/components/ui/Button.svelte';
	import { cn } from '$lib/utils';

	// `message` verilsə WhatsApp həmin mətnlə açılır və düymə əsas (qırmızı) olur.
	let {
		phone,
		callLabel = 'Zəng et',
		whatsappLabel = 'WhatsApp',
		message = '',
		locked = false,
		class: className
	} = $props();

	let digits = $derived((phone || '').replace(/\D/g, ''));
	let waHref = $derived(`https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`);
</script>

{#if locked}
	<div class={cn('flex flex-col gap-2', className)}>
		<a
			href="/signin"
			class="flex items-center justify-center gap-2 rounded-full border-2 border-border bg-secondary/60 px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
		>
			<Lock class="size-3.5 shrink-0" aria-hidden="true" />
			{m.donors_loginToContact()}
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
				href={waHref}
				target="_blank"
				rel="noreferrer"
				variant={message ? 'primary' : 'outline'}
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
