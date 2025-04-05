// src/utils/bankIntegration.ts
import { encrypt, decrypt } from '../lib/encryption';
import prisma from '../lib/prisma';

// Get bank account details (securely)
export function getBankDetails() {
  const accountNumber = process.env.BANK_ACCOUNT_NUMBER || '';
  const bankName = process.env.BANK_NAME || '';
  const accountHolderName = process.env.ACCOUNT_HOLDER_NAME || '';

  return {
    accountNumber,
    bankName,
    accountHolderName,
  };
}

// Store bank transaction details
export async function storeBankTransaction(
  paymentTransactionId: string,
  bankReference: string,
) {
  try {
    const bankDetails = getBankDetails();
    
    const bankTransaction = await prisma.bankTransaction.create({
      data: {
        transactionId: paymentTransactionId,
        bankReference,
        accountNumber: encrypt(bankDetails.accountNumber),
        bankName: bankDetails.bankName,
        status: 'pending',
        processingDetails: {},
      },
    });
    
    return bankTransaction;
  } catch (error) {
    console.error('Error storing bank transaction:', error);
    throw error;
  }
}

// Update bank transaction status
export async function updateBankTransactionStatus(
  bankReference: string,
  status: string,
  details: any = {}
) {
  try {
    const bankTransaction = await prisma.bankTransaction.update({
      where: { bankReference },
      data: {
        status,
        processingDetails: details,
        updatedAt: new Date(),
      },
    });
    
    // Also update the payment transaction status
    if (bankTransaction) {
      await prisma.paymentTransaction.update({
        where: { id: bankTransaction.transactionId },
        data: { status },
      });
    }
    
    return bankTransaction;
  } catch (error) {
    console.error('Error updating bank transaction:', error);
    throw error;
  }
}

// Verify a bank payment (simulated)
export async function verifyBankPayment(reference: string): Promise<boolean> {
  try {
    // In a real system, you would call your bank's API here
    // This is a simplified example
    
    // Simulate a verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update transaction status to completed (in a real system, this would depend on bank response)
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { reference },
    });
    
    if (transaction) {
      await prisma.paymentTransaction.update({
        where: { reference },
        data: { status: 'completed' },
      });
      
      // If bank transaction exists, update it too
      const bankTransaction = await prisma.bankTransaction.findUnique({
        where: { transactionId: transaction.id },
      });
      
      if (bankTransaction) {
        await prisma.bankTransaction.update({
          where: { transactionId: transaction.id },
          data: { status: 'completed' },
        });
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying bank payment:', error);
    return false;
  }
}