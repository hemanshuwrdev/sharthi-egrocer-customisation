{{-- Distributor bank details block for printed invoices (invoice, invoice PDF, loading-slip bills).
     Big enough to read comfortably on paper: 2 x 2 grid, 12px labels over 15px values.
     Pass: $bankName, $accountNumber, $ifscCode, $accountName. --}}
<div style="border: 1px solid #bbb; padding: 12px 16px; margin-bottom: 15px;">
    <div style="font-size: 15px; color: #111; margin-bottom: 10px;"><strong>Bank Details</strong></div>
    <table width="100%" style="border-collapse: collapse;">
        <tr>
            <td style="border: none; padding: 0 15px 10px 0; width: 50%; font-size: 12px; color: #555; vertical-align: top;">
                Bank Name<br>
                <strong style="font-size: 15px; color: #111;">{{ $bankName ?: '-' }}</strong>
            </td>
            <td style="border: none; padding: 0 0 10px 0; width: 50%; font-size: 12px; color: #555; vertical-align: top;">
                Bank Account Name<br>
                <strong style="font-size: 15px; color: #111;">{{ $accountName ?: '-' }}</strong>
            </td>
        </tr>
        <tr>
            <td style="border: none; padding: 0 15px 0 0; width: 50%; font-size: 12px; color: #555; vertical-align: top;">
                Account Number<br>
                <strong style="font-size: 15px; color: #111;">{{ $accountNumber ?: '-' }}</strong>
            </td>
            <td style="border: none; padding: 0; width: 50%; font-size: 12px; color: #555; vertical-align: top;">
                Bank's IFSC Code<br>
                <strong style="font-size: 15px; color: #111;">{{ $ifscCode ?: '-' }}</strong>
            </td>
        </tr>
    </table>
</div>
