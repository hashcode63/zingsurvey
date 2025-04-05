// src/lib/email.ts
import sgMail from '@sendgrid/mail';
import { Receipt, PaymentTransaction } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import prisma from './prisma';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email template paths
const customerReceiptTemplate = fs.readFileSync(
  path.join(process.cwd(), 'src/templates/customer-receipt.html'),
  'utf-8'
);
const adminReceiptTemplate = fs.readFileSync(
  path.join(process.cwd(), 'src/templates/admin-receipt.html'),
  'utf-8'
);

// Compile templates
const compileCustomerReceipt = handlebars.compile(customerReceiptTemplate);
const compileAdminReceipt = handlebars.compile(adminReceiptTemplate);

interface ReceiptData {
  receiptNumber: string;
  transactionReference: string;
  amount: number;
  customerEmail: string;
  customerName?: string;
  date: string;
  description?: string;
}

// Send receipt to customer
export async function sendCustomerReceipt(data: ReceiptData): Promise<boolean> {
  try {
    const htmlContent = compileCustomerReceipt({
      ...data,
      formattedAmount: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(data.amount),
    });

    const message = {
      to: data.customerEmail,
      from: process.env.EMAIL_FROM || 'no-reply@zingsurvey.com',
      subject: `Receipt for Payment #${data.receiptNumber}`,
      html: htmlContent,
    };

    await sgMail.send(message);
    
    // Update receipt status in database
    await prisma.receipt.update({
      where: { receiptNumber: data.receiptNumber },
      data: { sentToCustomer: true },
    });
    
    return true;
  } catch (error) {
    console.error('Error sending customer receipt:', error);
    return false;
  }
}

// Send receipt to admin
export async function sendAdminReceipt(data: ReceiptData): Promise<boolean> {
  try {
    if (!process.env.ADMIN_EMAIL) throw new Error('Admin email not configured');
    
    const htmlContent = compileAdminReceipt({
      ...data,
      formattedAmount: new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      }).format(data.amount),
    });

    const message = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_FROM || 'no-reply@zingsurvey.com',
      subject: `New Payment Received #${data.receiptNumber}`,
      html: htmlContent,
    };

    await sgMail.send(message);
    
    // Update receipt status in database
    await prisma.receipt.update({
      where: { receiptNumber: data.receiptNumber },
      data: { sentToAdmin: true },
    });
    
    return true;
  } catch (error) {
    console.error('Error sending admin receipt:', error);
    return false;
  }
}

// Generate and send both receipts
export async function generateAndSendReceipts(
  transaction: PaymentTransaction
): Promise<void> {
  try {
    // Create receipt record
    const receiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        transactionReference: transaction.reference,
        amount: transaction.amount,
        customerEmail: transaction.customerEmail,
        adminEmail: process.env.ADMIN_EMAIL || '',
      },
    });
    
    const receiptData: ReceiptData = {
      receiptNumber,
      transactionReference: transaction.reference,
      amount: transaction.amount,
      customerEmail: transaction.customerEmail,
      customerName: transaction.customerName || '',
      date: new Date().toLocaleDateString(),
      description: transaction.description || 'Payment for survey',
    };
    
    // Send receipts
    await Promise.all([
      sendCustomerReceipt(receiptData),
      sendAdminReceipt(receiptData),
    ]);
    
    // Update transaction
    await prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: { receiptSent: true },
    });
  } catch (error) {
    console.error('Error generating receipts:', error);
  }
}