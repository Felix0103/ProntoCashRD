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
      const businessName ='Soluciones Financieras Álvarez & Vilorio';
      const doc = new jsPDF();

      // Encabezado con nombre del negocio centrado
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(businessName.toUpperCase(), 105, 15, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('RECIBO DE PAGO', 10, 30);
      doc.text(`Fecha: ${payment.payment_date}`, 10, 40);
      doc.text(`Total: ${Number(payment.total_amount).toFixed(2)} RD$`, 10, 50);

      let y = 60;
      payment.loan_payment_details.forEach((d: any) => {
        doc.text(`Cuota #${d.loan_detail.number_quota } - ${Number(d.amount_applied).toFixed(2)} RD$`, 10, y);
        y += 10;
      });

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

      const w = window.open('', '', 'width=250,height=600');

      if (w) {
        w.document.write(`<pre style="font-size:14px;">${texto}</pre>`);
        w.document.close();
        w.print();
      }
  }
}
