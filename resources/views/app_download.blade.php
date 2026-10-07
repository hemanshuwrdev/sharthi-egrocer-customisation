<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Open in Sarthi Wholesale App</title>
    <style>
        body { font-family: sans-serif; background: #f3f7ff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
        h1 { color: #243a6e; }
        p { color: #666; }
        a.btn { display: inline-block; margin-top: 12px; padding: 10px 24px; border: 1px solid #2f9e6b; color: #2f9e6b; border-radius: 4px; text-decoration: none; }
    </style>
</head>
<body>
    <div>
        <h1>Open this link in the app</h1>
        <p>Install or open the Sarthi Wholesale app to view this page.</p>
        @if ($intentUrl)
            <a class="btn" href="{{ $intentUrl }}">Open in app</a>
        @endif
        <a class="btn" href="{{ $playStoreUrl }}">Get it on Google Play</a>
    </div>
    @if ($intentUrl)
        <script>window.location.href = @json($intentUrl);</script>
    @endif
</body>
</html>
