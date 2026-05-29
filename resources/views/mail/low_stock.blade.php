<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Low Stock Alert</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color:#ffffff; border-radius:6px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.05);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#37A279; padding:20px; text-align:center;">
                            <h2 style="margin:0; color:#ffffff; font-size:22px;">
                                ⚠ Low Stock Alert
                            </h2>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:25px; color:#333333;">
                            <p style="font-size:15px; margin:0 0 15px;">
                                Hello <strong>{{ $seller->name }}</strong>,
                            </p>

                            <p style="font-size:14px; margin:0 0 20px;">
                                This is to inform you that the following product is running
                                <strong style="color:#dc3545;">low on stock</strong>.
                            </p>

                            <!-- Product Box -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="border:1px solid #e5e5e5; border-radius:4px; margin-bottom:20px;">
                                <tr>
                                    <td style="padding:12px; background-color:#f9f9f9; font-size:14px;">
                                        <strong>Product Name:</strong>
                                    </td>
                                    <td style="padding:12px; font-size:14px;">
                                        {{ $product['product_name'] }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:12px; background-color:#f9f9f9; font-size:14px;">
                                        <strong>Current Stock:</strong>
                                    </td>
                                    <td style="padding:12px; font-size:14px; color:#dc3545;">
                                        {{ $product['current_stock'] }}
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size:14px; margin:0 0 10px;">
                                Please restock this product at the earliest to avoid any interruption in sales.
                            </p>

                            <p style="font-size:14px; margin:0;">
                                Thank you for your prompt attention.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f1f1f1; padding:15px; text-align:center; font-size:12px; color:#666;">
                            Regards,<br>
                            <strong>{{ config('app.name') }}</strong>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>