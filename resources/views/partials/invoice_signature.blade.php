{{-- The line above "Authorised Signatory": the distributor's uploaded signature image when they have one
     (Settings > Document numbering), otherwise their name as it has always printed.
     Pass: $seller, $name, $nameSize (px), $embed (true = inline image for the PDF renderer). --}}
@php $signatureSrc = \App\Helpers\CommonHelper::sellerSignatureSrc($seller, $embed ?? false); @endphp
@if ($signatureSrc)
    <div style="margin-bottom: 2px;">
        <img src="{{ $signatureSrc }}" alt="Signature" height="50" style="height: 50px; width: auto; max-width: 200px;">
    </div>
@else
    <div style="font-family: 'Courier New', Courier, monospace; font-size: {{ $nameSize ?? 11 }}px; margin-bottom: 2px; color: #555; font-style: italic; font-weight: bold;">
        {{ $name }}
    </div>
@endif
