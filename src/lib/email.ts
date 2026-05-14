async function sendEmail(params: {
  toEmail: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.toEmail],
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${errorBody}`);
  }
}

export async function sendVerificationOtpEmail(
  toEmail: string,
  customerName: string,
  otp: string,
  expiryMinutes: number
) {
  const subject = "Verify your ship2sell account";
  const text = [
    `Hello ${customerName},`,
    "",
    "Use the OTP below to verify your ship2sell account:",
    otp,
    "",
    `This OTP expires in ${expiryMinutes} minutes.`,
    "If you did not create this account, please ignore this email.",
  ].join("\n");

  const html = `
    <p>Hello ${customerName},</p>
    <p>Use the OTP below to verify your ship2sell account:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0;">${otp}</p>
    <p>This OTP expires in <strong>${expiryMinutes} minutes</strong>.</p>
    <p>If you did not create this account, please ignore this email.</p>
  `;

  await sendEmail({ toEmail, subject, text, html });
}

export async function sendPasswordResetOtpEmail(
  toEmail: string,
  customerName: string,
  otp: string,
  expiryMinutes: number
) {
  const subject = "Reset your ship2sell password";
  const text = [
    `Hello ${customerName},`,
    "",
    "Use the OTP below to reset your ship2sell account password:",
    otp,
    "",
    `This OTP expires in ${expiryMinutes} minutes.`,
    "If you did not request this, please ignore this email.",
  ].join("\n");

  const html = `
    <p>Hello ${customerName},</p>
    <p>Use the OTP below to reset your ship2sell account password:</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0;">${otp}</p>
    <p>This OTP expires in <strong>${expiryMinutes} minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  await sendEmail({ toEmail, subject, text, html });
}

export async function sendShipmentBookedEmail(params: {
  toEmail: string;
  customerName: string;
  trackingId: string;
  referenceNo?: string | null;
  pickupCountry: string;
  destinationCountry: string;
  collectionType: string;
  weight?: number | null;
  pcs?: number | null;
  description?: string | null;
}) {
  const subject = `Shipment Booked: ${params.trackingId}`;
  const text = [
    `Hello ${params.customerName},`,
    "",
    "Your shipment has been successfully booked.",
    `Tracking ID: ${params.trackingId}`,
    params.referenceNo ? `Reference No: ${params.referenceNo}` : "",
    `Route: ${params.pickupCountry} -> ${params.destinationCountry}`,
    `Collection: ${params.collectionType.replace(/_/g, " ")}`,
    params.pcs ? `PCS: ${params.pcs}` : "",
    params.weight ? `Weight: ${params.weight} kg` : "",
    params.description ? `Contents: ${params.description}` : "",
    "",
    "You can track live progress from your ship2sell dashboard.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Hello ${params.customerName},</p>
    <p>Your shipment has been successfully booked.</p>
    <ul>
      <li><strong>Tracking ID:</strong> ${params.trackingId}</li>
      ${params.referenceNo ? `<li><strong>Reference No:</strong> ${params.referenceNo}</li>` : ""}
      <li><strong>Route:</strong> ${params.pickupCountry} -> ${params.destinationCountry}</li>
      <li><strong>Collection:</strong> ${params.collectionType.replace(/_/g, " ")}</li>
      ${params.pcs ? `<li><strong>PCS:</strong> ${params.pcs}</li>` : ""}
      ${params.weight ? `<li><strong>Weight:</strong> ${params.weight} kg</li>` : ""}
      ${params.description ? `<li><strong>Contents:</strong> ${params.description}</li>` : ""}
    </ul>
    <p>You can track live progress from your ship2sell dashboard.</p>
  `;

  await sendEmail({ toEmail: params.toEmail, subject, text, html });
}

export async function sendStatusEmail(
  toEmail: string,
  customerName: string,
  trackingId: string,
  statusName: string,
  notes: string = ""
) {
  const subject = `Milestone Update for Shipment ${trackingId}`;
  const text = [
    `Hello ${customerName},`,
    "",
    `Please be advised that your shipment ${trackingId} is now marked as: [${statusName}].`,
    notes ? `Latest Update Note: ${notes}` : "",
    "Track live updates anytime in your ship2sell Console.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <p>Hello ${customerName},</p>
    <p>Please be advised that your shipment <strong>${trackingId}</strong> is now marked as: <strong>[${statusName}]</strong>.</p>
    ${notes ? `<p><strong>Latest Update Note:</strong> ${notes}</p>` : ""}
    <p>Track live updates anytime in your ship2sell Console.</p>
  `;

  await sendEmail({ toEmail, subject, text, html });
}
