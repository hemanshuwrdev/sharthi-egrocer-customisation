<h1 style="line-height: 24px; margin-bottom:15px; font-size: 20px;">Your login verification code</h1>

Hello{{ !empty($name) ? ' ' . $name : '' }},<br><br>

Someone is signing in to your Super Admin account. Use this code to finish signing in:<br><br>

<h2 style="letter-spacing: 4px;">{{ $otp }}</h2>

<br>
This code expires in 10 minutes and can only be used once.<br><br>

If this wasn't you, don't share the code — someone may know your password, so change it right away.
