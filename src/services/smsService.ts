export interface SmsPayload {
  to: string;
  recipientName: string;
  templateId: string;
  messageText: string;
  timestamp: string;
  dltEntityId?: string;
  dltSenderId?: string;
}

export interface SmsSendResult {
  success: boolean;
  messageId: string;
  deliveredTo: string[];
  samplePreview: string;
  timestamp: string;
}

/**
 * Format Indian DLT compliant emergency SMS notification for registered family contacts
 * Note: Never includes full Aadhaar or unmasked medical records in raw SMS text
 */
export function formatEmergencySms(
  patientName: string,
  hospitalName: string,
  trackingUrl: string,
  ambulanceVehicle?: string
): string {
  if (ambulanceVehicle) {
    return `[SUSTHAYAN-EMERGENCY] ALERT: Emergency assistance initiated for ${patientName}. Hospital: ${hospitalName}. Ambulance (${ambulanceVehicle}) dispatched. Track live: ${trackingUrl} | Helpline: 112`;
  }
  return `[SUSTHAYAN-EMERGENCY] ALERT: Emergency assistance requested for ${patientName}. Selected Hospital: ${hospitalName}. Triage in progress. Track updates: ${trackingUrl} | Helpline: 112`;
}

/**
 * Simulated / Real SMS Gateway dispatcher
 */
export async function sendEmergencySmsAlerts(
  contacts: { name: string; phone: string; canReceiveSosSms: boolean }[],
  patientName: string,
  hospitalName: string,
  requestId: string,
  ambulanceVehicle?: string
): Promise<SmsSendResult> {
  const eligibleContacts = contacts.filter(c => c.canReceiveSosSms);
  const trackingUrl = `${window.location.origin}/?page=emergency-tracking&id=${requestId}`;
  const messageText = formatEmergencySms(patientName, hospitalName, trackingUrl, ambulanceVehicle);

  console.info(`[SUSTHAYAN SMS GATEWAY] Dispatching to ${eligibleContacts.length} numbers via DLT Gateway`);
  console.info(`[SMS BODY]:`, messageText);

  // In production, this would make an authenticated HTTPS POST to Fast2SMS / Twilio / ValueFirst / CDAC DLT gateway
  return {
    success: true,
    messageId: `SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    deliveredTo: eligibleContacts.map(c => `${c.name} (${c.phone})`),
    samplePreview: messageText,
    timestamp: new Date().toISOString()
  };
}
