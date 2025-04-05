// src/app/api/payments/webhook/route.ts
import { NextResponse } from 'next/server';
import { verifySignature } from '../../../../lib/encryption';
import { updateBankTransactionStatus } from '../../../../utils/bankIntegration';
import { generateAndSendReceipts } from '../../../../lib/email';
import prisma from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    // Get the raw body
    const text = await request.text();
    const signature = request.headers.get('x-signature') || '';
    
    // Verify webhook signature
    if (!verifySignature(text, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    const data = JSON.parse(text);
    
    // Validate webhook data
    if (!data.event || !data.reference) {
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }
    
    // Handle different webhook events
    switch (data.event) {
      case 'payment.success':
        // Find the bank transaction
        const bankTransaction = await prisma.bankTransaction.findUnique({
          where: { bankReference: data.reference },
        });
        
        if (bankTransaction) {
          // Update the bank transaction
          await updateBankTransactionStatus(
            data.reference,
            'completed',
            data.details || {}
          );
          
          // Find the payment transaction
          const paymentTransaction = await prisma.paymentTransaction.findUnique({
            where: { id: bankTransaction.transactionId },
          });
          
          if (paymentTransaction && !paymentTransaction.receiptSent) {
            // Generate and send receipts
            await generateAndSendReceipts(paymentTransaction);
          }
        }
        break;
        
      case 'payment.failed':
        await updateBankTransactionStatus(
          data.reference,
          'failed',
          data.details || {}
        );
        break;
        
      default:
        // Log unhandled event type
        console.log(`Unhandled webhook event: ${data.event}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}