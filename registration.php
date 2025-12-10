<?php
$name = $email = $password = $confirm_password = "";
$nameErr = $emailErr = $passwordErr = $confirmErr = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (empty($_POST["name"])) {
        $nameErr = "Name is required";
    } else {
        $name = $_POST["name"];
    }

    if (empty($_POST["email"])) {
        $emailErr = "Email is required";
    } else {
        $email = $_POST["email"];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format";
        }
    }

    if (empty($_POST["password"])) {
        $passwordErr = "Password is required";
    } else {
        $password = $_POST["password"];

        if (strlen($password) < 6) {
            $passwordErr = "Password must be at least 6 characters long";
        }

        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
            $passwordErr = "Password must contain at least one special character";
        }
    }

    if (empty($_POST["confirm_password"])) {
        $confirmErr = "Please confirm your password";
    } else {
        $confirm_password = $_POST["confirm_password"];
        if ($password !== $confirm_password) {
            $confirmErr = "Passwords do not match";
        }
    }
}

if ($nameErr == "" && $emailErr == "" && $passwordErr == "" && $confirmErr == "") {

    $jsonData = file_get_contents("users.json");

    $usersArray = json_decode($jsonData, true);


    if (!is_array($usersArray)) {
        $usersArray = [];
    }


    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $newUser = [
        "name" => $name,
        "email" => $email,
        "password" => $hashedPassword
    ];

    $usersArray[] = $newUser;

    file_put_contents("users.json", json_encode($usersArray, JSON_PRETTY_PRINT));

    $successMsg = "Registration Successful";
}

?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Registration</title>
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<h2>Registration Form</h2>
	<div class="form">
    	<form action="registration.php" method="POST">

        	<label for="name">Full Name:</label><br>
        	<input type="text" id="name" name="name" required>
        	<span class="error"><?php echo $nameErr; ?></span><br><br>

        	<label for="email">Email Address:</label><br>
      	    <input type="email" id="email" name="email" required>
        	<span class="error" ><?php echo $emailErr; ?></span><br><br>

        	<label for="password">Password:</label><br>
        	<input type="password" id="password" name="password" required>
        	<span class="error"><?php echo $passwordErr; ?></span><br><br>

        	<label for="confirm_password">Confirm Password:</label><br>
        	<input type="password" id="confirm_password" name="confirm_password" required>
        	<span class="error"><?php echo $confirmErr; ?></span><br><br>

        	<button type="submit">Register</button>

    	</form>
    </div>	

    <?php if (!empty($successMsg)) : ?>
    	<p class="success"><?php echo $successMsg; ?></p>
    <?php endif; ?>	
</body>
</html>
