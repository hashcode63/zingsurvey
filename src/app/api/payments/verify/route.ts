// src/app/api/payments/verify/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { verifyBankPayment } from '../../../../utils/bankIntegration';
import { generateAndSendReceipts } from '../../../../lib/email';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.reference) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }
    
    // Find the transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { reference: data.reference },
    });
    
    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    
    // Check if already completed
    if (transaction.status === 'completed') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        transaction: {
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
        },
      });
    }
    
    // Verify payment with bank (simulated)
    const verified = await verifyBankPayment(data.reference);
    
    if (verified) {
      // Generate and send receipts
      await generateAndSendReceipts(transaction);
      
      // Get updated transaction
      const updatedTransaction = await prisma.paymentTransaction.findUnique({
        where: { reference: data.reference },
      });
      
      return NextResponse.json({
        success: true,
        status: 'completed',
        transaction: {
          reference: updatedTransaction?.reference,
          amount: updatedTransaction?.amount,
          status: updatedTransaction?.status,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 'pending',
        message: 'Payment not yet confirmed',
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}