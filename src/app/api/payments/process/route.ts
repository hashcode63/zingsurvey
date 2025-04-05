// src/app/api/payments/process/route.ts
import { NextResponse } from 'next/server';
import { generateReference } from '../../../../lib/encryption';
import prisma from '../../../../lib/prisma';
import { storeBankTransaction } from '../../../../utils/bankIntegration';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.amount || !data.email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      );
    }
    
    // Create a reference
    const reference = generateReference();
    
    // Get IP and user agent for security logging
    const headers = request.headers;
    const ipAddress = headers.get('x-forwarded-for') || 'unknown';
    const userAgent = headers.get('user-agent') || 'unknown';
    
    // Create payment transaction
    const transaction = await prisma.paymentTransaction.create({
      data: {
        reference,
        amount: parseFloat(data.amount),
        customerEmail: data.email,
        customerName: data.name || null,
        description: data.description || 'Survey payment',
        status: 'pending',
        ipAddress: ipAddress as string,
        userAgent: userAgent as string,
        metadata: data.metadata || {},
      },
    });
    
    // Create associated bank transaction
    const bankReference = `BANK-${Date.now()}`;
    await storeBankTransaction(transaction.id, bankReference);
    
    return NextResponse.json({
      success: true,
      reference,
      bankReference,
      amount: transaction.amount,
      // In a real implementation, you would include bank transfer details here
      bankDetails: {
        accountName: process.env.ACCOUNT_HOLDER_NAME,
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        bankName: process.env.BANK_NAME,
        reference: reference, // Customer should include this as reference when making transfer
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment request' },
      { status: 500 }
    );
  }
}