<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Načtení dat z formuláře
    $name = isset($_POST['name']) ? strip_tags(trim($_POST["name"])) : '';
    $surname = isset($_POST['surname']) ? strip_tags(trim($_POST["surname"])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST["phone"])) : '';
    $message = isset($_POST['message']) ? trim($_POST["message"]) : '';

    // Kontrola dat
    if (empty($name) || empty($surname) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: /kontakty.php?success=-1#contact-form");
        exit;
    }

    // Odesílání e-mailu
    $recipient = "najman.donap@seznam.cz";
    $subject = "🏋️ Máte novou zprávu od: $name $surname";
    $email_content = "Jméno: $name\n";
    $email_content .= "Příjmení: $surname\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefon: $phone\n\n";
    $email_content .= "Zpráva:\n$message\n";
    $email_headers = "From: $name <$email>\r\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $email_headers .= "MIME-Version: 1.0\r\n";

    if (mail($recipient, $subject, $email_content, $email_headers)) {
        header("Location: /kontakty.php?success=1#contact-form");
    } else {
        header("Location: /kontakty.php?success=-1#contact-form");
    }
    exit;
} else {
    echo "Žádná data nebyla přijata.";
    exit;
}
?>

