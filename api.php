<?php
header('Content-Type: application/json');

$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $stmt = $conn->prepare("INSERT INTO tasks (name) VALUES (?)");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'read':
        $result = $conn->query("SELECT * FROM tasks");
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        echo json_encode($tasks);
        break;

    case 'update':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $name = $data['name'];
        $stmt = $conn->prepare("UPDATE tasks SET name = ? WHERE id = ?");
        $stmt->bind_param("si", $name, $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    case 'delete':
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}

$conn->close();