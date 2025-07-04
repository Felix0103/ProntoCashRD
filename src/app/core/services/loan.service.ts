import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import jsPDF from 'jspdf';
import { LoanPaymentDetail } from '../interfaces/loan-payment';
import { DatePipe } from '@angular/common';
import { Capacitor } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class LoanService {

   myAppUrl: string;
    myApiUrl: string;
    constructor(private httpClient: HttpClient, private datePipe: DatePipe ) {
         this.myAppUrl= environment.apiURL;
          this.myApiUrl ='/api/v1/loans';
     }
    getLoans():Observable<any>{
        return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}` );
    }
    getLoanById(loanId: string):Observable<any>{
        return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/${loanId}` );
    }
    saveLoan(loan: any):Observable<any>{
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}`, loan );
    }
    updateLoan(loan: any, id: string):Observable<any>{
      return this.httpClient.put<any>( `${this.myAppUrl}${this.myApiUrl}/${id}`, loan );
    }
    getLoansWithPendingPayment():Observable<any>{
        return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/pending` );
    }
    storePayment(data: { loan_id: number; amount: number }) {
      return this.httpClient.post( `${this.myAppUrl}${this.myApiUrl}/storePayment`, data);
    }
    getLoanPayments(loanId: number) {
      return this.httpClient.get(`${this.myAppUrl}${this.myApiUrl}/${loanId}/paymentHistory`);
    }
    getLoanPaymentsByDateRange(startDate: string, endDate:string) {
      return this.httpClient.get(`${this.myAppUrl}${this.myApiUrl}/paymentHistoryByDateRange`,
        { params: {
          startDate: startDate,
          endDate: endDate
        }
      });
    }

    generateReceiptPDF(payment: any): Blob {
      const businessName ='Soluciones Financieras';
      const businessName2 ='Álvarez & Vilorio';

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [58, 200]  // ancho: 58mm, alto: 200mm (puedes ajustarlo)
      });

        // 🔹 Header centrado

      const pageWidth = 58;
      const textWidth = doc.getTextWidth(businessName);
      const xCentered = (pageWidth - textWidth) / 2;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(businessName, xCentered+5, 10);

      const textWidth2 = doc.getTextWidth(businessName2);
      const xCentered2 = (pageWidth - textWidth2) / 2;
      doc.text(businessName2, xCentered2, 15);


      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('RECIBO DE PAGO', 13, 20);
      doc.text(`Fecha: ${this.datePipe.transform( payment.payment_date, 'dd/MM/yyyy')}`, 3, 30);
      doc.text(`Total: RD$${Number(payment.total_amount).toFixed(2)} `, 3, 35);
      doc.setFont('helvetica', 'bold');
      doc.text('---------------------------------------------', 2, 38);
      doc.text('Cuotas:', 2, 42);

      let y = 47;
      doc.setFontSize(8);
      payment.loan_payment_details.forEach((d: any) => {
        doc.text(`Cuota #${d.loan_detail.number_quota } - RD$${Number(d.amount_applied).toFixed(2)} `, 10, y);
        y += 5;
      });
     doc.text('Gracias por su pago', 10, y);

    const blob = doc.output('blob');
    return blob;
  }


  async savePDF(blob: Blob, fileName = 'recibo.pdf'): Promise<string> {
    const base64 = await this.blobToBase64(blob);

      if (Capacitor.isNativePlatform()) {
        // PLATAFORMA NATIVA (Android, iOS)
        try {
          await Filesystem.requestPermissions(); // por si acaso
          const result = await Filesystem.writeFile({
            path: fileName,
            data: base64,
            directory: Directory.Documents,
            recursive: true,
          });
          return result.uri;
        } catch (err) {
          console.error('Error guardando en dispositivo:', err);
          throw err;
        }
      } else {
        // PLATAFORMA WEB (forzar descarga)
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        return fileName;
      }
  }
  async  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1]; // quitar encabezado MIME
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  }
  async sendReceipt(payment: any) {
    const blob = this.generateReceiptPDF(payment);
    const uri = await this.savePDF(blob, `recibo-${payment.id}.pdf`);
    await this.sharePDF(uri);
  }
  async sharePDF(uri: string) {
    await Share.share({
      title: 'Recibo de pago',
      text: 'Adjunto recibo en PDF',
      url: uri,
      dialogTitle: 'Compartir recibo',
    });
  }
  printReceipt(payment: any) {

      const contenido =
      `Soluciones Financieras\n`+
      `  Álvarez & Vilorio\n`+
      `-----------------------\n`+
      `    RECIBO DE PAGO\n`+
      `-----------------------\n`+
      `Fecha: ${this.datePipe.transform( payment.payment_date, 'dd/MM/yyyy')}\n`+
      `Total: ${Number(payment.total_amount).toFixed(2)} RD$\n`+
      `-----------------------\n`+
      `Detalle:`;

      const detalles = payment.loan_payment_details.map((d:LoanPaymentDetail) =>
        `Cuota #${d.loan_detail.number_quota} - ${Number(d.amount_applied).toFixed(2)} RD$`
      ).join('\n');

      const texto = `${contenido}\n${detalles}\n-----------------------`;

      const printWindow = window.open('', '', 'width=250,height=600');

      if (printWindow) {
       printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  width: 58mm;
                  font-family: monospace;
                  font-size: 12px;
                  white-space: pre-wrap;
                }
                pre {
                  margin: 0;
                  padding: 10px;
                  width: 58mm;
                }
              }
              body {
                font-family: monospace;
                font-size: 12px;
                width: 58mm;
                padding: 10px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <pre>${texto}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

  }
  printPayments(startDate:string, endDate: string, payments: any, totalPaid: number) {
    const contenido =
      `Soluciones Financieras\n` +
      `  Álvarez & Vilorio\n` +
      `-----------------------\n` +
      `         COBROS\n` +
      `-----------------------\n` +
      `Fecha Inicio: ${this.datePipe.transform(startDate, 'dd/MM/yyyy')}\n` +
      `Fecha Final: ${this.datePipe.transform(endDate, 'dd/MM/yyyy')}\n` +
      `Total: ${Number(totalPaid).toFixed(2)} RD$\n` +
      `-----------------------\n` +
      `Detalle:`;

    const detalles = payments.map((d: any) =>
      `Cliente: ${d.loan.client.first_name} ${d.loan.client.last_name}\n` +
      `Monto: ${Number(d.total_amount).toFixed(2)}\n` +
      `Fecha: ${this.datePipe.transform(d.payment_date, 'dd/MM/yyyy')}\n` +
      `-----------------------`
    ).join('\n');

    const texto = `${contenido}\n${detalles}\n`;

    const printWindow = window.open('', '', 'width=300,height=600'); // 300px ≈ 58mm

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  width: 58mm;
                  font-family: monospace;
                  font-size: 12px;
                  white-space: pre-wrap;
                }
                pre {
                  margin: 0;
                  padding: 10px;
                  width: 58mm;
                }
              }
              body {
                font-family: monospace;
                font-size: 12px;
                width: 58mm;
                padding: 10px;
                white-space: pre-wrap;
              }
            </style>
          </head>
          <body>
            <pre>${texto}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
