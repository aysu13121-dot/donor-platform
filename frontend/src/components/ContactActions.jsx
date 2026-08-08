import { HeartHandshake, MessageCircle, Phone } from 'lucide-react';

import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Zəng/WhatsApp/Cavab ver əməliyyatları üçün tək paylaşılan bileşen -
// əvvəllər donors və requests səhifələri eyni əməliyyatları fərqli
// stillərlə əl ilə yazırdı, indi ikisi də buradan keçir.
export default function ContactActions({
  phone,
  callLabel = 'Zəng et',
  whatsappLabel = 'WhatsApp',
  onRespond,
  respondLabel,
  respondLoading = false,
  respondDisabled = false,
  className,
}) {
  const digits = (phone || '').replace(/\D/g, '');

  return (
    <div className={cn('grid gap-2', onRespond ? 'grid-cols-3' : 'grid-cols-2', className)}>
      {phone ? (
        <Button as="a" href={`tel:${phone}`} variant="outline" size="sm" className="w-full">
          <Phone aria-hidden="true" /> {callLabel}
        </Button>
      ) : (
        <Button as="span" variant="outline" size="sm" className="w-full pointer-events-none opacity-50">
          <Phone aria-hidden="true" /> {callLabel}
        </Button>
      )}

      {digits ? (
        <Button as="a" href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" variant="outline" size="sm" className="w-full">
          <MessageCircle aria-hidden="true" /> {whatsappLabel}
        </Button>
      ) : (
        <Button as="span" variant="outline" size="sm" className="w-full pointer-events-none opacity-50">
          <MessageCircle aria-hidden="true" /> {whatsappLabel}
        </Button>
      )}

      {onRespond && (
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="w-full"
          onClick={onRespond}
          disabled={respondDisabled || respondLoading}
        >
          <HeartHandshake aria-hidden="true" /> {respondLabel}
        </Button>
      )}
    </div>
  );
}
