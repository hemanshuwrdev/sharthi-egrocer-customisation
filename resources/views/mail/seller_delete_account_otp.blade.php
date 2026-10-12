<h1 style="line-height: 24px; margin-bottom:15px; font-size: 20px;">Confirm account deletion</h1>

Hello{{ !empty($name) ? ' ' . $name : '' }},<br><br>

We received a request to permanently delete your distributor account on {{ $app_name ?? 'our platform' }}.<br>

<br>
To confirm, enter this code in the Delete Account window:<br><br>

<h2 style="letter-spacing: 4px;">{{ $otp }}</h2>

<br>
This code expires in 10 minutes and works only once.<br><br>

<strong>If you did not ask to delete your account, do not share this code with anyone.</strong>
Your account stays safe until the code is entered, so you can ignore this email, and we recommend changing your password.
