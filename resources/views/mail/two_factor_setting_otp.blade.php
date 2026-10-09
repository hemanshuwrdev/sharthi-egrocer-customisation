<h1 style="line-height: 24px; margin-bottom:15px; font-size: 20px;">Your security verification code</h1>

Hello{{ !empty($name) ? ' ' . $name : '' }},<br><br>

A request was made to {{ $action }} two-factor authentication for the Super Admin login. Use this code to confirm it:<br><br>

<h2 style="letter-spacing: 4px;">{{ $otp }}</h2>

<br>
This code expires in 10 minutes and can only be used once.<br><br>

If you didn't make this request, ignore this email and consider changing your password.
