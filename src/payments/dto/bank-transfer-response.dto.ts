export class BankTransferResponseDto {
  paymentId: string;
  paymentCode: string;
  qrCodeBase64: string;
  qrDataUrl: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  amount: number;
  description: string;
}
