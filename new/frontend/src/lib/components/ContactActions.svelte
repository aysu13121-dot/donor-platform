<script>
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import Phone from '@lucide/svelte/icons/phone';
	import Button from '$lib/components/ui/Button.svelte';
	import { cn } from '$lib/utils';

	// Zəng/WhatsApp əməliyyatları üçün tək paylaşılan komponent - donors və
	// requests səhifələri eyni əməliyyatları eyni stildə göstərir.
	//
	// `locked` - istifadəçi daxil olmayıbsa backend telefon nömrəsini heç
	// göndərmir. Görünüş normal Zəng/WhatsApp düymələri ilə eyni qalır
	// (layout sıçramasın deyə), amma hər ikisi tel:/wa.me əvəzinə birbaşa
	// /signup-a yönləndirir.
	let { phone, callLabel = 'Zəng et', whatsappLabel = 'WhatsApp', locked = false, class: className } = $props();

	let digits = $derived((phone || '').replace(/\D/g, ''));
</script>

<div class={cn('grid grid-cols-2 gap-2', className)}>
	{#if locked}
		<Button href="/signup" variant="outline" size="sm" class="w-full">
			<Phone aria-hidden="true" />{callLabel}
		</Button>
	{:else if phone}
		<Button href={`tel:${phone}`} variant="outline" size="sm" class="w-full">
			<Phone aria-hidden="true" />{callLabel}
		</Button>
	{:else}
		<Button variant="outline" size="sm" class="w-full opacity-50" disabled>
			<Phone aria-hidden="true" />{callLabel}
		</Button>
	{/if}

	{#if locked}
		<Button href="/signup" variant="outline" size="sm" class="w-full">
			<MessageCircle aria-hidden="true" />{whatsappLabel}
		</Button>
	{:else if digits}
		<Button href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" variant="outline" size="sm" class="w-full">
			<MessageCircle aria-hidden="true" />{whatsappLabel}
		</Button>
	{:else}
		<Button variant="outline" size="sm" class="w-full opacity-50" disabled>
			<MessageCircle aria-hidden="true" />{whatsappLabel}
		</Button>
	{/if}
</div>
