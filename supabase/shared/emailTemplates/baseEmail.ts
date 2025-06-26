const baseEmail = (subject: string, body: string) => `
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #EFE8D6;
            color: #37251E;
        }

        .logo {
            width: 100%;
            max-width: 600px;
            margin: auto;
            text-align: center;
            padding: 20px 0;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: #FFFDFA;
            padding: 20px;
            border-radius: 12px;
            border-top: 3px solid #4C4B4B;
            border-right: 8px solid #4C4B4B;
            border-bottom: 8px solid #4C4B4B;
            border-left: 3px solid #4C4B4B;

        }

        .footer {
            width: 100%;
            max-width: 600px;
            margin: auto;
            border-top: 1px solid #4C4B4B;

        }

        h1 {
            font-size: 40px;
            margin-bottom: 20px;
            font-weight: bolder;
            letter-spacing: -1px;
            color: #37251E;
        }

        p {
            color: #555;
        }
    </style>

<body>
    <div class="logo"><img src="https://demo.frendle.space/lib/email_logo.png" alt="Frendle logo" width="100px"></div>
    <div class="container">
        <h1>${subject}</h1>
        ${body}
        <p>Best regards,<br>Your Frendle Team</p>
    </div>
    <div class="footer">
        <p style="text-align: center; font-size: 12px; color: #555;">Unsubscribe link</p>
    </div>
</body>

</html>`;

export default baseEmail;
