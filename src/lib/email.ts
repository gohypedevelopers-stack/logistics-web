export async function sendStatusEmail(
  customerName: string,
  trackingId: string,
  statusName: string,
  notes: string = ""
) {
  // In a real implementation this would use Resend, SendGrid, Mailgun etc.
  console.log("\n========================================================");
  console.log("[EMAIL DISPATCHED]");
  console.log(`To: Customer ${customerName}`);
  console.log(`Subject: Milestone Update for Shipment ${trackingId}`);
  console.log(`\nHello ${customerName},`);
  console.log(`Please be advised that your shipment ${trackingId} is now marked as: [${statusName}].`);
  if (notes) {
    console.log(`Latest Update Note: ${notes}`);
  }
  console.log("Track live updates anytime in your Global Navigator Console.");
  console.log("========================================================\n");
}
