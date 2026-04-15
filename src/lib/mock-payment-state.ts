export type PaymentEventRecord = {
  id: string;
  eventType: string;
  summary: string;
  verified: boolean;
  createdAt: string;
};

const paymentEvents: PaymentEventRecord[] = [];

export function addPaymentEvent(event: PaymentEventRecord) {
  paymentEvents.unshift(event);
  if (paymentEvents.length > 20) {
    paymentEvents.length = 20;
  }
}

export function listPaymentEvents() {
  return paymentEvents;
}
